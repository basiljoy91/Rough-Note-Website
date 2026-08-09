import { describe, expect, it } from 'vitest';
import { calculateFooterToolbarLift } from '../../src/features/rough-note-drawing/hooks/useFooterToolbarBoundary';

describe('footer toolbar boundary', () => {
  it('keeps the toolbar above the footer divider', () => {
    expect(calculateFooterToolbarLift(720, 760)).toBe(0);
    expect(calculateFooterToolbarLift(750, 760)).toBe(8);
    expect(calculateFooterToolbarLift(820, 760)).toBe(78);
  });
});
