import './coffee-steam.global.css';

const steamPaths = [
  'M85 85C50 45 120 25 75-25',
  'M100 85C145 45 60 15 120-30',
  'M115 85C80 40 150 10 100-35',
  'M90 85C130 45 55 15 105-25',
  'M110 85C65 50 145 20 90-30',
  'M95 85C135 55 70 25 115-20'
] as const;

export const coffeeSteamMarkup = (className = '') => `
  <svg class="rough-coffee-steam ${className}" viewBox="0 0 200 200" aria-hidden="true">
    <g class="rough-steam-group">
      ${steamPaths
        .map(
          (path, index) =>
            `<path class="rough-steam-trail rough-steam-${index + 1}" d="${path}"></path>`
        )
        .join('')}
    </g>
  </svg>
`;

interface CoffeeSteamProps {
  className?: string;
}

export function CoffeeSteam({ className = '' }: CoffeeSteamProps) {
  return (
    <svg
      className={`rough-coffee-steam ${className}`.trim()}
      viewBox="0 0 200 200"
      aria-hidden="true"
      data-coffee-steam
    >
      <g className="rough-steam-group">
        {steamPaths.map((path, index) => (
          <path
            className={`rough-steam-trail rough-steam-${index + 1}`}
            d={path}
            key={path}
          />
        ))}
      </g>
    </svg>
  );
}
