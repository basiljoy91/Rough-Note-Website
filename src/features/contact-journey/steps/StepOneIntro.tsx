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
          Every great product starts with a rough note.
        </p>
        <p>
          Tell us what&apos;s stopping your business and we&apos;ll sketch the first
          solution —{' '}
          completely <strong>FREE.</strong>
        </p>
      </div>

      <div
        className={styles.stepOneTrustRow}
        role="list"
        aria-label="What to expect"
        data-step-one-surrounding
      >
        <span role="listitem">Free first direction</span>
        <span role="listitem">About 2 minutes</span>
        <span role="listitem">No obligation</span>
      </div>

      <div className={styles.stepOneWorkbench}>
        <StickyNote
          tone="yellow"
          className={styles.whatHappensNote}
          data-step-one-surrounding
        >
          <p className={styles.noteKicker}>What happens next?</p>
          <ol className={styles.stepOneMiniSteps}>
            <li>
              <span>01</span>
              <p>
                <strong>Share the challenge</strong>
                A few simple questions — no brief needed.
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                <strong>Get a first sketch</strong>
                We turn the problem into a clear direction.
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                <strong>Decide at your pace</strong>
                Keep it, change it, or build it with us.
              </p>
            </li>
          </ol>
        </StickyNote>

        <div className={styles.stepOneFocus}>
          <p className={styles.paperPrompt} data-step-one-surrounding>
            Your idea starts here <span aria-hidden="true">↓</span>
          </p>

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

          <div className={styles.stepOneAction} data-step-one-surrounding>
            <PaperButton
              tone="orange"
              className={styles.primaryAction}
              icon={<PencilDoodle />}
              onClick={onStart}
              disabled={busy}
              aria-label="Start My Rough Note"
              aria-describedby="rough-note-action-detail"
            >
              {busy ? 'Opening your paper…' : 'Start My Rough Note'}
            </PaperButton>
            <p id="rough-note-action-detail">No preparation. No commitment.</p>
          </div>
        </div>

        <StickyNote
          tone="blue"
          className={styles.yourControlNote}
          data-step-one-surrounding
        >
          <StarDoodle className={styles.controlStar} />
          <p className={styles.noteKicker}>Your idea, your call.</p>
          <p>Whatever comes back is yours to:</p>
          <ul>
            <li>Keep the sketch</li>
            <li>Change the direction</li>
            <li>Build together</li>
          </ul>
          <p className={styles.controlPromise}>Zero hard sell. Promise.</p>
        </StickyNote>
      </div>

      <PaperPanel className={styles.ideaExplanation}>
        <div>
          <HeartDoodle className={styles.explanationHeart} />
          <strong>If the direction clicks</strong>
          <p>Great — we can shape it into something real, together.</p>
        </div>
        <span className={styles.explanationDivider} aria-hidden="true" />
        <div>
          <StarDoodle className={styles.explanationStar} />
          <strong>If it needs another pass</strong>
          <p>Modify it with us or take the idea away. No awkward follow-up.</p>
        </div>
      </PaperPanel>
    </ContactStepShell>
  );
}
