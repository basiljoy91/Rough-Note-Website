import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialContactState } from '../../src/features/contact-journey/state/contactJourneyReducer';
import {
  buildContactPayload,
  submitContactRequest
} from '../../src/features/contact-journey/state/submission';

const completeState = {
  ...initialContactState,
  challenge: {
    solutionType: 'Website',
    department: 'Marketing',
    challengeText: '  We need a clearer conversion journey.  ',
    referenceFile: new File(['brief'], 'brief.pdf', {
      type: 'application/pdf'
    })
  },
  contact: {
    name: '  Ada Lovelace ',
    email: ' ada@example.com ',
    phone: '123',
    website: 'roughnote.example',
    role: 'Founder / Owner'
  }
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('contact submission adapter', () => {
  it('builds a normalized request payload', () => {
    expect(buildContactPayload(completeState)).toEqual({
      solutionType: 'Website',
      department: 'Marketing',
      challengeText: 'We need a clearer conversion journey.',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '123',
      website: 'roughnote.example',
      role: 'Founder / Owner',
      source: 'rough-note-contact-journey'
    });
  });

  it('sends multipart data and requires a server confirmation ID', async () => {
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ submissionId: 'RN-2026-42' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', request);

    await expect(submitContactRequest(completeState)).resolves.toEqual({
      submissionId: 'RN-2026-42'
    });
    const [, options] = request.mock.calls[0] as [
      string,
      { body: FormData; method: string }
    ];
    expect(options.method).toBe('POST');
    expect(options.body.get('source')).toBe('rough-note-contact-journey');
    expect(options.body.get('referenceFile')).toBeInstanceOf(File);
  });

  it('surfaces server failures instead of fabricating success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Service unavailable.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    await expect(submitContactRequest(completeState)).rejects.toThrow(
      'Service unavailable.'
    );
  });
});
