import { GET, POST } from "./route";
import { NextRequest } from "next/server";

const baseUrl = "http://localhost/api/";

describe("Tasks API", () => {
  it("should list tasks (GET)", async () => {
    const request = new NextRequest(`${baseUrl}tasks`);
    const response = await GET(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("ok", true);
    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("tasks");
    expect(Array.isArray(data.tasks)).toBe(true);
  });

  it("should filter tasks by status (GET)", async () => {
    const request = new NextRequest(`${baseUrl}tasks?status=pending`);
    const response = await GET(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("ok", true);
    expect(Array.isArray(data.tasks)).toBe(true);
  });

  it("should create a new task with valid data (POST)", async () => {
    const request = new NextRequest(`${baseUrl}tasks`, {
      method: "POST",
      body: JSON.stringify({
        type: "email.send",
        payload: {
          to: "test@example.com",
          subject: "Test",
          html: "<p>Test</p>",
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toMatchObject({
      ok: true,
      id: expect.any(String),
    });
  });

  it("should create a scheduled task with runAt (POST)", async () => {
    const futureDate = new Date(Date.now() + 60 * 1000).toISOString();
    const request = new NextRequest(`${baseUrl}tasks`, {
      method: "POST",
      body: JSON.stringify({
        type: "demo.cleanup",
        runAt: futureDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toMatchObject({
      ok: true,
      id: expect.any(String),
    });
  });

  it("should return 400 for missing type (POST)", async () => {
    const request = new NextRequest(`${baseUrl}tasks`, {
      method: "POST",
      body: JSON.stringify({
        payload: { test: "data" },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toMatchObject({
      ok: false,
      error: "type_required",
    });
  });

  it("should return 400 for invalid JSON (POST)", async () => {
    const request = new NextRequest(`${baseUrl}tasks`, {
      method: "POST",
      body: "invalid json",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toMatchObject({
      ok: false,
      error: "invalid_json",
    });
  });

  it("should return 400 for invalid runAt date (POST)", async () => {
    const request = new NextRequest(`${baseUrl}tasks`, {
      method: "POST",
      body: JSON.stringify({
        type: "demo.cleanup",
        runAt: "invalid-date",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toMatchObject({
      ok: false,
      error: "invalid_runAt",
    });
  });
});
