import nodemailer, { type Transporter } from 'nodemailer';
import type { RuntimeConfig } from '../config.js';
import type {
  NewsletterMailer,
  NewsletterVerificationMessage
} from '../types.js';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export class HostingerNewsletterMailer implements NewsletterMailer {
  private readonly transporter: Transporter;

  constructor(private readonly config: RuntimeConfig['mail']) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password
      },
      connectionTimeout: config.timeoutMs,
      greetingTimeout: config.timeoutMs,
      socketTimeout: config.timeoutMs
    });
  }

  async sendVerification(
    message: NewsletterVerificationMessage
  ): Promise<{ messageId: string | null }> {
    const verificationUrl = escapeHtml(message.verificationUrl);
    const unsubscribeUrl = escapeHtml(message.unsubscribeUrl);
    const text = [
      'Confirm your Rough Note newsletter subscription',
      '',
      'Confirm your email address by opening this link:',
      message.verificationUrl,
      '',
      'If you did not request this, you can ignore this email or unsubscribe:',
      message.unsubscribeUrl
    ].join('\n');
    const html = `
      <h1>One more small step</h1>
      <p>Confirm your email address to receive Rough Note stories and ideas.</p>
      <p><a href="${verificationUrl}">Confirm my subscription</a></p>
      <p>If you did not request this, no subscription will be activated.</p>
      <p><a href="${unsubscribeUrl}">Unsubscribe this address</a></p>
    `;
    const info = await this.transporter.sendMail({
      from: this.config.from,
      to: message.email,
      subject: 'Confirm your Rough Note newsletter subscription',
      text,
      html,
      headers: {
        'List-Unsubscribe': `<${message.unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    });
    return { messageId: info.messageId || null };
  }
}

