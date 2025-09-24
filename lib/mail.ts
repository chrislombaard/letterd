import sgMail from '@sendgrid/mail';
import { ErrorHandler } from './errors';

interface MailService {
  send(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ ok: boolean; error?: string }>;
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const mail: MailService = {
  async send(input) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log("[mail] No SENDGRID_API_KEY found, using mock email service");
        console.log(`[mail] Would send email to: ${input.to}`);
        console.log(`[mail] Subject: ${input.subject}`);
        return { ok: true };
      }

      await sgMail.send({
        to: input.to,
        from: process.env.FROM_EMAIL || 'test@example.com',
        subject: input.subject,
        html: input.html,
      });

      console.log("[mail] Email sent successfully via SendGrid");
      return { ok: true };
      
    } catch (error: unknown) {
      console.error('[mail] SendGrid error:', error);
      
      try {
        const emailError = ErrorHandler.handleEmailError(error);
        return { ok: false, error: emailError.message };
      } catch (handlerError) {
        console.error('[mail] Error handler failed:', handlerError);
        return {
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown email error',
        };
      }
    }
  },
};
