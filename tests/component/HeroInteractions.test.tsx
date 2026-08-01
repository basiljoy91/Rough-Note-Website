import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useHeroInteractions } from '../../src/pages/home/sections/Hero/useHeroInteractions';

function HeroHarness() {
  const rootRef = useRef<HTMLElement>(null);
  useHeroInteractions(rootRef);

  return (
    <main ref={rootRef}>
      <span data-type-text={'idea\nstarts\nsmall'} data-type-delay="100">
        idea
        <br />
        starts
        <br />
        small
      </span>
      <button
        type="button"
        data-idea-bulb
        aria-label="Light up your brain"
        aria-pressed="false"
      >
        Idea light
      </button>
    </main>
  );
}

describe('hero interactions', () => {
  it('types the process note after its entrance delay', () => {
    vi.useFakeTimers();
    render(<HeroHarness />);

    const note = screen.getByLabelText('idea starts small');
    expect(note).toHaveTextContent('');

    vi.advanceTimersByTime(100);
    expect(note.textContent).toBe('i');
    vi.advanceTimersByTime(700);
    expect(note.textContent).not.toBe('idea\nstarts\nsmall');
    vi.advanceTimersByTime(3500);
    expect(note.textContent).toBe('idea\nstarts\nsmall');
    expect(note).not.toHaveClass('is-typing');
  });

  it('toggles the small bulb light without changing the page', () => {
    render(<HeroHarness />);
    const bulb = screen.getByRole('button', { name: 'Light up your brain' });

    fireEvent.click(bulb);
    expect(bulb).toHaveAttribute('aria-pressed', 'true');
    expect(bulb).toHaveAccessibleName('Turn off idea light');

    fireEvent.click(bulb);
    expect(bulb).toHaveAttribute('aria-pressed', 'false');
    expect(bulb).toHaveAccessibleName('Light up your brain');
  });
});
