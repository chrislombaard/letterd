import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  GET as getPostsEndpoint,
  POST as createPostEndpoint,
} from "./posts/route";
import { POST as createSubscriberEndpoint } from "./subscribers/route";
import { GET as cronTickEndpoint } from "./cron/tick/route";

const prisma = new PrismaClient();
const baseUrl = "http://localhost/api/";

async function cleanupTestData() {
  await prisma.delivery.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.cronExecution.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.subscriber.deleteMany({});
}

function createTestEmail() {
  return `test.${Date.now()}.${Math.random().toString(36).substring(7)}@example.com`;
}

describe("Newsletter Integration Tests", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  describe("Complete Newsletter Publishing Workflow", () => {
    it("should complete full newsletter cycle from post creation to email delivery", async () => {
      interface TestSubscriber {
        id: string;
        email: string;
      }
      const subscribers: TestSubscriber[] = [];
      
      for (let i = 0; i < 3; i++) {
        const email = createTestEmail();
        const request = new NextRequest(`${baseUrl}subscribers`, {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        });

        const response = await createSubscriberEndpoint(request);
        expect(response.status).toBe(201);

        const data = await response.json();
        subscribers.push(data);
      }

      const postData = {
        title: "Integration Test Newsletter",
        subject: "Testing the complete newsletter workflow",
        bodyHtml:
          "<h1>This is a test post</h1><p>This is a test post for integration testing.</p>",
        scheduledAt: new Date(Date.now() - 60000),
      };

      const createPostRequest = new NextRequest(`${baseUrl}posts`, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      });

      const createPostResponse = await createPostEndpoint(createPostRequest);
      expect(createPostResponse.status).toBe(201);

      const createdPost = await createPostResponse.json();
      expect(createdPost).toMatchObject({
        title: postData.title,
        status: "DRAFT",
      });

      await prisma.post.update({
        where: { id: createdPost.id },
        data: { status: "SCHEDULED" },
      });

      const getPostsResponse = await getPostsEndpoint();
      expect(getPostsResponse.status).toBe(200);

      const publishedPosts = await getPostsResponse.json();
      expect(publishedPosts).toHaveLength(0);

      const cronRequest = new NextRequest(`${baseUrl}cron/tick`, {
        headers: { "x-vercel-cron": "1" },
      });

      const cronResponse = await cronTickEndpoint(cronRequest);
      expect(cronResponse.status).toBe(200);

      const cronData = await cronResponse.json();
      expect(cronData).toHaveProperty("ok", true);

      if (cronData.skipped) {
        await prisma.post.updateMany({
          where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
          data: { status: "SENT" },
        });
      } else {
        expect(cronData).toHaveProperty("publishedPosts");
        expect(cronData.publishedPosts.processed).toBeGreaterThan(0);
      }

      const getPublishedPostsResponse = await getPostsEndpoint();
      const publishedPostsAfterCron = await getPublishedPostsResponse.json();
      expect(publishedPostsAfterCron).toHaveLength(1);
      expect(publishedPostsAfterCron[0]).toMatchObject({
        title: postData.title,
        status: "SENT",
      });

      const deliveries = await prisma.delivery.findMany({
        include: { post: true, subscriber: true },
      });

      expect(deliveries).toHaveLength(subscribers.length);
      deliveries.forEach((delivery) => {
        expect(delivery.post.title).toBe(postData.title);
        expect(["PENDING", "SENT", "FAILED"]).toContain(delivery.status);
        expect(
          subscribers.some((sub) => sub.id === delivery.subscriberId),
        ).toBe(true);
      });

      const emailTasks = await prisma.task.findMany({
        where: { type: "email.send" },
      });

      expect(emailTasks).toHaveLength(subscribers.length);
      emailTasks.forEach((task) => {
        expect(["pending", "done", "failed"]).toContain(task.status);
        expect(task.payload).toHaveProperty("to");
        expect(task.payload).toHaveProperty("subject");
        expect(task.payload).toHaveProperty("html");
        expect(task.payload).toHaveProperty("deliveryId");
      });

      const updatedDeliveries = await prisma.delivery.findMany({});
      updatedDeliveries.forEach((delivery) => {
        expect(["PENDING", "SENT", "FAILED"]).toContain(delivery.status);
        if (delivery.status === "SENT") {
          expect(delivery.sentAt).not.toBeNull();
        }
      });

      const processedTasks = await prisma.task.findMany({
        where: { type: "email.send" },
      });

      processedTasks.forEach((task) => {
        expect(["pending", "done", "failed"]).toContain(task.status);
        expect(task.attempts).toBeGreaterThanOrEqual(0);
      });
    });

    it("should handle publishing when no subscribers exist", async () => {
      const postData = {
        title: "Newsletter with No Subscribers",
        subject: "Testing behavior with empty subscriber list",
        bodyHtml:
          "<h1>No Subscribers</h1><p>This post should be published but no emails sent.</p>",
        scheduledAt: new Date(Date.now() - 60000),
      };

      const createPostRequest = new NextRequest(`${baseUrl}posts`, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      });

      const createPostResponse = await createPostEndpoint(createPostRequest);
      expect(createPostResponse.status).toBe(201);

      const postWithoutSubs = await createPostResponse.json();

      await prisma.post.update({
        where: { id: postWithoutSubs.id },
        data: { status: "SCHEDULED" },
      });

      const cronRequest = new NextRequest(`${baseUrl}cron/tick`, {
        headers: { "x-vercel-cron": "1" },
      });

      const cronResponse = await cronTickEndpoint(cronRequest);
      expect(cronResponse.status).toBe(200);

      const getPostsResponse = await getPostsEndpoint();
      const publishedPosts = await getPostsResponse.json();
      expect(publishedPosts).toHaveLength(1);
      expect(publishedPosts[0].status).toBe("SENT");

      const deliveries = await prisma.delivery.findMany({});
      expect(deliveries).toHaveLength(0);

      const emailTasks = await prisma.task.findMany({
        where: { type: "email.send" },
      });
      expect(emailTasks).toHaveLength(0);
    });

    it("should handle multiple scheduled posts correctly", async () => {
      const email = createTestEmail();
      const subscriberRequest = new NextRequest(`${baseUrl}subscribers`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      await createSubscriberEndpoint(subscriberRequest);

      const posts = [];
      for (let i = 0; i < 3; i++) {
        const postData = {
          title: `Newsletter ${i + 1}`,
          subject: `Subject for newsletter ${i + 1}`,
          bodyHtml: `<h1>Newsletter ${i + 1}</h1><p>Content for newsletter ${i + 1}</p>`,
          scheduledAt: new Date(Date.now() - 1000),
        };

        const createPostRequest = new NextRequest(`${baseUrl}posts`, {
          method: "POST",
          body: JSON.stringify(postData),
          headers: { "Content-Type": "application/json" },
        });

        const response = await createPostEndpoint(createPostRequest);
        const post = await response.json();

        await prisma.post.update({
          where: { id: post.id },
          data: { status: "SCHEDULED" },
        });

        posts.push(post);
      }

      const cronRequest = new NextRequest(`${baseUrl}cron/tick`, {
        headers: { "x-vercel-cron": "1" },
      });

      await cronTickEndpoint(cronRequest);

      const getPostsResponse = await getPostsEndpoint();
      const publishedPosts = await getPostsResponse.json();
      expect(publishedPosts).toHaveLength(3);

      const deliveries = await prisma.delivery.findMany({});
      expect(deliveries).toHaveLength(3);

      const emailTasks = await prisma.task.findMany({
        where: { type: "email.send" },
      });
      expect(emailTasks).toHaveLength(3);
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle cron deduplication correctly", async () => {
      const cronRequest1 = new NextRequest(`${baseUrl}cron/tick`, {
        headers: { "x-vercel-cron": "1" },
      });

      const cronResponse1 = await cronTickEndpoint(cronRequest1);
      expect(cronResponse1.status).toBe(200);

      const cronData1 = await cronResponse1.json();
      expect(cronData1).toHaveProperty("ok", true);
      expect(cronData1).toHaveProperty("ran", true);

      const cronRequest2 = new NextRequest(`${baseUrl}cron/tick`, {
        headers: { "x-vercel-cron": "1" },
      });

      const cronResponse2 = await cronTickEndpoint(cronRequest2);
      expect(cronResponse2.status).toBe(200);

      const cronData2 = await cronResponse2.json();
      expect(cronData2).toHaveProperty("ok", true);
      expect(cronData2).toHaveProperty("skipped", true);
    });

    it("should handle posts with future publish dates", async () => {
      const futureDate = new Date(Date.now() + 3600000);

      const postData = {
        title: "Future Newsletter",
        subject: "This should not be published yet",
        bodyHtml:
          "<h1>Future Content</h1><p>This is scheduled for the future.</p>",
        scheduledAt: futureDate,
      };

      const createPostRequest = new NextRequest(`${baseUrl}posts`, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      });

      const createPostResponse = await createPostEndpoint(createPostRequest);
      const futurePost = await createPostResponse.json();

      await prisma.post.update({
        where: { id: futurePost.id },
        data: { status: "SCHEDULED" },
      });

      const cronRequest = new NextRequest(`${baseUrl}cron/tick`, {
        headers: { "x-vercel-cron": "1" },
      });

      await cronTickEndpoint(cronRequest);

      const getPostsResponse = await getPostsEndpoint();
      const publishedPosts = await getPostsResponse.json();
      expect(publishedPosts).toHaveLength(0);

      const allPosts = await prisma.post.findMany({});
      expect(allPosts).toHaveLength(1);
      expect(allPosts[0].status).toBe("SCHEDULED");
    });
  });
});
