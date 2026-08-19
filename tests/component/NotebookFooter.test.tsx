import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FooterPaper } from '../../src/features/notebook-footer/components/FooterPaper';

describe('Notebook footer', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('renders the complete paper composition and hand-drawn illustrations', () => {
    render(<FooterPaper />);

    expect(screen.getByTestId('notebook-footer')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Thanks for visiting us!' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('newsletter-card')).toBeInTheDocument();
    expect(screen.getByTestId('coffee-card')).toBeInTheDocument();
    expect(
      screen.getByTestId('coffee-card').querySelector('[data-coffee-steam]')
    ).toBeInTheDocument();
    expect(screen.getByTestId('sticky-note')).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'A hand-drawn coffee cup marked RN'
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Lock doodle' })).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Footer navigation' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByTestId('footer-copyright')).toHaveTextContent(
      `© ${new Date().getFullYear()} Rough Note. All rights reserved.`
    );
    expect(
      document.querySelector('[data-drawing-toolbar-boundary]')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Light up your brain' })
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves the resting pencil toward the email strip while writing', async () => {
    const user = userEvent.setup();
    render(<FooterPaper />);
    const pencil = screen.getByTestId('footer-pencil');
    const restingClass = pencil.getAttribute('class');

    await user.click(screen.getByRole('textbox', { name: 'Email address' }));
    expect(pencil.getAttribute('class')).not.toBe(restingClass);

    await user.tab();
    expect(pencil.getAttribute('class')).toBe(restingClass);
  });

  it('stamps a drawn check only after the server accepts the request', async () => {
    let acceptRequest!: (response: Response) => void;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            acceptRequest = resolve;
          })
      )
    );
    const user = userEvent.setup();
    render(<FooterPaper />);

    await user.type(
      screen.getByRole('textbox', { name: 'Email address' }),
      'notes@example.com'
    );
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByTestId('subscribe-check').getAttribute('class')).not.toMatch(
      /subscribeCheckVisible/
    );
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();

    acceptRequest(
      new Response(JSON.stringify({ status: 'accepted' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Check your inbox to confirm your subscription.'
      )
    );
    expect(screen.getByTestId('subscribe-check').getAttribute('class')).toMatch(
      /subscribeCheckVisible/
    );
  });

  it('keeps the form editable and hides success when the API rejects it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: 'Confirmation email could not be sent.' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )
    );
    const user = userEvent.setup();
    render(<FooterPaper />);
    const input = screen.getByRole('textbox', { name: 'Email address' });
    await user.type(input, 'notes@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Confirmation email could not be sent.'
    );
    expect(input).toHaveValue('notes@example.com');
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(screen.getByTestId('subscribe-check').getAttribute('class')).not.toMatch(
      /subscribeCheckVisible/
    );
  });
});
