import './contact-page.global.css';
import { useRef } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { ContactJourney } from '../../features/contact-journey/ContactJourney';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import { trustedCompaniesMarkup } from '../home/sections/TrustedCompanies';
import { useTrustedCompaniesInteractions } from '../home/sections/TrustedCompanies/useTrustedCompaniesInteractions';
import { ExpandedProjectArchive } from '../work/OurWorkPage';

export function ContactPage() {
  const clientProofRef = useRef<HTMLDivElement>(null);

  useTrustedCompaniesInteractions(clientProofRef);

  const returnToContactNote = () => {
    document
      .querySelector('[data-rough-anchor="contact-journey"]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SiteLayout
        activeItem="quote"
        mobileCtaLabel="Request a Rough Note"
        pageLabel="Page 06"
        pageTitle="Let's Talk"
      >
        <ContactJourney />
        <div className="contact-work-showcase" aria-label="Selected work">
          <ExpandedProjectArchive onBack={returnToContactNote} />
        </div>
        <div
          ref={clientProofRef}
          className="contact-client-proof"
          dangerouslySetInnerHTML={{ __html: trustedCompaniesMarkup }}
        />
      </SiteLayout>
      <RoughNoteDrawingFeature />
    </>
  );
}
