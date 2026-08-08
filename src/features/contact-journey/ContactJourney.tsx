import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type FormEvent
} from 'react';
import { CONTACT_STEPS } from './constants';
import {
  foldChallengeIntoContact,
  reversePaperStep,
  sealContactEnvelope,
  unfoldChallengePaper
} from './animation/timelines';
import {
  contactJourneyReducer,
  initialContactState
} from './state/contactJourneyReducer';
import { submitContactRequest } from './state/submission';
import {
  firstErrorField,
  hasErrors,
  validateChallenge,
  validateContact,
  validateReferenceFile
} from './state/validation';
import { StepFourSuccess } from './steps/StepFourSuccess';
import { StepOneIntro } from './steps/StepOneIntro';
import { StepThreeContact } from './steps/StepThreeContact';
import { StepTwoChallenge } from './steps/StepTwoChallenge';
import type { ContactErrors, ContactStepNumber } from './types';
import styles from './rough-note-contact.module.css';

export interface ContactJourneyTransitions {
  unfold: typeof unfoldChallengePaper;
  foldToContact: typeof foldChallengeIntoContact;
  sealEnvelope: typeof sealContactEnvelope;
  reverse: typeof reversePaperStep;
}

interface ContactJourneyProps {
  transitions?: ContactJourneyTransitions;
  submitRequest?: typeof submitContactRequest;
}

const DEFAULT_TRANSITIONS: ContactJourneyTransitions = {
  unfold: unfoldChallengePaper,
  foldToContact: foldChallengeIntoContact,
  sealEnvelope: sealContactEnvelope,
  reverse: reversePaperStep
};

const STEP_ANNOUNCEMENTS = {
  1: 'Step 1 of 4. Start Your Rough Note.',
  2: 'Step 2 of 4. Tell Us About Your Challenge.',
  3: 'Step 3 of 4. Almost There.',
  4: 'Your rough note has been received.'
} satisfies Record<ContactStepNumber, string>;

function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function positionPaperForTransition(element: HTMLElement): Promise<void> {
  if (typeof element.scrollIntoView !== 'function') return;
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  element.scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth',
    block: 'start',
    inline: 'nearest'
  });
  if (!reducedMotion) {
    await new Promise((resolve) => window.setTimeout(resolve, 180));
  }
}

const TESTING_MODE = true;
const LOCAL_STORAGE_KEY = 'rough_note_contact_state_v1';

function getInitialState() {
  if (TESTING_MODE && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved state', e);
    }
  }
  return initialContactState;
}

export function ContactJourney({
  transitions = DEFAULT_TRANSITIONS,
  submitRequest = TESTING_MODE
    ? async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return { submissionId: 'TEST-' + Math.random().toString(36).slice(2, 9).toUpperCase() };
      }
    : submitContactRequest
}: ContactJourneyProps = {}) {
  const [state, dispatch] = useReducer(
    contactJourneyReducer,
    initialContactState,
    getInitialState
  );

  useEffect(() => {
    if (TESTING_MODE && typeof window !== 'undefined') {
      if (state.transitionState === 'idle') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      }
    }
  }, [state]);
  const [announcement, setAnnouncement] = useState(STEP_ANNOUNCEMENTS[1]);
  const [resetConfirmation, setResetConfirmation] = useState(false);
  const journeyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const challengeFirstFieldRef = useRef<HTMLSelectElement>(null);
  const contactFirstFieldRef = useRef<HTMLInputElement>(null);
  const actionLockedRef = useRef(false);

  const activeStep = useMemo(
    () => CONTACT_STEPS.find((step) => step.id === state.currentStep)!,
    [state.currentStep]
  );

  const focusFirstError = useCallback((errors: ContactErrors) => {
    const field = firstErrorField(errors);
    if (!field) return;
    window.requestAnimationFrame(() => {
      document.getElementById(field)?.focus();
    });
  }, []);

  const commitStep = useCallback((step: ContactStepNumber, push = true) => {
    dispatch({ type: 'SET_STEP', step });
    setAnnouncement(STEP_ANNOUNCEMENTS[step]);
    if (push) {
      window.history.pushState(
        { ...window.history.state, roughNoteContactStep: step },
        ''
      );
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('rough-note-contact-page');
    window.history.replaceState(
      { ...window.history.state, roughNoteContactStep: 1 },
      ''
    );
    return () => document.body.classList.remove('rough-note-contact-page');
  }, []);

  useEffect(() => {
    const busy =
      state.transitionState !== 'idle' &&
      state.transitionState !== 'complete' &&
      state.transitionState !== 'error';
    document.documentElement.classList.toggle('contact-transition-locked', busy);
    return () =>
      document.documentElement.classList.remove('contact-transition-locked');
  }, [state.transitionState]);

  useEffect(() => {
    if (state.transitionState !== 'idle' && state.transitionState !== 'complete') {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    headingRef.current?.focus({ preventScroll: true });
  }, [state.currentStep, state.transitionState]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const requested = event.state?.roughNoteContactStep as
        | ContactStepNumber
        | undefined;
      if (!requested || requested >= state.currentStep || state.currentStep === 4) {
        return;
      }
      if (actionLockedRef.current || !journeyRef.current) return;
      actionLockedRef.current = true;
      dispatch({ type: 'SET_TRANSITION', value: 'folding' });
      void transitions.reverse(journeyRef.current).then(() => {
        commitStep(requested, false);
        actionLockedRef.current = false;
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [commitStep, state.currentStep, transitions]);

  const startJourney = async () => {
    if (actionLockedRef.current || !journeyRef.current) return;
    actionLockedRef.current = true;
    dispatch({ type: 'SET_TRANSITION', value: 'unfolding' });
    await transitions.unfold(journeyRef.current);
    commitStep(2);
    actionLockedRef.current = false;
  };

  const continueToContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (actionLockedRef.current || !journeyRef.current) return;
    const form = event.currentTarget;
    const errors = validateChallenge(state.challenge);
    if (hasErrors(errors)) {
      dispatch({ type: 'SET_ERRORS', errors });
      focusFirstError(errors);
      return;
    }
    actionLockedRef.current = true;
    await positionPaperForTransition(form);
    dispatch({ type: 'SET_TRANSITION', value: 'folding' });
    await transitions.foldToContact(journeyRef.current);
    commitStep(3);
    actionLockedRef.current = false;
  };

  const submitJourney = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (actionLockedRef.current || !journeyRef.current) return;
    const errors = validateContact(state.contact);
    if (hasErrors(errors)) {
      dispatch({ type: 'SET_ERRORS', errors });
      focusFirstError(errors);
      return;
    }

    actionLockedRef.current = true;
    dispatch({ type: 'SET_ERRORS', errors: {} });
    dispatch({ type: 'SET_TRANSITION', value: 'submitting' });
    setAnnouncement('Sending your rough note.');

    try {
      const result = await submitRequest(state);
      const formPaper = journeyRef.current.querySelector<HTMLElement>(
        '[data-torn-form-paper]'
      );
      if (formPaper) await positionPaperForTransition(formPaper);
      dispatch({ type: 'SET_TRANSITION', value: 'sealing' });
      setAnnouncement('Your note was accepted. Sealing the envelope.');
      await nextPaint();
      await transitions.sealEnvelope(journeyRef.current);
      dispatch({
        type: 'SUBMISSION_SUCCESS',
        submissionId: result.submissionId
      });
      window.history.pushState(
        { ...window.history.state, roughNoteContactStep: 4 },
        ''
      );
      setAnnouncement(STEP_ANNOUNCEMENTS[4]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We could not send your rough note. Please try again.';
      dispatch({ type: 'SET_TRANSITION', value: 'error' });
      dispatch({ type: 'SET_ERRORS', errors: { submission: message } });
      setAnnouncement(`Submission failed. ${message}`);
    } finally {
      actionLockedRef.current = false;
    }
  };

  const goBack = async (step: 1 | 2) => {
    if (actionLockedRef.current || !journeyRef.current) return;
    actionLockedRef.current = true;
    dispatch({ type: 'SET_TRANSITION', value: 'folding' });
    await transitions.reverse(journeyRef.current);
    commitStep(step);
    actionLockedRef.current = false;
  };

  const handleFile = (file: File) => {
    const error = validateReferenceFile(file);
    if (error) {
      dispatch({
        type: 'SET_ERRORS',
        errors: { ...state.errors, referenceFile: error }
      });
      return;
    }
    dispatch({ type: 'SET_REFERENCE_FILE', file });
  };

  const resetJourney = () => {
    if (!resetConfirmation) {
      setResetConfirmation(true);
      return;
    }
    dispatch({ type: 'RESET' });
    setResetConfirmation(false);
    setAnnouncement(STEP_ANNOUNCEMENTS[1]);
    window.history.replaceState(
      { ...window.history.state, roughNoteContactStep: 1 },
      ''
    );
  };

  return (
    <div className={styles.contactApp}>
      <main
        className={styles.contactMain}
        data-rough-anchor="contact-journey"
        data-drawing-exclusion
      >
        <div
          ref={journeyRef}
          className={styles.journeyWorkspace}
          data-contact-transition={state.transitionState}
        >
          {state.currentStep === 1 && (
            <StepOneIntro
              step={activeStep}
              transitionState={state.transitionState}
              headingRef={headingRef}
              onStart={() => void startJourney()}
            />
          )}
          {state.currentStep === 2 && (
            <StepTwoChallenge
              step={activeStep}
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              firstFieldRef={challengeFirstFieldRef}
              onContinue={(event) => void continueToContact(event)}
              onBack={() => void goBack(1)}
              onFile={handleFile}
            />
          )}
          {state.currentStep === 3 && (
            <StepThreeContact
              step={activeStep}
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              firstFieldRef={contactFirstFieldRef}
              onSubmit={(event) => void submitJourney(event)}
              onBack={() => void goBack(2)}
            />
          )}
          {state.currentStep === 4 && (
            <StepFourSuccess
              step={activeStep}
              transitionState={state.transitionState}
              headingRef={headingRef}
              submissionId={state.submissionId}
              onReset={resetJourney}
            />
          )}
          {state.currentStep === 4 && resetConfirmation && (
            <div
              className={styles.resetConfirmation}
              role="alertdialog"
              aria-labelledby="reset-journey-title"
              aria-describedby="reset-journey-copy"
            >
              <strong id="reset-journey-title">Open a fresh page?</strong>
              <p id="reset-journey-copy">
                This clears the details from this completed request.
              </p>
              <button type="button" onClick={() => setResetConfirmation(false)}>
                Keep this page
              </button>
              <button type="button" onClick={resetJourney}>
                Start fresh
              </button>
            </div>
          )}
        </div>
        <p className={styles.visuallyHidden} aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </main>
    </div>
  );
}
