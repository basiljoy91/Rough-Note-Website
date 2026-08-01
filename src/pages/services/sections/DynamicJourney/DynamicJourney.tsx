import React, { useState, useRef } from 'react';
import './dynamic-journey.css';
import { ServiceCard } from './components/ServiceCard';
import { JourneyTimeline, JourneyData } from './components/JourneyTimeline';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';

const servicesList = [
  { id: 'brand', title: 'Brand<br/>Identity', icon: '🖋️', pinColor: '#e65100' },
  { id: 'motion', title: 'Motion<br/>Graphics', icon: '🎬', pinColor: '#1e88e5' },
  { id: 'web', title: 'Website<br/>Design', icon: '🌐', pinColor: '#43a047' },
  { id: '3d', title: '3D<br/>Modeling', icon: '🧊', pinColor: '#fdd835' },
  { id: 'erp', title: 'ERP<br/>Software', icon: '💻', pinColor: '#8e24aa' },
  { id: 'custom', title: 'Custom<br/>Software', icon: '⌨️', pinColor: '#e91e63' },
  { id: 'ai', title: 'AI<br/>Automation', icon: '🤖', pinColor: '#00acc1' },
];

const brandJourneyData: JourneyData = {
  id: 'brand',
  title: 'Brand Identity',
  subtitle: 'We craft brands that tell your story,<br/>build trust,<br/>and leave a lasting impression.',
  steps: [
    {
      num: '01',
      icon: '👥',
      title: 'Discovery',
      bullets: ['Understand your business', 'Goals & Vision', 'Target Audience']
    },
    {
      num: '02',
      icon: '🔍',
      title: 'Research',
      bullets: ['Market Study', 'Competitor Analysis', 'Brand Insights']
    },
    {
      num: '03',
      icon: '📝',
      title: 'Conceptualize',
      bullets: ['Creative Direction', 'Mood Boards', 'Logo Concepts']
    },
    {
      num: '04',
      icon: '✒️',
      title: 'Design',
      bullets: ['Logo Refinement', 'Color Palette', 'Typography']
    },
    {
      num: '05',
      icon: '📋',
      title: 'Brand System',
      bullets: ['Brand Guidelines', 'Identity Elements', 'Usage Rules']
    },
    {
      num: '06',
      icon: '📇',
      title: 'Applications',
      bullets: ['Business Cards', 'Stationery', 'Social Media Kit']
    },
    {
      num: '07',
      icon: '📦',
      title: 'Delivery',
      bullets: ['Final Files', 'Source Files', 'Brand Book']
    }
  ]
};

// Fallback data for other services until they are fully populated
const fallbackJourneyData = (id: string, title: string): JourneyData => ({
  ...brandJourneyData,
  id,
  title: title.replace('<br/>', ' '),
});

export const DynamicJourney: React.FC = () => {
  const [activeService, setActiveService] = useState('brand');
  const sectionRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sectionRef);

  const getJourneyData = () => {
    if (activeService === 'brand') return brandJourneyData;
    const service = servicesList.find(s => s.id === activeService);
    return fallbackJourneyData(activeService, service?.title || 'Service');
  };

  return (
    <section className="dynamic-journey" ref={sectionRef}>
      {/* Decorative Doodles */}
      <div className="dj-doodle dj-doodle--top-left">
        ✨ Different idea,<br/>Different journey,<br/>Same commitment.<br/>
        <span style={{ fontSize: '1.5rem', display: 'block', marginTop: '10px' }}>⤵</span>
      </div>
      
      {/* Top Right Sticky */}
      <div className="dj-sticky dj-sticky--top-right">
        <img src="/assets/images/sticky-note-5-bg-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          We don't follow<br/>a template.<br/>We follow your<br/>goals.<br/>
          <span style={{ fontSize: '1.2rem', marginTop: '5px', display: 'block' }}>⭐</span>
        </div>
      </div>
      
      {/* Top Right Doodle under sticky */}
      <div className="dj-doodle dj-doodle--mid-right" style={{ top: '25%', right: '5%', marginTop: '-150px' }}>
    💡  <br/>
        <span style={{ textDecoration: 'underline', textDecorationColor: '#e65100', textDecorationThickness: '2px' }}>Strategy first,</span><br/>
        Execution next,<br/>
        Impact always.<br/>
        <span style={{ fontSize: '2rem', display: 'block', transform: 'rotate(-45deg)' }}>⤵</span>
      </div>

      {/* Middle Left Sticky */}
      <div className="dj-sticky dj-sticky--mid-left">
        <img src="/assets/images/sticky-note-2-bg-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          You focus on<br/>your business.<br/>We handle the<br/>creative journey.
          <span style={{ position: 'absolute', bottom: '-10px', left: '-10px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>

      <header className="dj-header">
        <h4 className="dj-header__subtitle">Our Process</h4>
        <h2 className="dj-header__title">Dynamic Product Journey</h2>
        <p className="dj-header__desc">
          Every project is unique, and so is our approach. Select a service below<br/>
          to see how we turn your idea into a successful digital product.
        </p>
        <p style={{ marginTop: '2rem', fontStyle: 'italic', transform: 'translate(-180px, 20px)' }}>Select a service to explore its journey ↘</p>
      </header>

      {/* Service Selector */}
      <div className="dj-selector">
        {servicesList.map(service => (
          <ServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            icon={service.icon}
            pinColor={service.pinColor}
            isActive={activeService === service.id}
            onClick={setActiveService}
          />
        ))}
      </div>

      {/* Journey Timeline */}
      <JourneyTimeline data={getJourneyData()} />

      {/* Bottom CTA Area */}
      <div className="dj-bottom-cta">
        <div className="dj-bottom__strip">
          <img src="/assets/images/Paper_Strip.png" alt="Strip" className="dj-bottom__strip-img" />
          <div className="dj-bottom__strip-content">
            
            <div className="cta-left">
              <span style={{ fontSize: '2rem' }}>💡</span>
              <div className="cta-text-group">
                Every strong brand starts with<br/>
                <span className="highlight">a clear story and a strong identity.</span>
              </div>
            </div>

            <div className="cta-arrow">
              <svg width="80" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <path d="M 0 35 Q 50 -10 95 20" fill="transparent" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <path d="M 85 10 L 98 22 L 80 25" fill="transparent" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="cta-right dj-bottom__cta-text">
              <h4 className="dj-bottom__cta-title">Ready to build your brand identity?</h4>
              <a href="#contact" className="dj-bottom__cta-link">Start Your Rough Note →</a>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Right Sticky */}
      <div className="dj-sticky dj-sticky--bottom-right">
        <img src="/assets/images/sticky-note-div3-bg3-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, marginTop: '15px' }}>
          Your brand is<br/>
          your promise.<br/>
          <span style={{ fontSize: '1.3rem', display: 'block', marginTop: '0px' }}>👑</span>
        </div>
      </div>

    </section>
  );
};
