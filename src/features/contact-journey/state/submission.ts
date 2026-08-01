import type {
  ContactSubmissionPayload,
  ContactSubmissionResult,
  RoughNoteContactState
} from '../types';

const DEFAULT_TIMEOUT_MS = 15_000;

declare global {
  interface Window {
    ROUGH_NOTE_CONTACT_ENDPOINT?: string;
  }
}

export function buildContactPayload(
  state: RoughNoteContactState
): ContactSubmissionPayload {
  return {
    solutionType: state.challenge.solutionType,
    department: state.challenge.department,
    challengeText: state.challenge.challengeText.trim(),
    name: state.contact.name.trim(),
    email: state.contact.email.trim(),
    phone: state.contact.phone.trim(),
    website: state.contact.website.trim(),
    role: state.contact.role,
    source: 'rough-note-contact-journey'
  };
}

function resolveEndpoint(): string {
  const metaEndpoint = document
    .querySelector<HTMLMetaElement>('meta[name="rough-note-contact-endpoint"]')
    ?.content.trim();
  return window.ROUGH_NOTE_CONTACT_ENDPOINT?.trim() || metaEndpoint || '/api/contact';
}

export async function submitContactRequest(
  state: RoughNoteContactState,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<ContactSubmissionResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  const payload = buildContactPayload(state);
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
  if (state.challenge.referenceFile) {
    formData.append('referenceFile', state.challenge.referenceFile);
  }

  try {
    const response = await fetch(resolveEndpoint(), {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    const body = (await response.json().catch(() => ({}))) as {
      submissionId?: string;
      id?: string;
      message?: string;
      errors?: Record<string, string>;
    };
    if (!response.ok) {
      const message =
        body.message ||
        Object.values(body.errors ?? {})[0] ||
        'We could not send your rough note. Please check your details and try again.';
      throw new Error(message);
    }
    const submissionId = body.submissionId || body.id;
    if (!submissionId) {
      throw new Error(
        'The server accepted the request but did not return a confirmation ID.'
      );
    }
    return { submissionId };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Sending took too long. Your details are safe—please retry.', {
        cause: error
      });
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
