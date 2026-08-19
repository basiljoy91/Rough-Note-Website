import { afterEach, describe, expect, it, vi } from 'vitest';
import { subscribeToNewsletter } from '../../src/features/notebook-footer/newsletterSubmission';

afterEach(() => vi.unstubAllGlobals());

describe('newsletter submission adapter', () => {
  it('sends the documented source and waits for an accepted response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'accepted' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      subscribeToNewsletter(' notes@example.com ', 'leave-empty')
    ).resolves.toBeUndefined();
    const [, options] = fetchMock.mock.calls[0] as [
      string,
      { method: string; body: string }
    ];
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({
      email: 'notes@example.com',
      source: 'rough-note-footer',
      websiteAddress2: 'leave-empty'
    });
  });

  it('rejects a successful HTTP response without server acceptance', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    await expect(subscribeToNewsletter('notes@example.com')).rejects.toThrow(
      'did not confirm'
    );
  });

  it('surfaces API errors and client timeouts', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Email delivery failed.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    await expect(subscribeToNewsletter('notes@example.com')).rejects.toThrow(
      'Email delivery failed.'
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, options: { signal: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError'))
            );
          })
      )
    );
    await expect(
      subscribeToNewsletter('notes@example.com', '', 5)
    ).rejects.toThrow('took too long');
  });
});

