import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DynamicJourney } from '../../src/pages/services/sections/DynamicJourney/DynamicJourney';
import { journeyDataById } from '../../src/pages/services/sections/DynamicJourney/data';

describe('DynamicJourney', () => {
  it('renders every service journey with a complete, consistently structured step list', async () => {
    const user = userEvent.setup();
    const { container } = render(<DynamicJourney />);

    for (const journey of Object.values(journeyDataById)) {
      const selectedTab = screen.getByRole('button', {
        name: `Show the ${journey.title} journey`
      });
      await user.click(selectedTab);

      expect(selectedTab).toHaveAttribute('aria-pressed', 'true');
      expect(selectedTab).toHaveClass('dj-card--active');
      expect(container.querySelectorAll('.dj-card--active')).toHaveLength(1);

      expect(
        screen.getByRole('heading', { name: `${journey.title} Journey` })
      ).toBeInTheDocument();

      const steps = container.querySelectorAll('.dj-step');
      expect(steps).toHaveLength(journey.steps.length);

      steps.forEach((step, index) => {
        expect(
          within(step as HTMLElement).getByRole('heading', {
            name: journey.steps[index].title
          })
        ).toBeInTheDocument();
      });
    }
  });
});
