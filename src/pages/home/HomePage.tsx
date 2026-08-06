import './home-page.global.css';
import '../../features/notebook-footer/notebook-footer-placeholder.global.css';
import { useRef } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { FooterPaper } from '../../features/notebook-footer/components/FooterPaper';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import { useWorkbookCarousel } from '../../features/workbook-carousel/useWorkbookCarousel';
import { useScrollReveal } from '../../shared/hooks/useScrollReveal';
import { SketchFilters } from '../../shared/ui/SketchFilters';
import { aboutStudioMarkup } from './sections/AboutStudio';
import { useAboutStudioInteractions } from './sections/AboutStudio/useAboutStudioInteractions';
import { companySnapshotMarkup } from './sections/CompanySnapshot';
import { faqMarkup } from './sections/FAQ';
import { useFaq } from './sections/FAQ/useFaq';
import { heroMarkup } from './sections/Hero';
import { useHeroInteractions } from './sections/Hero/useHeroInteractions';
import { ourWorkMarkup } from './sections/OurWork';
import { processMarkup } from './sections/Process';
import { servicesWorkbookMarkup } from './sections/ServicesWorkbook';
import { trustedCompaniesMarkup } from './sections/TrustedCompanies';
import { useTrustedCompaniesInteractions } from './sections/TrustedCompanies/useTrustedCompaniesInteractions';

const homeMarkup = [
  heroMarkup,
  companySnapshotMarkup,
  aboutStudioMarkup,
  ourWorkMarkup,
  servicesWorkbookMarkup,
  processMarkup,
  faqMarkup,
  trustedCompaniesMarkup
].join('\n');

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  useScrollReveal(mainRef);
  useWorkbookCarousel(mainRef);
  useFaq(mainRef);
  useHeroInteractions(mainRef);
  useAboutStudioInteractions(mainRef);
  useTrustedCompaniesInteractions(mainRef);

  return (
    <>
      <SketchFilters />
      <SiteLayout
        activeItem="home"
        pageLabel="Page 01"
        pageTitle="The Beginning"
      >
        <main
          ref={mainRef}
          data-rough-anchor="home-main"
          dangerouslySetInnerHTML={{ __html: homeMarkup }}
        />
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
