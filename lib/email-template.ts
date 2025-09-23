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
  const { title, subject, bodyHtml, unsubscribeUrl = '#' } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #007bff; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .header h1 {
          margin: 0;
          color: #007bff;
          font-size: 24px;
          font-weight: 600;
        }
        .content { 
          margin-bottom: 30px; 
          padding: 0 20px;
        }
        .content h2 {
          color: #333;
          font-size: 20px;
          margin-bottom: 20px;
          border-left: 4px solid #007bff;
          padding-left: 15px;
        }
        .footer { 
          text-align: center; 
          border-top: 1px solid #eee; 
          padding-top: 20px; 
          color: #666; 
          font-size: 14px; 
        }
        .unsubscribe { 
          margin-top: 20px; 
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .unsubscribe a { 
          color: #007bff; 
          text-decoration: none; 
          margin: 0 10px;
        }
        .unsubscribe a:hover {
          text-decoration: underline;
        }
        @media only screen and (max-width: 600px) {
          .container {
            padding: 10px;
          }
          .content {
            padding: 0 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Newsletter</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          ${bodyHtml}
        </div>
        <div class="footer">
          <p>Thank you for subscribing to our newsletter!</p>
          <p>Stay updated with our latest content and insights.</p>
          <div class="unsubscribe">
            <p>
              <a href="${unsubscribeUrl}">Unsubscribe</a> | 
              <a href="#">Update preferences</a> | 
              <a href="#">View in browser</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `.trim();
}

export default generateNewsletterEmail;