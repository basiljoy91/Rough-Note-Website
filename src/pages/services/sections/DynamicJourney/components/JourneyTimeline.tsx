import React from 'react';
import { JourneyData } from '../data';

interface JourneyTimelineProps {
  data: JourneyData;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ data }) => {
  // Use custom backgrounds if provided, else fall back to defaults
  const bgImage = data.timelineBg || "/assets/images/sti-2.png";
  
  return (
    <div className="dj-timeline-wrapper">
      {/* Background notebook paper */}
      {bgImage !== 'none' && (
        <img src={bgImage} alt="Notebook Background" className="dj-timeline__bg" style={{ objectFit: 'cover' }} />
      )}
      
      <div className="dj-timeline__content" style={bgImage === 'none' ? { position: 'relative', height: 'auto' } : {}}>
        <div className="dj-timeline__header">
          <h3 className="dj-timeline__title">{data.title} Journey</h3>
          <p className="dj-timeline__subtitle" dangerouslySetInnerHTML={{ __html: data.subtitle as string }} />
        </div>

        <div className="dj-timeline__stamp">
          {data.stamp || <>BRAND<br/>APPROVED</>}
        </div>

        <div className="dj-steps" style={{ gridTemplateColumns: `repeat(${data.steps.length}, 1fr)` }}>
          {data.steps.map((step, index) => (
            <div key={index} className="dj-step" style={data.timelineStepBg ? { backgroundImage: `url(${data.timelineStepBg})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', padding: '1rem', minHeight: '300px' } : {}}>
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
