import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { InteractiveIdeaBulb } from '../../src/shared/ui/InteractiveIdeaBulb';

describe('InteractiveIdeaBulb', () => {
  it('uses the same accessible click-to-glow behavior everywhere', async () => {
    const user = userEvent.setup();
    render(<InteractiveIdeaBulb />);

    const bulb = screen.getByRole('button', { name: 'Light up your brain' });
    expect(bulb).toHaveAttribute('aria-pressed', 'false');

    await user.click(bulb);
    expect(bulb).toHaveAttribute('aria-pressed', 'true');
    expect(bulb).toHaveAccessibleName('Turn off idea light');

    await user.click(bulb);
    expect(bulb).toHaveAttribute('aria-pressed', 'false');
    expect(bulb).toHaveAccessibleName('Light up your brain');
  });
});
