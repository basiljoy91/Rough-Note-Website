import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConnectPage } from '../../src/pages/connect/ConnectPage';

vi.mock('../../src/app/layouts/SiteLayout', () => ({
  SiteLayout: ({ children }: { children: ReactNode }) => <>{children}</>
}));

describe('ConnectPage', () => {
  it('renders the reference composition with functional contact links', () => {
    render(<ConnectPage />);

    expect(screen.getByRole('heading', { level: 1, name: "Let's Connect" })).toBeVisible();
    expect(screen.getByRole('link', { name: '+91 98765 43210' })).toHaveAttribute(
      'href',
      'tel:+919876543210'
    );
    expect(screen.getByRole('link', { name: 'hello@roughnote.in' })).toHaveAttribute(
      'href',
      'mailto:hello@roughnote.in'
    );
    expect(screen.getByRole('link', { name: /Schedule a Meeting/i })).toHaveAttribute(
      'href',
      '/html/schedule-step-1.html'
    );

    const directions = screen.getByRole('link', { name: /Get Directions/i });
    expect(directions).toHaveAttribute('target', '_blank');
    expect(directions.getAttribute('href')).toContain('google.com/maps/dir/');
    expect(directions.getAttribute('href')).toContain('KRM%20Plaza');
  });

  it('keeps informative imagery and the complete verified studio address accessible', () => {
    render(<ConnectPage />);

    expect(
      screen.getByAltText('A cup of black coffee resting beside the Rough Note notebook')
    ).toBeVisible();
    expect(
      screen.getByAltText('Map of Chennai centered on the Rough Note studio in Chetpet')
    ).toBeVisible();
    expect(screen.getByText(/8th Floor, KRM Plaza, South Tower/)).toHaveTextContent(
      'Tamil Nadu 600031'
    );
  });
});
