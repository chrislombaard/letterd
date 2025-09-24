import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { 
  matcher: ["/admin/:path*", "/api/admin/:path*"] 
};

export function middleware(req: NextRequest) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
    console.warn("[middleware] Admin credentials not configured");
    return new NextResponse("Admin not configured", { status: 503 });
  }

  const auth = req.headers.get("authorization") || "";
  const [type, b64] = auth.split(" ");
  
  if (type !== "Basic" || !b64) {
    return challenge();
  }
  
  try {
    const [username, password] = Buffer.from(b64, "base64").toString().split(":");
    
    if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
      console.warn(`[middleware] Failed auth attempt for user: ${username}`);
      return challenge();
    }
    
    console.log(`[middleware] Admin access granted to: ${username}`);
    return NextResponse.next();
  } catch (error) {
    console.error("[middleware] Error parsing auth header:", error);
    return challenge();
  }
}

function challenge() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { 
      "WWW-Authenticate": 'Basic realm="Admin Panel"',
      "Content-Type": "text/plain"
    },
  });
}
