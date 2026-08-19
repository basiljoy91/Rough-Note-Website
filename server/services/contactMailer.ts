import nodemailer, { type Transporter } from 'nodemailer';
import type { RuntimeConfig } from '../config.js';
import type { ContactMailer, ContactSubmissionRecord } from '../types.js';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function display(value: string | null): string {
  return value?.trim() || 'Not provided';
}

function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export class HostingerContactMailer implements ContactMailer {
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

  async send(
    record: ContactSubmissionRecord
  ): Promise<{ messageId: string | null }> {
    const attachmentSummary = record.referenceFile
      ? `${record.referenceFile.originalFileName} (${record.referenceFile.byteSize} bytes; stored securely in MySQL)`
      : 'No reference file';
    const text = [
      `New Rough Note contact request: ${record.submissionId}`,
      '',
      `Name: ${record.name}`,
      `Email: ${record.email}`,
      `Phone: ${display(record.phone)}`,
      `Website: ${display(record.website)}`,
      `Role: ${record.role}`,
      `Solution: ${record.solutionType}`,
      `Department: ${record.department}`,
      `Reference: ${attachmentSummary}`,
      '',
      'Challenge:',
      record.challengeText
    ].join('\n');
    const html = `
      <h1>New Rough Note contact request</h1>
      <p><strong>Submission:</strong> ${escapeHtml(record.submissionId)}</p>
      <table cellpadding="6" cellspacing="0" border="0">
        <tr><th align="left">Name</th><td>${escapeHtml(record.name)}</td></tr>
        <tr><th align="left">Email</th><td>${escapeHtml(record.email)}</td></tr>
        <tr><th align="left">Phone</th><td>${escapeHtml(display(record.phone))}</td></tr>
        <tr><th align="left">Website</th><td>${escapeHtml(display(record.website))}</td></tr>
        <tr><th align="left">Role</th><td>${escapeHtml(record.role)}</td></tr>
        <tr><th align="left">Solution</th><td>${escapeHtml(record.solutionType)}</td></tr>
        <tr><th align="left">Department</th><td>${escapeHtml(record.department)}</td></tr>
        <tr><th align="left">Reference</th><td>${escapeHtml(attachmentSummary)}</td></tr>
      </table>
      <h2>Challenge</h2>
      <p>${escapeHtml(record.challengeText).replaceAll('\n', '<br>')}</p>
    `;

    const info = await this.transporter.sendMail({
      from: this.config.from,
      to: this.config.to,
      replyTo: record.email,
      subject: `[Rough Note] ${record.solutionType} — ${headerSafe(record.name)}`,
      text,
      html
    });
    return { messageId: info.messageId || null };
  }
}
