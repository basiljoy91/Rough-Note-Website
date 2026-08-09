import { useState } from 'react';
import './interactive-idea-bulb.global.css';

export const interactiveIdeaBulbMarkup = (className = '') => `
  <button
    class="d1-idea-bulb ${className}"
    type="button"
    aria-label="Light up your brain"
    aria-pressed="false"
    data-idea-bulb
  >
    <span class="d1-bulb-glow" aria-hidden="true"></span>
    <svg class="d1-bulb-line-art" viewBox="0 0 92 126" aria-hidden="true">
      <g class="d1-bulb-rays">
        <path d="M46 3.5v11M16 16l8 8M3 47h12M76 47h12M68 24l8-8"></path>
      </g>
      <path
        class="d1-bulb-glass"
        d="M46 18C25.4 18 12 32.8 12.8 51.1c.5 10.7 5.1 18.5 11.3 26.2 4.9 6 5.8 10.4 6.1 16.3 3 2.6 28.3 2.7 31.6-.2.2-5.4 1.1-9.7 6.4-16.4 6-7.7 10.6-15.8 10.8-26.7C79.3 32.5 66 18 46 18Z"
      ></path>
      <path
        class="d1-bulb-filament"
        d="M34.5 58.7c3.6-2.9 6.1 6.6 11.4 6.6 5 0 7.5-9.4 11.7-6.3M40 64.5l1.8 28.3M52 64.4l-1.9 28.4"
      ></path>
      <g class="d1-bulb-base">
        <path d="M30.7 96.5c8 2.3 22 2.2 30.4-.1M31.8 102.5c7.7 2.4 20.8 2.6 28.3-.1M34.5 108.6c6.2 2.3 17.2 2.4 23.2-.1M38.5 113.7c4.4 1.4 11.2 1.5 15.6 0M40 115.5c1.3 7.6 10.7 8 12.2.1"></path>
      </g>
    </svg>
    <span class="d1-bulb-message" aria-hidden="true">Light<br>up your<br>brain</span>
  </button>
`;

interface InteractiveIdeaBulbProps {
  className?: string;
}

export function InteractiveIdeaBulb({
  className = ''
}: InteractiveIdeaBulbProps) {
  const [isLit, setIsLit] = useState(false);

  return (
    <button
      className={`d1-idea-bulb ${className}`.trim()}
      type="button"
      aria-label={isLit ? 'Turn off idea light' : 'Light up your brain'}
      aria-pressed={isLit}
      data-idea-bulb
      onClick={() => setIsLit((lit) => !lit)}
    >
      <span className="d1-bulb-glow" aria-hidden="true" />
      <svg className="d1-bulb-line-art" viewBox="0 0 92 126" aria-hidden="true">
        <g className="d1-bulb-rays">
          <path d="M46 3.5v11M16 16l8 8M3 47h12M76 47h12M68 24l8-8" />
        </g>
        <path
          className="d1-bulb-glass"
          d="M46 18C25.4 18 12 32.8 12.8 51.1c.5 10.7 5.1 18.5 11.3 26.2 4.9 6 5.8 10.4 6.1 16.3 3 2.6 28.3 2.7 31.6-.2.2-5.4 1.1-9.7 6.4-16.4 6-7.7 10.6-15.8 10.8-26.7C79.3 32.5 66 18 46 18Z"
        />
        <path
          className="d1-bulb-filament"
          d="M34.5 58.7c3.6-2.9 6.1 6.6 11.4 6.6 5 0 7.5-9.4 11.7-6.3M40 64.5l1.8 28.3M52 64.4l-1.9 28.4"
        />
        <g className="d1-bulb-base">
          <path d="M30.7 96.5c8 2.3 22 2.2 30.4-.1M31.8 102.5c7.7 2.4 20.8 2.6 28.3-.1M34.5 108.6c6.2 2.3 17.2 2.4 23.2-.1M38.5 113.7c4.4 1.4 11.2 1.5 15.6 0M40 115.5c1.3 7.6 10.7 8 12.2.1" />
        </g>
      </svg>
      <span className="d1-bulb-message" aria-hidden="true">
        Light<br />up your<br />brain
      </span>
    </button>
  );
}
