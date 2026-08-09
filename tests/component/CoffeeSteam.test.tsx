import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aboutStudioMarkup } from '../../src/pages/home/sections/AboutStudio';
import { techStackMarkup } from '../../src/pages/home/sections/TechStack';
import { CoffeeSteam } from '../../src/shared/ui/CoffeeSteam';

describe('CoffeeSteam', () => {
  it('renders the six soft trails used by the Contact page animation', () => {
    const { container } = render(<CoffeeSteam />);

    expect(container.querySelectorAll('.rough-steam-trail')).toHaveLength(6);
    expect(container.querySelector('[data-coffee-steam]')).toBeInTheDocument();
  });

  it('is shared by the Home coffee compositions', () => {
    expect(aboutStudioMarkup).toContain(
      'rough-coffee-steam d3-steam-cloud'
    );
    expect(techStackMarkup).toContain(
      'rough-coffee-steam tech-stack__coffee-steam'
    );
  });
});
