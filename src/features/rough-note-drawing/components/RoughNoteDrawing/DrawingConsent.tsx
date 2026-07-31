import styles from './drawing-toolbar.module.css';

interface DrawingConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function DrawingConsent({
  onAccept,
  onDecline
}: DrawingConsentProps) {
  return (
    <section
      className={styles.consentNote}
      role="dialog"
      aria-labelledby="rough-note-consent-title"
      aria-describedby="rough-note-consent-copy"
      data-drawing-exclusion
      data-cursor="pointer"
    >
      <span className={styles.consentTape} aria-hidden="true" />
      <svg
        className={styles.consentClip}
        viewBox="0 0 52 82"
        aria-hidden="true"
      >
        <path
          className={styles.consentClipShadow}
          d="M38 12c9 6 9 17 4 26L25 68c-4 8-14 10-21 5-7-4-9-14-4-22l18-32c3-6 11-8 17-4 6 3 8 11 4 17L22 61c-2 4-7 5-11 3-4-3-5-8-2-12l16-28"
        />
        <path d="M35 8c9 5 11 16 6 25L24 64c-5 8-15 11-23 6-8-5-10-15-5-23l18-32c4-7 12-9 19-5 6 4 8 12 4 19L20 58c-2 4-7 5-11 3-4-2-5-7-3-11l16-29" />
      </svg>
      <strong id="rough-note-consent-title">Rough Note Memory:</strong>
      <p id="rough-note-consent-copy">
        Help us save your doodles for your next visit!
        <small>Saved only in this browser. Nothing is uploaded to our server.</small>
      </p>
      <div>
        <button type="button" onClick={onDecline}>
          No, thanks
        </button>
        <button type="button" className={styles.consentPrimary} onClick={onAccept}>
          Remember my art!
        </button>
      </div>
    </section>
  );
}
