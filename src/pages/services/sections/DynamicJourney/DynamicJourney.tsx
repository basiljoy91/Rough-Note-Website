import { useRef, useState, type CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  Box,
  ChartNoAxesCombined,
  Check,
  Clapperboard,
  CodeXml,
  Globe,
  Lightbulb,
  PenTool,
  Sparkles,
} from 'lucide-react';
import './dynamic-journey.css';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { ServiceCard } from './components/ServiceCard';
import { JourneyTimeline } from './components/JourneyTimeline';
import { journeyDataById, type JourneyData } from './data';

interface ServiceOption {
  id: string;
  title: string;
  icon: LucideIcon;
  pinColor: string;
}

const servicesList: ServiceOption[] = [
  { id: 'brand', title: 'Brand<br/>Identity', icon: PenTool, pinColor: '#a85b08' },
  { id: 'motion', title: 'Motion<br/>Graphics', icon: Clapperboard, pinColor: '#2b95c2' },
  { id: 'web', title: 'Website<br/>Design', icon: Globe, pinColor: '#6caa54' },
  { id: '3d', title: '3D<br/>Modeling', icon: Box, pinColor: '#f1b900' },
  { id: 'erp', title: 'ERP<br/>Software', icon: ChartNoAxesCombined, pinColor: '#8b56b7' },
  { id: 'custom', title: 'Custom<br/>Software', icon: CodeXml, pinColor: '#d64f7e' },
  { id: 'ai', title: 'AI<br/>Automation', icon: Bot, pinColor: '#2bada8' },
];

function SupportBoard({ data }: { data: JourneyData }) {
  const DiagramIcon = data.diagramIcon;

  if (data.bottomKind === 'cta') {
    return (
      <div className="dj-brand-footer">
        <div className="dj-brand-footer__thought">
          <Lightbulb aria-hidden="true" />
          <p>{data.bottomTitle}<br /><strong>a clear story and a strong identity.</strong></p>
        </div>
        <a className="dj-brand-footer__cta" href="/html/connect.html">
          <span>{data.bottomDiagram}</span>
          <strong>Start Your Rough Note →</strong>
        </a>
        <div className="dj-support-note dj-support-note--blue">{data.bottomNote}<span>♛</span></div>
      </div>
    );
  }

  return (
    <div className="dj-support-board">
      <figure className="dj-support-visual">
        <span className="dj-paperclip" aria-hidden="true" />
        <img src={data.bottomVisual} alt="" />
      </figure>

      <div className="dj-support-list">
        <h4>{data.bottomTitle}</h4>
        <ul>
          {data.bottomItems.map((item) => (
            <li key={item}><Check aria-hidden="true" />{item}</li>
          ))}
        </ul>
      </div>

      <div className="dj-support-note">
        <span className="dj-tape" aria-hidden="true" />
        {data.bottomNote}
        <Sparkles aria-hidden="true" />
      </div>

      <div className="dj-support-diagram">
        <DiagramIcon aria-hidden="true" />
        <p>{data.bottomDiagram}</p>
        <div className="dj-diagram-flow" aria-hidden="true">
          <span>Plan</span><i>→</i><span>Build</span><i>→</i><span>Grow</span>
        </div>
      </div>
    </div>
  );
}

export function DynamicJourney() {
  const [activeService, setActiveService] = useState('brand');
  const sectionRef = useRef<HTMLElement>(null);
  const currentJourneyData = journeyDataById[activeService] ?? journeyDataById.brand;

  useScrollReveal(sectionRef);

  return (
    <section
      className="dynamic-journey"
      data-service={currentJourneyData.id}
      ref={sectionRef}
      style={{ '--journey-accent': currentJourneyData.accent } as CSSProperties}
    >
      <div className="dj-paper-corner" aria-hidden="true" />

      <div className="dj-top">
        <aside className="dj-top__aside dj-top__aside--left">
          <Sparkles aria-hidden="true" />
          <p>Different idea,<br />Different journey,<br />Same commitment.</p>
          <span className="dj-loop-arrow" aria-hidden="true">↷</span>
        </aside>

        <header className="dj-header">
          <p className="dj-header__subtitle">Our Process</p>
          <h2 className="dj-header__title">Dynamic Product Journey</h2>
          <p className="dj-header__desc">
            Every project is unique, and so is our approach. Select a service below<br />
            to see how we turn your idea into a successful digital product.
          </p>
        </header>

        <aside className="dj-top__aside dj-top__aside--right">
          <div className="dj-top-note"><span className="dj-tape" aria-hidden="true" />{currentJourneyData.topNote}<Sparkles aria-hidden="true" /></div>
          <div className="dj-right-promise">
            <Lightbulb aria-hidden="true" />
            {currentJourneyData.rightChecklist.map((line) => <span key={line}>{line}</span>)}
          </div>
        </aside>
      </div>

      <p className="dj-selector-prompt">Select a service to explore its journey <span aria-hidden="true">↘</span></p>

      <div className="dj-selector" role="group" aria-label="Choose a service journey">
        {servicesList.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            isActive={activeService === service.id}
            onClick={setActiveService}
          />
        ))}
      </div>

      <div className="dj-journey-row">
        <aside className="dj-side-note">
          <span className="dj-tape" aria-hidden="true" />
          {currentJourneyData.sideNote}
          <span className="dj-smile" aria-hidden="true">☺</span>
        </aside>
        <JourneyTimeline data={currentJourneyData} />
      </div>

      <SupportBoard data={currentJourneyData} />
    </section>
  );
}
