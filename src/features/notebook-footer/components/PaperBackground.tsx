import type { ReactNode } from 'react';
import styles from './notebook-footer.module.css';

export function PaperTexture() {
  return (
    <span className={styles.paperTexture} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <b />
      <b />
      <b />
    </span>
  );
}

export function PaperFold() {
  return (
    <svg
      className={styles.paperFold}
      viewBox="0 0 132 112"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="footer-fold-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ddd2c1" />
          <stop offset=".43" stopColor="#f7f0e4" />
          <stop offset=".76" stopColor="#e8dece" />
          <stop offset="1" stopColor="#cfc0ab" />
        </linearGradient>
        <filter id="footer-fold-grain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".7"
            numOctaves="2"
            seed="17"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 .055 0"
          />
        </filter>
      </defs>
      <path
        className={styles.foldCastShadow}
        d="M6 1c24 15 35 39 46 68 27 5 55 20 79 41-26-9-58-13-89-12C36 63 22 27 6 1Z"
      />
      <path
        className={styles.foldBack}
        d="M6 1c25 14 36 42 46 68 29 7 56 21 79 41V1H6Z"
        fill="url(#footer-fold-back)"
      />
      <path
        className={styles.foldGrain}
        d="M6 1c25 14 36 42 46 68 29 7 56 21 79 41V1H6Z"
        filter="url(#footer-fold-grain)"
      />
      <path
        className={styles.foldEdge}
        d="M7 2c23 16 34 40 45 67 27 5 55 20 78 40"
      />
      <path className={styles.foldHighlight} d="M17 7c19 15 28 34 35 55" />
    </svg>
  );
}

export function PaperTear() {
  return (
    <svg
      className={styles.paperTear}
      viewBox="0 0 1440 42"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className={styles.tearFibres}>
        <path d="m76 13 4 15M142 16l-2 12M224 19l5 14M393 24l-2 11M545 27l4 10M713 24l-3 13M912 27l4 9M1119 23l-2 14M1290 20l5 12M1388 15l-2 13" />
        <path d="m45 11 2 8M310 22l-1 8M631 27l3 7M807 25l-2 8M1024 24l2 8M1213 21l-2 9" opacity=".55" />
      </g>
    </svg>
  );
}

interface PaperBackgroundProps {
  children: ReactNode;
}

export function PaperBackground({ children }: PaperBackgroundProps) {
  return (
    <div className={styles.paperShadow}>
      <footer
        className={styles.paper}
        data-rough-anchor="notebook-footer"
        data-testid="notebook-footer"
        aria-label="Rough Note footer"
      >
        <PaperTexture />
        <PaperFold />
        <div className={styles.paperContent}>{children}</div>
        <PaperTear />
      </footer>
    </div>
  );
}
