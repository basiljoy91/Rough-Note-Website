import type { RefObject } from 'react';
import type { ContactStepDefinition, ContactTransitionState } from '../types';
import { ArrowDoodle, BulbDoodle, HeartDoodle, PencilDoodle, SmileDoodle, StarDoodle } from '../components/Doodles';
import { ContactStepShell } from '../components/ContactStepShell';
import { PaperButton, PaperPanel, StickyNote } from '../components/PaperUI';
import { CrumpledPaper } from '../paper/PaperObjects';
import styles from '../rough-note-contact.module.css';

interface StepOneIntroProps {
  step: ContactStepDefinition;
  transitionState: ContactTransitionState;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
}

export function StepOneIntro({
  step,
  transitionState,
  headingRef,
  onStart
}: StepOneIntroProps) {
  const busy = transitionState !== 'idle';

  return (
    <ContactStepShell
      step={step}
      transitionState={transitionState}
      headingRef={headingRef}
      headingAdornment={<BulbDoodle className={styles.headingBulb} />}
    >
      <div className={styles.stepOneIntro} data-step-one-surrounding>
        <p>
          Every great product starts
          <br />
          with a rough note.
        </p>
        <p>
          Tell us what&apos;s stopping your business,
          <br />
          and we&apos;ll sketch the first solution —
          <br />
          completely <strong>FREE.</strong>
        </p>
      </div>

      <div className={styles.stepOneComposition}>
        <ArrowDoodle className={`${styles.ballArrow} ${styles.ballArrowLeft}`} />
        <ArrowDoodle className={`${styles.ballArrow} ${styles.ballArrowRight}`} />
        <ArrowDoodle className={`${styles.ballArrow} ${styles.ballArrowBottom}`} />
        <CrumpledPaper transitioning={transitionState === 'unfolding'} />
        <StickyNote tone="pink" className={styles.noPressureNote}>
          <p>
            No Sales.
            <br />
            No Pressure.
            <br />
            Just Ideas.
          </p>
          <SmileDoodle />
        </StickyNote>
      </div>

      <PaperPanel className={styles.ideaExplanation}>
        <HeartDoodle className={styles.explanationHeart} />
        <StarDoodle className={styles.explanationStar} />
        <p>
          Like the idea? Great,
          <br />
          let&apos;s build it together.
        </p>
        <p>
          Not the right direction?
          <br />
          That&apos;s okay — you can
          <br />
          modify it or simply take
          <br />
          the idea with you.
        </p>
      </PaperPanel>

      <PaperButton
        tone="orange"
        className={styles.primaryAction}
        icon={<PencilDoodle />}
        onClick={onStart}
        disabled={busy}
        aria-label="Start My Rough Note"
      >
        {busy ? 'Opening your paper…' : 'Start My Rough Note'}
      </PaperButton>
    </ContactStepShell>
  );
}
