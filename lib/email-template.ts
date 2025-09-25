/**
 * Email template for newsletter delivery
 */

interface EmailTemplateData {
  title: string;
  subject: string;
  bodyHtml: string;
  subscriberEmail?: string;
  unsubscribeUrl?: string;
}

export function generateNewsletterEmail(data: EmailTemplateData): string {
  const { title, subject, bodyHtml, unsubscribeUrl = "#" } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        /* Reset & Base Styles */
        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.6; 
          color: #000000; 
          background-color: #ffffff;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        /* Main Container */
        .email-wrapper {
          background-color: #ffffff;
          padding: 0;
          min-height: 100vh;
        }
        
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff;
        }
        
        /* Header Styles */
        .header { 
          background-color: #ffffff;
          padding: 40px 30px;
          text-align: center;
          border-bottom: 1px solid #000000;
        }
        
        .logo h1 {
          margin: 0;
          color: #000000;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 0.1em;
        }
        
        .logo .tagline {
          color: #666666;
          font-size: 14px;
          margin-top: 8px;
          font-weight: 400;
        }
        
        /* Content Area */
        .content { 
          padding: 40px 30px;
        }
        
        .content h1 {
          color: #000000;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 30px 0;
          line-height: 1.4;
        }
        
        .content h2 {
          color: #000000;
          font-size: 20px;
          font-weight: 600;
          margin: 30px 0 15px 0;
          line-height: 1.4;
        }
        
        .content h3 {
          color: #000000;
          font-size: 18px;
          font-weight: 500;
          margin: 25px 0 10px 0;
        }
        
        .content p {
          margin: 0 0 20px 0;
          color: #000000;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .content a {
          color: #000000;
          text-decoration: underline;
          font-weight: 400;
        }
        
        .content a:hover {
          color: #666666;
        }
        
        .content ul, .content ol {
          margin: 0 0 20px 0;
          padding-left: 20px;
        }
        
        .content li {
          margin-bottom: 8px;
          color: #000000;
        }
        
        .content blockquote {
          border-left: 2px solid #000000;
          padding: 20px 0 20px 20px;
          margin: 25px 0;
          font-style: italic;
          color: #000000;
        }
        
        .content img {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
        }
        
        /* Divider */
        .divider {
          height: 1px;
          background-color: #cccccc;
          margin: 30px 0;
        }
        
        /* Footer Styles */
        .footer { 
          background-color: #ffffff;
          padding: 30px 30px;
          text-align: center;
          border-top: 1px solid #cccccc;
        }
        
        .footer-content {
          color: #666666;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .footer-content p {
          margin: 0 0 15px 0;
        }
        
        .social-links {
          margin: 20px 0;
        }
        
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #000000;
          text-decoration: none;
        }
        
        .social-links a:hover {
          color: #666666;
        }
        
        .unsubscribe { 
          margin-top: 30px; 
          padding-top: 20px;
          border-top: 1px solid #eeeeee;
        }
        
        .unsubscribe p {
          margin: 0 0 10px 0;
          font-size: 12px;
          color: #999999;
          line-height: 1.4;
        }
        
        .unsubscribe a { 
          color: #000000; 
          text-decoration: underline; 
          margin: 0 5px;
        }
        
        .unsubscribe a:hover {
          color: #666666;
        }
        
        /* Responsive Design */
        @media only screen and (max-width: 600px) {
          .container {
            margin: 0;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .logo h1 {
            font-size: 24px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .content h1 {
            font-size: 22px;
          }
          
          .content h2 {
            font-size: 18px;
          }
          
          .footer {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">
              <h1>letterd</h1>
              <div class="tagline">Personal Newsletter Platform</div>
            </div>
          </div>
          
          <div class="content">
            <h1>${title}</h1>
            <div class="divider"></div>
            ${bodyHtml}
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <p><strong>Thanks for being a subscriber!</strong></p>
              <p>We're committed to bringing you valuable content and insights.</p>
              
              <div class="social-links">
                <a href="#">Email</a>
                <a href="#">Twitter</a>
                <a href="#">LinkedIn</a>
                <a href="#">Website</a>
              </div>
            </div>
            
            <div class="unsubscribe">
              <p>
                <a href="${unsubscribeUrl}">Unsubscribe</a> •
                <a href="#">Update Preferences</a> •
                <a href="#">View Online</a>
              </p>
              <p style="margin-top: 10px; font-size: 12px;">
                You're receiving this because you subscribed to our newsletter.<br>
                © 2025 letterd. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `.trim();
}

export default generateNewsletterEmail;
