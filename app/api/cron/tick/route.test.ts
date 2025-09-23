import { GET } from "./route";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const baseUrl = "http://localhost/api/";
const prisma = new PrismaClient();

async function cleanupCronExecutions() {
  await prisma.cronExecution.deleteMany({});
}

describe("Cron Tick API", () => {
  it("should return 401 for unauthorized access", async () => {
    const request = new NextRequest(`${baseUrl}cron/tick`);
    const response = await GET(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toMatchObject({
      ok: false,
      error: "unauthorized",
    });
  });

  it("should accept request with valid secret", async () => {
    const originalSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-secret";
    
    const request = new NextRequest(`${baseUrl}cron/tick?secret=test-secret`);
    const response = await GET(request);
    
    if (originalSecret) {
      process.env.CRON_SECRET = originalSecret;
    } else {
      delete process.env.CRON_SECRET;
    }
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("ok", true);
  });

  it("should accept request with Vercel cron header", async () => {
    const request = new NextRequest(`${baseUrl}cron/tick`, {
      headers: {
        "x-vercel-cron": "1",
      },
    });
    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("ok", true);
  });

  it("should return skipped response for duplicate execution within same hour", async () => {
    await cleanupCronExecutions();
    
    const request1 = new NextRequest(`${baseUrl}cron/tick`, {
      headers: {
        "x-vercel-cron": "1",
      },
    });
    await GET(request1);

    const request2 = new NextRequest(`${baseUrl}cron/tick`, {
      headers: {
        "x-vercel-cron": "1",
      },
    });
    const response = await GET(request2);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("ok", true);
    expect(data).toHaveProperty("skipped", true);
  });

  it("should process due tasks when called", async () => {
    await cleanupCronExecutions();
    
    const request = new NextRequest(`${baseUrl}cron/tick`, {
      headers: {
        "x-vercel-cron": "1",
      },
    });
    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("ok", true);
    
    if (data.skipped) {
      expect(data).toHaveProperty("skipped", true);
      expect(data).toHaveProperty("window", expect.any(String));
    } else {
      expect(data).toHaveProperty("publishedPosts");
      expect(data).toHaveProperty("processed", expect.any(Number));
      expect(data).toHaveProperty("pending", expect.any(Number));
      expect(data).toHaveProperty("failed", expect.any(Number));
    }
  });
});