const DEFAULT_TIMEOUT_MS = 10_000;

declare global {
  interface Window {
    ROUGH_NOTE_NEWSLETTER_ENDPOINT?: string;
  }
}

function endpoint(): string {
  return window.ROUGH_NOTE_NEWSLETTER_ENDPOINT?.trim() || '/api/newsletter/subscribe';
}

export async function subscribeToNewsletter(
  email: string,
  honeypotValue = '',
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<void> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim(),
        source: 'rough-note-footer',
        websiteAddress2: honeypotValue
      }),
      signal: controller.signal
    });
    const body = (await response.json().catch(() => ({}))) as {
      status?: string;
      message?: string;
      errors?: Record<string, string>;
    };
    if (!response.ok) {
      throw new Error(
        body.message ||
          Object.values(body.errors ?? {})[0] ||
          'We could not start your subscription. Please try again.'
      );
    }
    if (body.status !== 'accepted') {
      throw new Error(
        'The server did not confirm your subscription request. Please retry.'
      );
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The subscription request took too long. Please retry.', {
        cause: error
      });
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

