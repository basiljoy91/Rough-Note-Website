import type { Dispatch, FormEvent, RefObject } from 'react';
import { CONTACT_ROLES } from '../constants';
import type { ContactJourneyAction } from '../state/contactJourneyReducer';
import type {
  ContactStepDefinition,
  RoughNoteContactState
} from '../types';
import {
  FieldIcon,
  HeartDoodle,
  PaperPlaneDoodle,
  SmileDoodle,
  StarDoodle
} from '../components/Doodles';
import { ContactStepShell } from '../components/ContactStepShell';
import {
  BackButton,
  PaperButton,
  PaperInput,
  PaperSelect,
  StickyNote
} from '../components/PaperUI';
import { Envelope, TornFormPaper } from '../paper/PaperObjects';
import styles from '../rough-note-contact.module.css';

interface StepThreeContactProps {
  step: ContactStepDefinition;
  state: RoughNoteContactState;
  dispatch: Dispatch<ContactJourneyAction>;
  headingRef: RefObject<HTMLHeadingElement | null>;
  firstFieldRef: RefObject<HTMLInputElement | null>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export function StepThreeContact({
  step,
  state,
  dispatch,
  headingRef,
  firstFieldRef,
  onSubmit,
  onBack
}: StepThreeContactProps) {
  const busy =
    state.transitionState === 'submitting' || state.transitionState === 'sealing';

  return (
    <ContactStepShell
      step={step}
      transitionState={state.transitionState}
      headingRef={headingRef}
      headingAdornment={
        <span className={styles.stepThreeAdornment}>
          <HeartDoodle />
          <StarDoodle />
        </span>
      }
    >
      <p className={styles.stepIntro}>
        We&apos;ve understood your challenge.
        <br />
        Now we just need a few details so we can
        <br />
        send your personalized solution.
      </p>

      <form className={styles.contactForm} onSubmit={onSubmit} noValidate>
        <TornFormPaper>
          <PaperInput
            ref={firstFieldRef}
            id="name"
            label="Your Name"
            placeholder="Enter your name"
            value={state.contact.name}
            error={state.errors.name}
            required
            icon={<FieldIcon kind="person" />}
            autoComplete="name"
            onChange={(event) =>
              dispatch({
                type: 'SET_CONTACT_FIELD',
                field: 'name',
                value: event.target.value
              })
            }
          />
          <PaperInput
            id="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            value={state.contact.email}
            error={state.errors.email}
            required
            icon={<FieldIcon kind="mail" />}
            autoComplete="email"
            onChange={(event) =>
              dispatch({
                type: 'SET_CONTACT_FIELD',
                field: 'email',
                value: event.target.value
              })
            }
          />
          <PaperInput
            id="phone"
            label="Phone Number (Optional)"
            placeholder="Enter your phone number"
            type="tel"
            value={state.contact.phone}
            error={state.errors.phone}
            icon={<FieldIcon kind="phone" />}
            autoComplete="tel"
            onChange={(event) =>
              dispatch({
                type: 'SET_CONTACT_FIELD',
                field: 'phone',
                value: event.target.value
              })
            }
          />
          <PaperInput
            id="website"
            label="Business / Website (Optional)"
            placeholder="Enter your website"
            value={state.contact.website}
            error={state.errors.website}
            icon={<FieldIcon kind="globe" />}
            autoComplete="url"
            onChange={(event) =>
              dispatch({
                type: 'SET_CONTACT_FIELD',
                field: 'website',
                value: event.target.value
              })
            }
          />
          <PaperSelect
            id="role"
            label="Your Role"
            placeholder="Select your role"
            options={CONTACT_ROLES}
            value={state.contact.role}
            error={state.errors.role}
            required
            onChange={(event) =>
              dispatch({
                type: 'SET_CONTACT_FIELD',
                field: 'role',
                value: event.target.value
              })
            }
          />
        </TornFormPaper>

        <StickyNote tone="yellow" className={styles.routingNote}>
          <p>
            This helps us route
            <br />
            your rough note
            <br />
            to the right
            <br />
            experts!
          </p>
          <StarDoodle />
        </StickyNote>

        {state.errors.submission && (
          <div className={styles.submissionError} role="alert">
            <strong>Your paper came back.</strong>
            <span>{state.errors.submission}</span>
          </div>
        )}

        <div className={styles.formActions}>
          <BackButton onClick={onBack} disabled={busy} />
          <PaperButton
            tone="pink"
            icon={<PaperPlaneDoodle />}
            type="submit"
            disabled={busy}
            aria-describedby="submission-status"
          >
            {busy ? 'Sending your rough note…' : 'Send My Rough Note'}
          </PaperButton>
        </div>
        <p id="submission-status" className={styles.excitementNote}>
          We&apos;re excited to
          <br />
          help you! <SmileDoodle />
        </p>
      </form>
      {state.transitionState === 'sealing' && (
        <div
          className={styles.envelopeTransitionPreview}
          data-envelope-preview
          aria-hidden="true"
        >
          <Envelope compact />
        </div>
      )}
    </ContactStepShell>
  );
}
