import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FooterPaper } from '../../src/features/notebook-footer/components/FooterPaper';

describe('Notebook footer', () => {
  it('renders the complete paper composition and hand-drawn illustrations', () => {
    render(<FooterPaper />);

    expect(screen.getByTestId('notebook-footer')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Thanks for visiting us!' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('newsletter-card')).toBeInTheDocument();
    expect(screen.getByTestId('coffee-card')).toBeInTheDocument();
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

  it('stamps a drawn check after a valid subscription submission', async () => {
    const user = userEvent.setup();
    render(<FooterPaper />);

    await user.type(
      screen.getByRole('textbox', { name: 'Email address' }),
      'notes@example.com'
    );
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Subscription request noted.'
      )
    );
    expect(screen.getByTestId('subscribe-check').getAttribute('class')).toMatch(
      /subscribeCheckVisible/
    );
  });
});
