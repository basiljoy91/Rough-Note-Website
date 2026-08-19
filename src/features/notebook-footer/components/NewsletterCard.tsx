import { useState, type ChangeEvent, type FormEvent } from 'react';
import { subscribeToNewsletter } from '../newsletterSubmission';
import { HandDrawnUnderline } from './FooterTypography';
import styles from './notebook-footer.module.css';

interface PaperInputProps {
  onFocusChange: (focused: boolean) => void;
  value: string;
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PaperInput({
  onFocusChange,
  value,
  disabled,
  onChange
}: PaperInputProps) {
  return (
    <label className={styles.paperInputWrap}>
      <span className={styles.srOnly}>Email address</span>
      <input
        className={styles.paperInput}
        type="email"
        name="email"
        placeholder="Your email address"
        autoComplete="email"
        required
        value={value}
        disabled={disabled}
        aria-describedby="newsletter-consent newsletter-status"
        onChange={onChange}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
      <span className={styles.inputCrease} aria-hidden="true" />
      <span className={styles.inputFocusUnderline} aria-hidden="true" />
    </label>
  );
}

interface SubscribePaperButtonProps {
  submitted: boolean;
  submitting: boolean;
}

export function PaperButton({
  submitted,
  submitting
}: SubscribePaperButtonProps) {
  return (
    <span className={styles.subscribeAction}>
      <button
        className={styles.subscribeButton}
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Sending…' : submitted ? 'Check inbox' : 'Subscribe'}
      </button>
      <svg
        className={`${styles.subscribeCheck} ${
          submitted ? styles.subscribeCheckVisible : ''
        }`}
        data-testid="subscribe-check"
        viewBox="0 0 34 28"
        aria-hidden="true"
      >
        <path d="m3 14 8 8L30 4" />
      </svg>
    </span>
  );
}

interface NewsletterCardProps {
  onFocusChange: (focused: boolean) => void;
  subscribeRequest?: typeof subscribeToNewsletter;
}

type SubmissionState = 'idle' | 'submitting' | 'accepted' | 'error';

export function NewsletterCard({
  onFocusChange,
  subscribeRequest = subscribeToNewsletter
}: NewsletterCardProps) {
  const [email, setEmail] = useState('');
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionState === 'submitting' || !event.currentTarget.reportValidity()) {
      return;
    }
    const honeypotValue = new FormData(event.currentTarget).get(
      'websiteAddress2'
    );
    setSubmissionState('submitting');
    setErrorMessage('');
    onFocusChange(false);
    try {
      await subscribeRequest(
        email,
        typeof honeypotValue === 'string' ? honeypotValue : ''
      );
      setSubmissionState('accepted');
    } catch (error) {
      setSubmissionState('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'We could not start your subscription. Please try again.'
      );
    }
  };

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (submissionState !== 'idle') setSubmissionState('idle');
    if (errorMessage) setErrorMessage('');
  };

  const submitted = submissionState === 'accepted';
  const submitting = submissionState === 'submitting';

  return (
    <section
      className={`${styles.column} ${styles.newsletterCard}`}
      data-testid="newsletter-card"
    >
      <h3 className={styles.columnTitle}>Stay Updated by Us</h3>
      <HandDrawnUnderline />
      <p>
        Get the latest insights, project stories
        <br className={styles.desktopBreak} /> and creative ideas from Rough
        Note.
      </p>
      <form
        className={styles.newsletterForm}
        onSubmit={(event) => void submit(event)}
        data-drawing-exclusion
      >
        <div className={styles.newsletterHoneypot} aria-hidden="true">
          <label htmlFor="newsletter-website-address-2">Website address 2</label>
          <input
            id="newsletter-website-address-2"
            name="websiteAddress2"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <PaperInput
          onFocusChange={onFocusChange}
          value={email}
          disabled={submitting}
          onChange={changeEmail}
        />
        <PaperButton submitted={submitted} submitting={submitting} />
      </form>
      <div className={styles.newsletterFeedback}>
        <p id="newsletter-consent" className={styles.newsletterConsent}>
          We&apos;ll email a confirmation link. Unsubscribe anytime.
        </p>
        <p
          id="newsletter-status"
          className={`${styles.newsletterStatus} ${
            submissionState === 'error' ? styles.newsletterStatusError : ''
          }`}
          role={submissionState === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {submitted
            ? 'Check your inbox to confirm your subscription.'
            : errorMessage}
        </p>
      </div>
    </section>
  );
}
