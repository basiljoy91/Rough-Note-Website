import { useRef, useState, type FormEvent } from 'react';
import { HandDrawnUnderline } from './FooterTypography';
import styles from './notebook-footer.module.css';

interface PaperInputProps {
  onFocusChange: (focused: boolean) => void;
}

export function PaperInput({ onFocusChange }: PaperInputProps) {
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
}

export function PaperButton({ submitted }: SubscribePaperButtonProps) {
  return (
    <span className={styles.subscribeAction}>
      <button className={styles.subscribeButton} type="submit">
        Subscribe
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
}

export function NewsletterCard({ onFocusChange }: NewsletterCardProps) {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSubmitted(false);
    window.requestAnimationFrame(() => setSubmitted(true));
    onFocusChange(false);
    const input = formRef.current?.elements.namedItem('email');
    if (input instanceof HTMLInputElement) input.blur();
  };

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
        ref={formRef}
        className={styles.newsletterForm}
        onSubmit={submit}
        data-drawing-exclusion
      >
        <PaperInput onFocusChange={onFocusChange} />
        <PaperButton submitted={submitted} />
        <span className={styles.srOnly} role="status" aria-live="polite">
          {submitted ? 'Subscription request noted.' : ''}
        </span>
      </form>
    </section>
  );
}
