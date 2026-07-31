import type { ReactNode, RefObject } from 'react';
import type { ContactStepDefinition, ContactTransitionState } from '../types';
import { ContactProgress } from './ContactProgress';
import { HandDrawnUnderline, StepLabel } from './PaperUI';
import styles from '../rough-note-contact.module.css';

interface ContactStepShellProps {
  step: ContactStepDefinition;
  transitionState: ContactTransitionState;
  headingRef: RefObject<HTMLHeadingElement | null>;
  headingAdornment?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ContactStepShell({
  step,
  transitionState,
  headingRef,
  headingAdornment,
  children,
  className = ''
}: ContactStepShellProps) {
  return (
    <section
      className={`${styles.stepShell} ${styles[`step${step.id}`]} ${className}`}
      data-step={step.id}
      aria-labelledby={`contact-step-${step.id}-title`}
      aria-busy={
        transitionState !== 'idle' &&
        transitionState !== 'complete' &&
        transitionState !== 'error'
      }
    >
      <div className={styles.paperPerimeter} aria-hidden="true" />
      <ContactProgress currentStep={step.id} />
      <StepLabel step={step.id} accent={step.accent} />
      <header className={styles.stepHeading}>
        <div className={styles.headingLine}>
          <h1
            id={`contact-step-${step.id}-title`}
            ref={headingRef}
            tabIndex={-1}
          >
            {step.title}
          </h1>
          {headingAdornment}
        </div>
        <HandDrawnUnderline accent={step.id === 2 ? 'blue' : 'orange'} />
      </header>
      {children}
      <div className={styles.pageNumber} aria-hidden="true">
        Page {String(step.id).padStart(2, '0')}
        <span />
      </div>
    </section>
  );
}
