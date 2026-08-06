import './process-page.global.css';
import '../../features/notebook-footer/notebook-footer-placeholder.global.css';
import { useRef } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { FooterPaper } from '../../features/notebook-footer/components/FooterPaper';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import { useScrollReveal } from '../../shared/hooks/useScrollReveal';
import { SketchFilters } from '../../shared/ui/SketchFilters';
import { ourPlansMarkup } from './sections/OurPlans';

export function ProcessPage() {
  const mainRef = useRef<HTMLElement>(null);

  useScrollReveal(mainRef);

  return (
    <>
      <SketchFilters />
      <SiteLayout
        activeItem="process"
        pageLabel="Page 05"
        pageTitle="Our Plans"
      >
        <main
          ref={mainRef}
          data-rough-anchor="process-main"
        >
          <div dangerouslySetInnerHTML={{ __html: ourPlansMarkup }} />
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
