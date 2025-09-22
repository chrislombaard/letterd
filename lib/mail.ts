export interface MailService {
  send(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ ok: boolean; error?: string }>;
}

export const mail: MailService = {
  async send(input) {
    // Implement actual email sending logic here
    return { ok: true };
  },
};
