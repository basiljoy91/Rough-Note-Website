import { CONTACT_STEPS } from '../constants';
import type { ContactStepNumber } from '../types';
import styles from '../rough-note-contact.module.css';

export function ContactProgress({ currentStep }: { currentStep: ContactStepNumber }) {
  return (
    <ol className={styles.progress} aria-label={`Step ${currentStep} of 4`}>
      {CONTACT_STEPS.map((step) => (
        <li
          key={step.id}
          className={`${styles.progressTab} ${styles[step.accent]} ${
            currentStep === step.id ? styles.progressActive : ''
          } ${currentStep > step.id ? styles.progressComplete : ''}`}
          aria-current={currentStep === step.id ? 'step' : undefined}
        >
          <span>{String(step.id).padStart(2, '0')}</span>
        </li>
      ))}
    </ol>
  );
}
