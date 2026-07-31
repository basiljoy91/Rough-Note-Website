import { SiteLayout } from '../../app/layouts/SiteLayout';
import { ContactJourney } from '../../features/contact-journey/ContactJourney';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';

export function ContactPage() {
  return (
    <>
      <SiteLayout
        activeItem="quote"
        mobileCtaLabel="Request a Rough Note"
        pageLabel="Page 06"
        pageTitle="Let's Talk"
      >
        <ContactJourney />
      </SiteLayout>
      <RoughNoteDrawingFeature />
    </>
  );
}
