import { describe, expect, it } from 'vitest';
import { redactText, safeErrorSummary } from '../../server/services/safeLogger.js';

describe('safe operational logging', () => {
  it('redacts email addresses, IP addresses, credentials and URL tokens', () => {
    const input =
      'ada@example.com from 203.0.113.42 used Bearer abc.def.ghi ' +
      'password=hunter2 at https://roughnote.test/path?token=very-secret-token';
    const output = redactText(input);

    expect(output).not.toContain('ada@example.com');
    expect(output).not.toContain('203.0.113.42');
    expect(output).not.toContain('abc.def.ghi');
    expect(output).not.toContain('hunter2');
    expect(output).not.toContain('very-secret-token');
    expect(output).toContain('[email redacted]');
    expect(output).toContain('[ip redacted]');
  });

  it('stores a bounded redacted error summary', () => {
    const summary = safeErrorSummary(
      new Error(`SMTP rejected person@example.com password=oops ${'x'.repeat(800)}`)
    );
    expect(summary.length).toBeLessThanOrEqual(500);
    expect(summary).not.toContain('person@example.com');
    expect(summary).not.toContain('oops');
  });
});
