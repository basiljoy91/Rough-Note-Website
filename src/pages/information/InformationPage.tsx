import './information-page.global.css';
import '../../features/notebook-footer/notebook-footer-placeholder.global.css';
import type { ReactNode } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { FooterPaper } from '../../features/notebook-footer/components/FooterPaper';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import type { NavigationKey } from '../../shared/navigation/navigation.data';

interface InformationPageProps {
  activeItem: NavigationKey;
  children: ReactNode;
  eyebrow: string;
  intro: string;
  pageLabel: string;
  summary: readonly string[];
  title: string;
}

const lastUpdated = '19 August 2026';

function InformationPage({
  activeItem,
  children,
  eyebrow,
  intro,
  pageLabel,
  summary,
  title
}: InformationPageProps) {
  return (
    <>
      <SiteLayout
        activeItem={activeItem}
        pageLabel={pageLabel}
        pageTitle={title}
      >
        <main
          className="information-page"
          data-rough-anchor={`information-${eyebrow.toLowerCase().replaceAll(' ', '-')}`}
        >
          <div className="information-page__sheet">
            <header className="information-page__header">
              <p className="information-page__eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              <p className="information-page__intro">{intro}</p>
              <p className="information-page__updated">Last updated {lastUpdated}</p>
            </header>

            <aside className="information-page__summary" aria-label="At a glance">
              <span className="information-page__tape" aria-hidden="true" />
              <h2>At a glance</h2>
              <ul>
                {summary.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </aside>

            <div className="information-page__content">{children}</div>

            <section className="information-page__contact" aria-labelledby="information-contact-title">
              <h2 id="information-contact-title">Questions? Let&apos;s talk.</h2>
              <p>
                Email <a href="mailto:hello@roughnote.in">hello@roughnote.in</a> and
                include the page or request your question relates to.
              </p>
            </section>
          </div>
        </main>

        <div id="rough-note-footer-root" className="notebook-footer-placeholder">
          <FooterPaper />
        </div>
      </SiteLayout>
      <RoughNoteDrawingFeature />
    </>
  );
}

export function PrivacyPage() {
  return (
    <InformationPage
      activeItem="home"
      eyebrow="Privacy note"
      intro="This policy explains what Rough Note collects through this website, why we use it, and the choices available to you."
      pageLabel="Privacy"
      summary={[
        'We collect only what you choose to share.',
        'Your browser drawings are not uploaded.',
        'We do not sell personal information.'
      ]}
      title="Privacy Policy"
    >
      <section>
        <h2>1. Who we are</h2>
        <p>
          Rough Note is a creative technology studio based in Chennai, Tamil Nadu,
          India. In this policy, “Rough Note”, “we”, and “us” refer to the studio
          operating roughnote.in and its related enquiry and scheduling services.
        </p>
      </section>

      <section>
        <h2>2. Information you give us</h2>
        <p>Depending on how you use the website, you may provide:</p>
        <ul>
          <li>Your name, email address, phone number, company, role, and website.</li>
          <li>Project requirements, selected services, and messages you send us.</li>
          <li>Reference files you voluntarily attach to a quotation request.</li>
          <li>Meeting preferences, including date, time, and meeting mode.</li>
          <li>Your email address if you ask to receive studio updates.</li>
        </ul>
        <p>
          Please do not include confidential, sensitive, or unnecessary personal
          information in a message or attachment.
        </p>
      </section>

      <section>
        <h2>3. Information created by your browser</h2>
        <p>
          The rough-note drawing tool stores drawings only in your browser after you
          choose “Remember my art”. Those drawings are not uploaded to Rough Note.
          You can clear them using the drawing controls or your browser&apos;s site-data
          settings.
        </p>
        <p>
          The application converts network addresses into keyed, one-way hashes for
          rate limiting and does not write names, email addresses, request bodies,
          access tokens, or raw network addresses to its application logs. Our
          hosting provider may keep separate infrastructure access logs under its
          own security and retention controls. We use limited technical data to keep
          the website reliable and prevent abuse.
        </p>
      </section>

      <section>
        <h2>4. How we use information</h2>
        <ul>
          <li>Respond to enquiries and prepare quotations.</li>
          <li>Arrange, confirm, reschedule, or cancel meetings.</li>
          <li>Send requested updates and manage subscription preferences.</li>
          <li>Protect the website, diagnose errors, and prevent spam or fraud.</li>
          <li>Meet legal, accounting, and contractual obligations.</li>
        </ul>
      </section>

      <section>
        <h2>5. Service providers and sharing</h2>
        <p>
          We may share the minimum necessary information with providers that help us
          host the website and database, deliver email, manage calendars or online
          meetings, store backups, and protect the service. They may process data in
          other countries under their own security and privacy commitments.
        </p>
        <p>
          We do not sell or rent personal information. We may disclose information
          when required by law, to protect people or the service, or as part of a
          business reorganisation with appropriate safeguards.
        </p>
      </section>

      <section>
        <h2>6. Retention and security</h2>
        <p>
          Unless a contract or law requires longer, optional enquiry attachments are
          deleted after 30 days; enquiry and completed or cancelled booking records
          after 365 days; expired unconfirmed newsletter requests after 7 days; and
          unsubscribed newsletter records after 90 days. Active newsletter consent
          remains until you unsubscribe. Abuse-prevention counters expire after 2
          days. Successfully delivered encrypted email jobs are removed after 30
          days, and exhausted jobs after 90 days.
        </p>
        <p>
          Pending email retry content is encrypted at rest. Hostinger recovery
          backups and separately downloaded encrypted restore copies can retain
          deleted information for a short additional recovery period before they
          rotate. We use reasonable administrative and technical safeguards, but no
          internet transmission or storage system can be guaranteed completely
          secure.
        </p>
      </section>

      <section>
        <h2>7. Your choices and rights</h2>
        <p>
          You may ask to access, correct, or delete information you have shared with
          us, object to or restrict certain uses, or withdraw a newsletter consent.
          We may need to verify your identity and may retain information where the law
          requires it. Every marketing email should include an unsubscribe option.
        </p>
      </section>

      <section>
        <h2>8. External links and changes</h2>
        <p>
          Links to third-party websites are governed by their privacy policies. We
          may update this policy as the website or legal requirements change; the
          date at the top identifies the latest version.
        </p>
      </section>
    </InformationPage>
  );
}

export function TermsPage() {
  return (
    <InformationPage
      activeItem="home"
      eyebrow="Studio terms"
      intro="These terms set the ground rules for using the Rough Note website and sending us an enquiry."
      pageLabel="Terms"
      summary={[
        'An enquiry is not a project agreement.',
        'Keep uploaded material lawful and safe.',
        'Project work uses a separate written agreement.'
      ]}
      title="Terms & Conditions"
    >
      <section>
        <h2>1. Accepting these terms</h2>
        <p>
          By accessing or using this website, you agree to these terms and our
          Privacy Policy. If you do not agree, please stop using the website.
        </p>
      </section>

      <section>
        <h2>2. Website purpose</h2>
        <p>
          This website introduces Rough Note, our capabilities, process, and selected
          work. Its content is general information and may change without notice. A
          quotation request, contact message, newsletter request, or scheduled call
          does not by itself create a client relationship, promise availability, or
          form a contract.
        </p>
      </section>

      <section>
        <h2>3. Project engagements</h2>
        <p>
          Any project will be governed by a separate proposal or agreement covering
          scope, fees, timelines, intellectual property, support, and other commercial
          terms. If those project terms conflict with these website terms, the signed
          project terms control for that engagement.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Break the law or infringe another person&apos;s rights.</li>
          <li>Attempt to bypass security, overload the service, or introduce malware.</li>
          <li>Scrape, copy, or republish substantial website content without permission.</li>
          <li>Misrepresent your identity or submit deceptive, abusive, or spam content.</li>
        </ul>
      </section>

      <section>
        <h2>5. Messages and uploaded files</h2>
        <p>
          You keep ownership of material you submit. You confirm that you have the
          right to share it and grant Rough Note permission to review and use it only
          to evaluate and respond to your request. Do not upload trade secrets,
          credentials, sensitive personal data, illegal material, or files you are not
          authorised to share.
        </p>
      </section>

      <section>
        <h2>6. Our content and intellectual property</h2>
        <p>
          The Rough Note name, brand, site design, writing, illustrations, code,
          animations, and project presentation are owned by Rough Note or used with
          permission. You may view the website for personal or business evaluation,
          but may not reproduce, modify, sell, or create derivative works from it
          without written permission.
        </p>
      </section>

      <section>
        <h2>7. Availability and external services</h2>
        <p>
          We aim to keep the website accurate and available, but provide it on an “as
          available” basis. We do not promise uninterrupted operation or that every
          item is error-free. Third-party links, maps, calendars, meeting tools, and
          other external services are controlled by their respective providers.
        </p>
      </section>

      <section>
        <h2>8. Liability</h2>
        <p>
          To the extent permitted by law, Rough Note is not liable for indirect,
          incidental, special, or consequential loss arising from use of this website.
          Nothing in these terms excludes liability that cannot legally be excluded.
        </p>
      </section>

      <section>
        <h2>9. Governing law and changes</h2>
        <p>
          These website terms are governed by the laws of India, with courts in
          Chennai, Tamil Nadu having jurisdiction, subject to any mandatory rights
          that apply to you. We may update the terms; continued use after an update
          means the new version applies.
        </p>
      </section>
    </InformationPage>
  );
}

export function CareersPage() {
  return (
    <InformationPage
      activeItem="contact"
      eyebrow="Careers"
      intro="We are a small studio of designers, builders, and curious problem-solvers who enjoy turning early ideas into useful products."
      pageLabel="Careers"
      summary={[
        'No open role is advertised right now.',
        'Thoughtful introductions are welcome.',
        'Show us how you think, not only the final polish.'
      ]}
      title="Make Rough Ideas Real"
    >
      <section>
        <h2>Current openings</h2>
        <p>
          We do not have a specific role open today. When a position becomes
          available, we will publish its responsibilities, location, working model,
          and application deadline on this page.
        </p>
      </section>

      <section>
        <h2>What we value</h2>
        <ul>
          <li>Clear thinking and care for the people using what we make.</li>
          <li>Comfort moving between rough exploration and disciplined delivery.</li>
          <li>Honest communication, useful feedback, and ownership of outcomes.</li>
          <li>Craft in design, engineering, automation, storytelling, or operations.</li>
        </ul>
      </section>

      <section>
        <h2>Send an introduction</h2>
        <p>
          If Rough Note feels like your kind of place, email{' '}
          <a href="mailto:careers@roughnote.in?subject=Careers%20at%20Rough%20Note">
            careers@roughnote.in
          </a>{' '}
          with a short introduction, the work you want to do, and links to relevant
          work. A portfolio can include shipped work, experiments, case studies,
          writing, or a thoughtful breakdown of a difficult problem.
        </p>
        <p>
          Please do not send identity documents, financial information, health data,
          or other sensitive personal information with an initial introduction.
        </p>
      </section>

      <section>
        <h2>What happens next</h2>
        <p>
          We review introductions when a suitable need appears. We may not be able to
          respond to every speculative application. If there is a potential fit, we
          will contact you with the role details and the next step before requesting
          any additional information.
        </p>
      </section>

      <section>
        <h2>Equal opportunity</h2>
        <p>
          Rough Note welcomes applicants based on their ability, potential, and
          alignment with the role. We do not tolerate unlawful discrimination or
          harassment in our hiring process or workplace.
        </p>
      </section>
    </InformationPage>
  );
}
