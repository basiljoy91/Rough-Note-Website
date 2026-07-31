import type { Dispatch, FormEvent, RefObject } from 'react';
import { DEPARTMENTS, SOLUTION_TYPES } from '../constants';
import type { ContactJourneyAction } from '../state/contactJourneyReducer';
import type {
  ContactStepDefinition,
  RoughNoteContactState
} from '../types';
import { ArrowDoodle, PencilDoodle, StarDoodle } from '../components/Doodles';
import { ContactStepShell } from '../components/ContactStepShell';
import {
  BackButton,
  PaperButton,
  PaperSelect,
  PaperTextarea,
  StickyNote
} from '../components/PaperUI';
import { UploadPaper } from '../components/UploadPaper';
import { CreaseOverlay, FoldingPaperEdges } from '../paper/PaperObjects';
import styles from '../rough-note-contact.module.css';

interface StepTwoChallengeProps {
  step: ContactStepDefinition;
  state: RoughNoteContactState;
  dispatch: Dispatch<ContactJourneyAction>;
  headingRef: RefObject<HTMLHeadingElement | null>;
  firstFieldRef: RefObject<HTMLSelectElement | null>;
  onContinue: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onFile: (file: File) => void;
}

const SUPPORTED_FILES = [
  'Company Logo',
  'Images',
  'Screenshots',
  'Wireframes',
  'PDFs',
  'Documents'
];

export function StepTwoChallenge({
  step,
  state,
  dispatch,
  headingRef,
  firstFieldRef,
  onContinue,
  onBack,
  onFile
}: StepTwoChallengeProps) {
  const busy = state.transitionState !== 'idle';
  return (
    <ContactStepShell
      step={step}
      transitionState={state.transitionState}
      headingRef={headingRef}
      headingAdornment={<StarDoodle className={styles.headingStar} />}
    >
      <p className={styles.stepIntro}>
        Help us understand your challenge
        <br />
        so we can sketch a better solution.
      </p>

      <form
        className={styles.challengeForm}
        onSubmit={onContinue}
        noValidate
        data-step-two-form
      >
        <CreaseOverlay className={styles.formCreases} />
        <FoldingPaperEdges />
        <PaperSelect
          ref={firstFieldRef}
          id="solutionType"
          label="1. What type of solution do you need?"
          placeholder="Select a solution type"
          options={SOLUTION_TYPES}
          value={state.challenge.solutionType}
          error={state.errors.solutionType}
          required
          onChange={(event) =>
            dispatch({
              type: 'SET_CHALLENGE_FIELD',
              field: 'solutionType',
              value: event.target.value
            })
          }
        />
        <PaperSelect
          id="department"
          label="2. Which department is this for?"
          placeholder="Select a department"
          options={DEPARTMENTS}
          value={state.challenge.department}
          error={state.errors.department}
          required
          onChange={(event) =>
            dispatch({
              type: 'SET_CHALLENGE_FIELD',
              field: 'department',
              value: event.target.value
            })
          }
        />
        <div className={styles.uploadComposition}>
          <UploadPaper
            file={state.challenge.referenceFile}
            error={state.errors.referenceFile}
            onSelect={onFile}
            onRemove={() => dispatch({ type: 'SET_REFERENCE_FILE', file: null })}
          />
          <StickyNote tone="blue" className={styles.uploadNote}>
            <p>
              Upload anything
              <br />
              that helps us
              <br />
              understand your
              <br />
              idea better.
            </p>
            <StarDoodle />
          </StickyNote>
          <ArrowDoodle className={styles.uploadArrow} />
        </div>

        <div className={styles.supportedFiles}>
          <span>Supported files:</span>
          <ul>
            {SUPPORTED_FILES.map((file) => (
              <li key={file}>
                <span aria-hidden="true">▧</span>
                {file}
              </li>
            ))}
          </ul>
        </div>

        <PaperTextarea
          id="challengeText"
          label="4. What’s the challenge you’re facing?"
          placeholder="Describe the problem, not the solution..."
          rows={6}
          value={state.challenge.challengeText}
          error={state.errors.challengeText}
          required
          onChange={(event) =>
            dispatch({
              type: 'SET_CHALLENGE_FIELD',
              field: 'challengeText',
              value: event.target.value
            })
          }
        />

        <StickyNote tone="green" className={styles.specificNote}>
          <p>
            Be specific.
            <br />
            The more we
            <br />
            understand,
            <br />
            the better we
            <br />
            can help.
          </p>
          <SmileDoodleMini />
        </StickyNote>

        <div className={styles.formActions}>
          <BackButton onClick={onBack} disabled={busy} />
          <PaperButton
            tone="blue"
            icon={<PencilDoodle />}
            type="submit"
            disabled={busy}
          >
            {busy ? 'Folding…' : 'Continue →'}
          </PaperButton>
        </div>
      </form>
    </ContactStepShell>
  );
}

function SmileDoodleMini() {
  return (
    <span className={styles.noteSmile} aria-hidden="true">
      ◡
    </span>
  );
}
