import nodemailer, { type Transporter } from 'nodemailer';
import type { RuntimeConfig } from '../config.js';
import type { BookingMailer, BookingConfirmationMessage } from '../types.js';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function readableDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(date);
}

export class HostingerBookingMailer implements BookingMailer {
  private readonly transporter: Transporter;

  constructor(private readonly config: RuntimeConfig['mail']) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.password },
      connectionTimeout: config.timeoutMs,
      greetingTimeout: config.timeoutMs,
      socketTimeout: config.timeoutMs
    });
  }

  async sendConfirmation(
    message: BookingConfirmationMessage
  ): Promise<{ messageId: string | null }> {
    const { booking } = message;
    const date = readableDate(booking.startAt);
    const joinLine = booking.meetingUrl
      ? `Join Google Meet: ${booking.meetingUrl}`
      : 'Meeting mode: Rough Note studio visit';
    const text = [
      `Hi ${booking.name},`,
      '',
      'Your Rough Note strategy consultation is confirmed.',
      `When: ${date}`,
      joinLine,
      `Booking: ${booking.bookingId}`,
      '',
      `Cancel or reschedule: ${message.manageUrl}`,
      '',
      'Bring the rough version. We will help make it clear.'
    ].join('\n');
    const html = `
      <div style="background:#f3ead9;padding:32px;font-family:Arial,sans-serif;color:#241f19">
        <div style="max-width:620px;margin:auto;background:#fffaf0;border:1px solid #d9c8aa;padding:36px">
          <p style="color:#b65322;font-weight:700;letter-spacing:.08em">ROUGH NOTE</p>
          <h1 style="font-family:Georgia,serif;font-size:38px;margin:10px 0">Your conversation is booked.</h1>
          <p>Hi ${escapeHtml(booking.name)}, your free strategy consultation is confirmed.</p>
          <div style="background:#fff3be;border-left:5px solid #e1a51b;padding:18px;margin:24px 0">
            <strong>${escapeHtml(date)}</strong><br>
            ${booking.meetingUrl ? `<a href="${escapeHtml(booking.meetingUrl)}">Join your Google Meet room</a>` : 'Rough Note studio visit'}
          </div>
          <p>Booking reference: <strong>${escapeHtml(booking.bookingId)}</strong></p>
          <p><a href="${escapeHtml(message.manageUrl)}" style="display:inline-block;background:#d86e2f;color:#fff;text-decoration:none;padding:13px 20px">Cancel or reschedule</a></p>
          <p style="color:#655b50">Bring the rough version. We’ll help make it clear.</p>
        </div>
      </div>`;
    const info = await this.transporter.sendMail({
      from: this.config.from,
      to: booking.email,
      replyTo: this.config.to,
      subject: 'Your Rough Note strategy consultation is confirmed',
      text,
      html
    });
    return { messageId: info.messageId || null };
  }
}
