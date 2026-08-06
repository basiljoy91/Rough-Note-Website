import type { CSSProperties } from 'react';
import type { JourneyData } from '../data';

interface JourneyTimelineProps {
  data: JourneyData;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ data }) => {
  return (
    <div className={`dj-timeline-wrapper dj-timeline-wrapper--${data.stepLayout ?? 'cards'}`}>
      <div className="dj-timeline__content">
        <div className="dj-timeline__header">
          <h3 className="dj-timeline__title">{data.title} Journey</h3>
          <p className="dj-timeline__subtitle">{data.subtitle}</p>
          <div className="dj-timeline__stamp" aria-label={data.stamp}>
            {data.stamp}
          </div>
        </div>
        <div className="dj-steps" style={{ '--step-count': data.steps.length } as CSSProperties}>
          {data.steps.map((step, index) => (
            <article key={step.num} className="dj-step">
              <div className="dj-step__num">{step.num}</div>
              <step.icon className="dj-step__icon" aria-hidden="true" />
              <h5 className="dj-step__title">{step.title}</h5>
              <ul className="dj-step__list">
                {step.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              {index < data.steps.length - 1 && (
                <div className="dj-step__arrow" aria-hidden="true">→</div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
