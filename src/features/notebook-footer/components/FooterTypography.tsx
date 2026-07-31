import styles from './notebook-footer.module.css';

interface HandDrawnUnderlineProps {
  className?: string;
  variant?: 'title' | 'column';
}

export function HandDrawnUnderline({
  className = '',
  variant = 'column'
}: HandDrawnUnderlineProps) {
  return (
    <svg
      className={`${styles.handDrawnUnderline} ${
        variant === 'title'
          ? styles.headingUnderline
          : styles.columnUnderline
      } ${className}`}
      viewBox="0 0 560 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={styles.underlineBody}
        d="M5 18C101 12 195 13 286 11c94-2 180 1 269-2"
      />
      <path
        className={styles.underlineCenter}
        d="M116 15c73-3 142-3 211-4 52-1 97 1 139 0"
      />
      <path
        className={styles.underlineTexture}
        d="M20 22c106-5 212-5 316-6 73-1 138 1 202-2"
      />
    </svg>
  );
}

function HeaderSketches() {
  return (
    <>
      <svg
        className={styles.titleSketchLeft}
        viewBox="0 0 62 58"
        aria-hidden="true"
      >
        <path d="M9 43 0 46M24 34 5 24M39 23 32 3" />
      </svg>
      <svg
        className={styles.titleSketchRight}
        viewBox="0 0 64 60"
        aria-hidden="true"
      >
        <path d="m10 25 8-22M28 33 46 15M35 47l23-2" />
      </svg>
    </>
  );
}

export function FooterHeading() {
  return (
    <header className={styles.footerHeading}>
      <div className={styles.titleWrap}>
        <HeaderSketches />
        <h2>Thanks for visiting us!</h2>
        <HandDrawnUnderline variant="title" />
      </div>
      <p>
        Every great product starts as a rough note.
        <svg
          className={styles.orangeHeart}
          viewBox="0 0 36 34"
          aria-hidden="true"
        >
          <path d="M18 31S3 20 3 10c0-8 10-10 15-2 5-8 15-6 15 2 0 10-15 21-15 21Z" />
        </svg>
      </p>
    </header>
  );
}

interface FooterDividerProps {
  className?: string;
}

export function FooterDivider({ className = '' }: FooterDividerProps) {
  return (
    <svg
      className={`${styles.columnDivider} ${className}`}
      viewBox="0 0 18 360"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M9 4c-1 69 1 140 0 210-1 49 1 96 0 142" />
      <path
        d="M11 7c-2 82 1 163 0 245 0 36-1 70-1 101"
        opacity=".22"
      />
    </svg>
  );
}
