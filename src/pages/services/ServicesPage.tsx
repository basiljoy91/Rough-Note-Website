import './services-page.global.css';
import '../../features/notebook-footer/notebook-footer-placeholder.global.css';
import { useRef } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { FooterPaper } from '../../features/notebook-footer/components/FooterPaper';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import { useScrollReveal } from '../../shared/hooks/useScrollReveal';
import { SketchFilters } from '../../shared/ui/SketchFilters';
import { ourServicesMarkup } from './sections/OurServices';
import { HeroSection } from './sections/HeroSection';
import { DynamicJourney } from './sections/DynamicJourney/DynamicJourney';

export function ServicesPage() {
  const mainRef = useRef<HTMLElement>(null);

  useScrollReveal(mainRef);

  return (
    <>
      <SketchFilters />
      <SiteLayout
        activeItem="services"
        pageLabel="Page 02"
        pageTitle="Our Services"
      >
        <main
          ref={mainRef}
          data-rough-anchor="services-main"
        >
          <HeroSection />
          <div dangerouslySetInnerHTML={{ __html: ourServicesMarkup }} />
          <DynamicJourney />
        </main>
        <div
          id="rough-note-footer-root"
          className="notebook-footer-placeholder"
        >
          <FooterPaper />
        </div>
      </SiteLayout>
      <RoughNoteDrawingFeature />
    </>
  );
}
