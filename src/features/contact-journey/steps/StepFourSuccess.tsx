import type { RefObject } from 'react';
import type { ContactStepDefinition, ContactTransitionState } from '../types';
import {
  BriefcaseDoodle,
  CalendarDoodle,
  CheckDoodle,
  ClockDoodle,
  HeartDoodle,
  SmileDoodle,
  StarDoodle
} from '../components/Doodles';
import { ContactStepShell } from '../components/ContactStepShell';
import { PaperButton, PaperPanel, StickyNote } from '../components/PaperUI';
import styles from '../rough-note-contact.module.css';

interface StepFourSuccessProps {
  step: ContactStepDefinition;
  transitionState: ContactTransitionState;
  headingRef: RefObject<HTMLHeadingElement | null>;
  submissionId?: string;
  onReset: () => void;
}

const CHECKLIST = [
  'No obligation',
  'No spam',
  'Practical ideas',
  'Personalized recommendations',
  'Human review by our creative team'
];

export function StepFourSuccess({
  step,
  transitionState,
  headingRef,
  submissionId,
  onReset
}: StepFourSuccessProps) {
  return (
    <ContactStepShell
      step={step}
      transitionState={transitionState}
      headingRef={headingRef}
      headingAdornment={<SmileDoodle className={styles.headingSmile} />}
    >
      <div className={styles.successComposition}>
        <div className={styles.finalInvitation}>
          <img src="/assets/images/invt.png" alt="Your rough note has been received." />
        </div>
        {submissionId && (
          <p className={styles.confirmationNumber}>
            Confirmation: <strong>{submissionId}</strong>
          </p>
        )}
      </div>

      <div className={styles.successDetails}>
        <PaperPanel className={styles.workingHours}>
          <h2>
            Working Hours <ClockDoodle />
          </h2>
          <p>
            <BriefcaseDoodle />
            <span>
              Monday – Friday
              <strong>9:00 AM – 8:00 PM</strong>
            </span>
          </p>
          <p>
            <CalendarDoodle />
            <span>
              Saturday
              <strong>9:00 AM – 4:00 PM</strong>
            </span>
          </p>
          <p>
            <span className={styles.closedMark}>×</span>
            <span>
              Sunday – <strong className={styles.closed}>Closed</strong>
            </span>
          </p>
        </PaperPanel>

        <StickyNote tone="blue" className={styles.responseNote}>
          <p>
            We usually
            <br />
            review your
            <br />
            submission and
            <br />
            get back to you
            <br />
            within 24 working
            <br />
            hours.
          </p>
          <HeartDoodle />
        </StickyNote>

        <ul className={styles.successChecklist}>
          {CHECKLIST.map((item) => (
            <li key={item}>
              <CheckDoodle />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <StickyNote tone="yellow" className={styles.quoteNote}>
          <p>
            Every great
            <br />
            product starts
            <br />
            with one rough
            <br />
            note. You just
            <br />
            took the first
            <br />
            step.
          </p>
          <StarDoodle />
          <HeartDoodle />
        </StickyNote>
      </div>

      <div className={styles.successActions}>
        <a href="./index.html?animated=true">Return Home</a>
        <span aria-hidden="true">•</span>
        <a href="./index.html?animated=true#projects">View Our Work</a>
        <PaperButton tone="green" onClick={onReset}>
          Start another rough note
        </PaperButton>
      </div>
    </ContactStepShell>
  );
}
