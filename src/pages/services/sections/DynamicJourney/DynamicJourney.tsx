import React, { useState, useRef } from 'react';
import './dynamic-journey.css';
import { ServiceCard } from './components/ServiceCard';
import { JourneyTimeline } from './components/JourneyTimeline';
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

import { brandJourneyData, motionJourneyData, webDesignData, threeDModelingData, erpSoftwareData, customSoftwareData, aiAutomationData, fallbackJourneyData, type JourneyData } from './data';

export const DynamicJourney: React.FC = () => {
  const [activeService, setActiveService] = useState('brand');
  const sectionRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sectionRef);

  const getJourneyData = (): JourneyData => {
    if (activeService === 'brand') return brandJourneyData;
    if (activeService === 'motion') return motionJourneyData;
    if (activeService === 'web') return webDesignData;
    if (activeService === '3d') return threeDModelingData;
    if (activeService === 'erp') return erpSoftwareData;
    if (activeService === 'custom') return customSoftwareData;
    if (activeService === 'ai') return aiAutomationData;
    const service = servicesList.find(s => s.id === activeService);
    return fallbackJourneyData(activeService, service?.title || 'Service');
  };
  
  const currentJourneyData = getJourneyData();

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
      <div className="dj-doodle dj-doodle--mid-right" style={{ marginTop: '-70px',right:'50px' }}>
    💡  <br/>
        <span style={{ textDecoration: 'underline', textDecorationColor: '#e65100', textDecorationThickness: '2px' }}>Strategy first,</span><br/>
        Execution next,<br/>
        Impact always.<br/>
        <span style={{ fontSize: '2rem', display: 'block', transform: 'rotate(-45deg)' }}>⤵</span>
      </div>
      
      {/* Dynamic Decorations */}
      {currentJourneyData.renderDecorations && currentJourneyData.renderDecorations()}

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
      <JourneyTimeline data={currentJourneyData} />

      {/* Bottom CTA Area */}
      {currentJourneyData.renderBottomCTA()}

    </section>
  );
};
