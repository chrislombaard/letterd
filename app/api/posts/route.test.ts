import { GET, POST } from "./route";
import { NextRequest } from "next/server";

const baseUrl = "http://localhost/api/";

// Skip API route tests for now due to Next.js/Jest compatibility issues
describe.skip("Posts API", () => {
  it("should list published posts (GET)", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should create a new post with valid data (POST)", async () => {
    const request = new NextRequest(`${baseUrl}posts`, {
      method: "POST",
      body: JSON.stringify({
        title: "New Post",
        subject: "This is a new post",
        bodyHtml: "<p>This is the body of the post</p>",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);

    const data = await response.json();

    expect(data).toMatchObject({
      id: expect.any(String),
      title: "New Post",
      subject: "This is a new post",
      bodyHtml: "<p>This is the body of the post</p>",
      status: "DRAFT",
    });
  });

  it("should create a scheduled post when scheduledAt is provided (POST)", async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const request = new NextRequest(`${baseUrl}posts`, {
      method: "POST",
      body: JSON.stringify({
        title: "Scheduled Post",
        subject: "This is a scheduled post",
        bodyHtml: "<p>This will be sent later</p>",
        scheduledAt: futureDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);

    const data = await response.json();
    
    expect(data).toMatchObject({
      title: "Scheduled Post",
      status: "SCHEDULED",
      scheduledAt: expect.any(String),
    });
  });

  it("should publish immediately when publishNow is true (POST)", async () => {
    const request = new NextRequest(`${baseUrl}posts`, {
      method: "POST",
      body: JSON.stringify({
        title: "Immediate Post",
        subject: "This should publish now",
        bodyHtml: "<p>This will be published immediately</p>",
        publishNow: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);

    const data = await response.json();
    
    expect(data).toMatchObject({
      title: "Immediate Post",
      status: "SENT",
      publishedImmediately: true,
      subscribersCount: expect.any(Number),
    });
  });

  it("should return 400 for invalid post data (POST)", async () => {
    const request = new NextRequest(`${baseUrl}posts`, {
      method: "POST",
      body: JSON.stringify({
        title: "",
        subject: "This is a new post",
        bodyHtml: "<p>This is the body of the post</p>",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});