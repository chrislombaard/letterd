import { GET, POST } from "./route";
import { NextRequest } from "next/server";

const baseUrl = "http://localhost/api/";
describe("Campaigns API", () => {
  it("should list campaigns (GET)", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should create a new campaign with valid data (POST)", async () => {
    const request = new NextRequest(`${baseUrl}campaigns`, {
      method: "POST",
      body: JSON.stringify({
        name: "New Campaign",
        subject: "This is a new campaign",
        bodyHtml: "<p>This is the body of the campaign</p>",
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
      name: "New Campaign",
      subject: "This is a new campaign",
      bodyHtml: "<p>This is the body of the campaign</p>",
    });
  });

  it("should return 400 for invalid campaign data (POST)", async () => {
    const request = new NextRequest(`${baseUrl}campaigns`, {
      method: "POST",
      body: JSON.stringify({
        name: "",
        subject: "This is a new campaign",
        bodyHtml: "<p>This is the body of the campaign</p>",
      }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error");
  });
});
