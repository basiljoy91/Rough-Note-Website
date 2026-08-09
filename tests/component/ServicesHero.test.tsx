import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroSection } from '../../src/pages/services/sections/HeroSection';

describe('Services hero', () => {
  it('uses the shared interactive idea bulb', () => {
    render(<HeroSection />);

    expect(
      screen.getByRole('button', { name: 'Light up your brain' })
    ).toHaveAttribute('aria-pressed', 'false');
  });
});
