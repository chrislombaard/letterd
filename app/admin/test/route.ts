import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Admin access granted",
    timestamp: new Date().toISOString(),
    note: "This route is protected by Basic Auth middleware"
  });
}