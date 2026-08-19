const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const IPV4_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const IPV6_PATTERN = /\b(?:[A-F0-9]{0,4}:){2,7}[A-F0-9]{0,4}\b/gi;
const URL_SECRET_PATTERN =
  /([?&](?:token|code|key|secret|password|refresh_token|access_token)=)[^&#\s]+/gi;
const NAMED_SECRET_PATTERN =
  /\b(bearer|password|secret|access[_ -]?token|refresh[_ -]?token|client[_ -]?secret)\b\s*[:=]\s*[^\s,;]+/gi;
const AUTHORIZATION_PATTERN = /\b(?:Basic|Bearer)\s+[A-Za-z0-9._~+/=-]+/gi;

export function redactText(value: string): string {
  return value
    .replace(URL_SECRET_PATTERN, '$1[redacted]')
    .replace(AUTHORIZATION_PATTERN, '[authorization redacted]')
    .replace(NAMED_SECRET_PATTERN, '$1=[redacted]')
    .replace(EMAIL_PATTERN, '[email redacted]')
    .replace(IPV4_PATTERN, '[ip redacted]')
    .replace(IPV6_PATTERN, '[ip redacted]');
}

export function safeErrorSummary(error: unknown): string {
  if (!(error instanceof Error)) return 'Unknown operational error';
  return redactText(error.message || error.name).slice(0, 500);
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('code' in error)) return undefined;
  const code = String(error.code);
  return /^[A-Z0-9_-]{2,80}$/i.test(code) ? code : undefined;
}

type LogLevel = 'info' | 'warn' | 'error';

function writeLog(
  level: LogLevel,
  event: string,
  details: Readonly<Record<string, string | number | boolean | null | undefined>> = {},
  error?: unknown
) {
  const safeDetails = Object.fromEntries(
    Object.entries(details)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        typeof value === 'string' ? redactText(value).slice(0, 500) : value
      ])
  );
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...safeDetails,
    ...(error
      ? {
          errorCode: errorCode(error) ?? 'UNCLASSIFIED',
          errorSummary: safeErrorSummary(error)
        }
      : {})
  };
  const line = `${JSON.stringify(record)}\n`;
  if (level === 'info') process.stdout.write(line);
  else process.stderr.write(line);
}

export const logger = {
  info(event: string, details?: Parameters<typeof writeLog>[2]) {
    writeLog('info', event, details);
  },
  warn(event: string, details?: Parameters<typeof writeLog>[2], error?: unknown) {
    writeLog('warn', event, details, error);
  },
  error(event: string, details?: Parameters<typeof writeLog>[2], error?: unknown) {
    writeLog('error', event, details, error);
  }
};
