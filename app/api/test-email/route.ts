import { NextRequest, NextResponse } from "next/server";
import { mail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json();
    
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Email address is required" },
        { status: 400 }
      );
    }

    const result = await mail.send({
      to,
      subject: "Newsletter Test Email",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Test Email</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">
              <h2>🎉 Email Configuration Test Successful!</h2>
              <p>If you're reading this, your newsletter email service is working correctly.</p>
              <p><strong>Email sent at:</strong> ${new Date().toISOString()}</p>
              <p>You can now create posts and send newsletters to your subscribers!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (result.ok) {
      return NextResponse.json({ 
        ok: true, 
        message: "Test email sent successfully! Check your inbox." 
      });
    } else {
      let helpfulError = result.error;
      
      if (result.error?.includes('domain is not verified')) {
        helpfulError = `${result.error}\n\nNext steps:\n1. Go to https://resend.com/domains\n2. Add your domain and complete verification\n3. Try again after verification`;
      } else if (result.error?.includes('rate limit')) {
        helpfulError = `${result.error}\n\nTip: Wait a few seconds between requests due to Resend's rate limiting.`;
      }
      
      return NextResponse.json(
        { ok: false, error: helpfulError },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("[test-email] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}