import type { CSSProperties, ReactNode } from 'react';
import React, { Suspense } from 'react';
import { LockDoodle } from '../components/Doodles';
import styles from '../rough-note-contact.module.css';
import CrumpledPaper3D from './CrumpledPaper3D';



export function CreaseOverlay({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`${styles.creaseOverlay} ${className}`}
      viewBox="0 0 1000 720"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className={styles.creaseDark}>
        <path d="M45 102 420 338 317 706M320 18l100 320 264 185L657 712" />
        <path d="M664 28 590 230 801 312 978 430M102 590l318-252 244 185 245 82" />
        <path d="m18 440 402-102 170-108M420 338l-15 166 252 208M590 230l74 293" />
      </g>
      <g className={styles.creaseLight}>
        <path d="M51 98 424 334 323 704M327 17l99 317 261 184" />
        <path d="M670 29 597 227l208 80M106 596l318-255 241 188" />
      </g>
    </svg>
  );
}


export function CrumpledPaper({ transitioning = false }: { transitioning?: boolean }) {
  return (
    <div
      className={`${styles.crumpledPaperWrapper} ${
        transitioning ? styles.crumpledTransitioning : ''
      }`}
      data-paper-ball
    >
      <div className={styles.crumpledPaperVolume}>
        <Suspense fallback={null}>
          <CrumpledPaper3D />
        </Suspense>
      </div>
    </div>
  );
}

export function TornFormPaper({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.tornFormPaper} ${className}`} data-torn-form-paper>
      <span className={styles.punchedEdge} aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} />
        ))}
      </span>
      <CreaseOverlay />
      <div className={styles.tornFormContent}>{children}</div>
    </div>
  );
}

export function FoldingPaperEdges() {
  return (
    <span className={styles.foldingPaperEdges} aria-hidden="true">
      <i className={styles.foldEdgeLeft} data-fold-edge="left" />
      <i className={styles.foldEdgeRight} data-fold-edge="right" />
      <i className={styles.foldEdgeTop} data-fold-edge="top" />
      <i className={styles.foldEdgeBottom} data-fold-edge="bottom" />
      <b className={styles.foldThickness} data-fold-thickness />
    </span>
  );
}

export function WaxSeal() {
  return (
    <div className={styles.waxSeal} data-wax-seal aria-hidden="true">
      <span data-wax-impression>RN</span>
    </div>
  );
}

export function SealPress() {
  return (
    <div className={styles.sealPress} data-seal-press aria-hidden="true">
      <i />
      <span>RN</span>
    </div>
  );
}

export function StringWrap() {
  return (
    <div className={styles.stringWrap} data-string-wrap aria-hidden="true">
      <span className={styles.stringHorizontal} />
      <span className={styles.stringVertical} />
      <span className={styles.stringKnot} />
    </div>
  );
}

export function ReceivedStamp() {
  return (
    <div className={styles.receivedStamp} data-received-stamp aria-hidden="true">
      RECEIVED
    </div>
  );
}

export function Envelope({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`${styles.envelope} ${compact ? styles.envelopeCompact : ''}`}
      data-envelope
      aria-label="A sealed Rough Note envelope marked received"
      role="img"
    >
      <div className={styles.envelopeBack} data-envelope-back />
      <div className={styles.envelopeLeftFold} data-envelope-left />
      <div className={styles.envelopeRightFold} data-envelope-right />
      <div className={styles.envelopeBottomFold} data-envelope-bottom />
      <div className={styles.envelopeTopFlap} data-envelope-flap />
      <div className={styles.postalStamp} aria-hidden="true">
        <span>ROUGH NOTE</span>
        <strong>RN</strong>
        <small>CREATIVE STUDIO</small>
      </div>
      <StringWrap />
      <WaxSeal />
      <SealPress />
      <ReceivedStamp />
    </div>
  );
}

export function ConfidentialNote() {
  return (
    <div className={styles.confidentialMark} aria-hidden="true">
      <LockDoodle />
      <span>kept private</span>
    </div>
  );
}
