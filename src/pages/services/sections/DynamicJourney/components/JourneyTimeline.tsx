import React from 'react';

export interface JourneyStep {
  num: string;
  icon: string;
  title: string;
  bullets: string[];
}

export interface JourneyData {
  id: string;
  title: string;
  subtitle: string;
  steps: JourneyStep[];
}

interface JourneyTimelineProps {
  data: JourneyData;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ data }) => {
  return (
    <div className="dj-timeline-wrapper">
      {/* Background notebook paper */}
      <img src="/assets/images/sti-2.png" alt="Notebook Background" className="dj-timeline__bg" style={{ objectFit: 'cover' }} />
      
      <div className="dj-timeline__content">
        <div className="dj-timeline__header">
          <h3 className="dj-timeline__title">{data.title} Journey</h3>
          <p className="dj-timeline__subtitle" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
        </div>

        <div className="dj-timeline__stamp">
          BRAND<br/>APPROVED
        </div>

        <div className="dj-steps">
          {data.steps.map((step, index) => (
            <div key={index} className="dj-step">
              <div className="dj-step__num">{step.num}</div>
              <div className="dj-step__icon">{step.icon}</div>
              <h5 className="dj-step__title">{step.title}</h5>
              <ul className="dj-step__list">
                {step.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              {/* Add arrow if not the last item */}
              {index < data.steps.length - 1 && (
                <div className="dj-step__arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
