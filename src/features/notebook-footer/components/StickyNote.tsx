import styles from './notebook-footer.module.css';

export function MaskingTape() {
  return (
    <span className={styles.tape} aria-hidden="true">
      <i className={styles.tapeCreaseOne} />
      <i className={styles.tapeCreaseTwo} />
      <i className={styles.tapeCreaseThree} />
    </span>
  );
}

export const Tape = MaskingTape;

export function LockIllustration() {
  return (
    <svg
      className={styles.lockDrawing}
      viewBox="0 0 58 66"
      role="img"
      aria-label="Lock doodle"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 28v-9C14 8 20 3 29 3c9 0 15 6 15 16v9M21 27v-9c0-6 3-9 8-9 6 0 9 4 9 10v8" strokeWidth="3.4" />
        <path d="M7 29c12-2 32-2 44 0l-2 31c-13 3-27 2-40 0L7 29Z" strokeWidth="3.5" />
        <path d="M9 31c13-1 27-1 40 0M11 57c12 2 24 2 36 0" opacity=".48" strokeWidth="1.1" />
        <path d="M26 41c0-4 6-5 7 0 0 2-1 3-3 5l1 7h-5l1-7c-1-2-1-3-1-5Z" strokeWidth="2.45" />
      </g>
    </svg>
  );
}

export function StickyNote() {
  return (
    <section className={`${styles.column} ${styles.stickyColumn}`}>
      <div className={styles.stickyNote} data-testid="sticky-note">
        <span className={styles.stickyPaper} aria-hidden="true" />
        <MaskingTape />
        <span className={styles.stickyWrinkle} aria-hidden="true" />
        <p>
          Ideas shared
          <br />
          here are always
          <br />
          safe and
          <br />
          confidential.
        </p>
        <svg className={styles.blueScribble} viewBox="0 0 150 28" aria-hidden="true">
          <path d="M4 10c37-5 86-5 140 0M22 16c31-3 67-3 101 0M74 19c13 2 22 4 31 7" />
        </svg>
        <LockIllustration />
        <span className={styles.stickyCurl} aria-hidden="true" />
      </div>
    </section>
  );
}
