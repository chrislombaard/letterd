import { Resend } from 'resend';

interface MailService {
  send(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ ok: boolean; error?: string }>;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const mail: MailService = {
  async send(input) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log("[mail] No RESEND_API_KEY found, using mock email service");
        console.log(`[mail] Would send email to: ${input.to}`);
        console.log(`[mail] Subject: ${input.subject}`);
        return { ok: true };
      }

      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'newsletter@yourdomain.com',
        to: [input.to],
        subject: input.subject,
        html: input.html,
      });

      if (error) {
        console.error("[mail] Resend error:", error);
        return { ok: false, error: error.message || 'Failed to send email' };
      }

      console.log("[mail] Email sent successfully:", data?.id);
      return { ok: true };
      
    } catch (error: any) {
      console.error('[mail] Send error:', error);
      
      if (error?.message?.includes('rate limit')) {
        return {
          ok: false,
          error: 'Rate limit exceeded. Please wait a moment before sending again.',
        };
      }
      
      if (error?.message?.includes('Invalid API key')) {
        return {
          ok: false,
          error: 'Invalid Resend API key. Please check your configuration.',
        };
      }
      
      return {
        ok: false,
        error: error?.message || 'Failed to send email',
      };
    }
  },
};
