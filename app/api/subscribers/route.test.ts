import { POST } from "./route";
import { NextRequest } from "next/server";

const baseUrl = "http://localhost/api/";

describe("Subscribers API", () => {
  it("should create a new subscriber with valid email (POST)", async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const request = new NextRequest(`${baseUrl}subscribers`, {
      method: "POST",
      body: JSON.stringify({
        email: uniqueEmail,
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
      email: uniqueEmail,
      status: "ACTIVE",
    });
  });

  it("should return 400 for missing email (POST)", async () => {
    const request = new NextRequest(`${baseUrl}subscribers`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toContain("expected string, received undefined");
  });

  it("should return 400 for invalid email format (POST)", async () => {
    const request = new NextRequest(`${baseUrl}subscribers`, {
      method: "POST",
      body: JSON.stringify({
        email: "invalid-email",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error", "Invalid email format");
  });

  it("should return 409 for duplicate email (POST)", async () => {
    const uniqueEmail = `duplicate-${Date.now()}@example.com`;

    const firstRequest = new NextRequest(`${baseUrl}subscribers`, {
      method: "POST",
      body: JSON.stringify({
        email: uniqueEmail,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await POST(firstRequest);

    const duplicateRequest = new NextRequest(`${baseUrl}subscribers`, {
      method: "POST",
      body: JSON.stringify({
        email: uniqueEmail,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(duplicateRequest);
    expect(response.status).toBe(409);

    const data = await response.json();
    expect(data).toHaveProperty("error", "Email already subscribed");
  });
});
