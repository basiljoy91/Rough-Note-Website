import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useAboutStudioInteractions } from '../../src/pages/home/sections/AboutStudio/useAboutStudioInteractions';

function AboutStudioHarness() {
  const rootRef = useRef<HTMLElement>(null);
  useAboutStudioInteractions(rootRef);

  return (
    <main ref={rootRef}>
      <button
        type="button"
        data-about-lamp
        aria-label="Turn desk lamp on"
        aria-pressed="false"
      >
        Desk lamp
      </button>
    </main>
  );
}

describe('about studio interactions', () => {
  it('turns the desk lamp on and off on repeated clicks', () => {
    render(<AboutStudioHarness />);
    const lamp = screen.getByRole('button', { name: 'Turn desk lamp on' });

    fireEvent.click(lamp);
    expect(lamp).toHaveAttribute('aria-pressed', 'true');
    expect(lamp).toHaveAccessibleName('Turn desk lamp off');

    fireEvent.click(lamp);
    expect(lamp).toHaveAttribute('aria-pressed', 'false');
    expect(lamp).toHaveAccessibleName('Turn desk lamp on');
  });
});
