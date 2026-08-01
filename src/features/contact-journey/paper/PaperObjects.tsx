import type { CSSProperties, ReactNode } from 'react';
import { LockDoodle } from '../components/Doodles';
import styles from '../rough-note-contact.module.css';

export interface PaperFacet {
  id: string;
  clipPath: string;
  initialTransform: string;
  finalTransform: string;
  zIndex: number;
  transformOrigin: string;
  shadowIntensity: number;
}

export const PAPER_FACETS: PaperFacet[] = [
  {
    id: 'north-west',
    clipPath: 'polygon(4% 14%, 32% 2%, 42% 29%, 20% 43%)',
    initialTransform: 'translate3d(8px,12px,18px) rotate(-9deg) rotateY(16deg) scale(.94)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 8,
    transformOrigin: '74% 70%',
    shadowIntensity: 0.2
  },
  {
    id: 'north',
    clipPath: 'polygon(32% 2%, 66% 4%, 59% 32%, 42% 29%)',
    initialTransform: 'translate3d(-2px,9px,24px) rotate(7deg) rotateX(-19deg) scale(.96)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateX(0) scale(1)',
    zIndex: 13,
    transformOrigin: '48% 84%',
    shadowIntensity: 0.25
  },
  {
    id: 'north-east',
    clipPath: 'polygon(66% 4%, 96% 17%, 80% 43%, 59% 32%)',
    initialTransform: 'translate3d(-9px,10px,20px) rotate(10deg) rotateY(-18deg) scale(.94)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 9,
    transformOrigin: '24% 72%',
    shadowIntensity: 0.28
  },
  {
    id: 'west-upper',
    clipPath: 'polygon(4% 14%, 20% 43%, 40% 47%, 2% 61%)',
    initialTransform: 'translate3d(11px,0,16px) rotate(-7deg) rotateY(20deg) scale(.96)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 10,
    transformOrigin: '88% 55%',
    shadowIntensity: 0.22
  },
  {
    id: 'core-upper',
    clipPath: 'polygon(20% 43%, 42% 29%, 59% 32%, 70% 52%, 40% 47%)',
    initialTransform: 'translate3d(3px,4px,29px) rotate(-4deg) rotateX(12deg) scale(.98)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateX(0) scale(1)',
    zIndex: 16,
    transformOrigin: '52% 60%',
    shadowIntensity: 0.32
  },
  {
    id: 'east-upper',
    clipPath: 'polygon(59% 32%, 80% 43%, 98% 60%, 70% 52%)',
    initialTransform: 'translate3d(-12px,-2px,18px) rotate(8deg) rotateY(-20deg) scale(.95)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 11,
    transformOrigin: '10% 50%',
    shadowIntensity: 0.22
  },
  {
    id: 'west-middle',
    clipPath: 'polygon(2% 61%, 40% 47%, 43% 69%, 10% 82%)',
    initialTransform: 'translate3d(12px,-5px,18px) rotate(-10deg) rotateY(18deg) scale(.95)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 7,
    transformOrigin: '88% 30%',
    shadowIntensity: 0.26
  },
  {
    id: 'core',
    clipPath: 'polygon(40% 47%, 70% 52%, 66% 73%, 43% 69%)',
    initialTransform: 'translate3d(0,-2px,34px) rotate(5deg) rotateX(-12deg) scale(.99)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateX(0) scale(1)',
    zIndex: 18,
    transformOrigin: '50% 50%',
    shadowIntensity: 0.34
  },
  {
    id: 'east-middle',
    clipPath: 'polygon(70% 52%, 98% 60%, 90% 84%, 66% 73%)',
    initialTransform: 'translate3d(-11px,-5px,21px) rotate(8deg) rotateY(-17deg) scale(.96)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 12,
    transformOrigin: '10% 32%',
    shadowIntensity: 0.24
  },
  {
    id: 'south-west',
    clipPath: 'polygon(10% 82%, 43% 69%, 37% 98%, 5% 91%)',
    initialTransform: 'translate3d(8px,-11px,16px) rotate(9deg) rotateX(18deg) scale(.94)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateX(0) scale(1)',
    zIndex: 6,
    transformOrigin: '72% 10%',
    shadowIntensity: 0.21
  },
  {
    id: 'south',
    clipPath: 'polygon(43% 69%, 66% 73%, 69% 98%, 37% 98%)',
    initialTransform: 'translate3d(-2px,-12px,23px) rotate(-7deg) rotateX(19deg) scale(.96)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateX(0) scale(1)',
    zIndex: 14,
    transformOrigin: '50% 8%',
    shadowIntensity: 0.27
  },
  {
    id: 'south-east',
    clipPath: 'polygon(66% 73%, 90% 84%, 96% 94%, 69% 98%)',
    initialTransform: 'translate3d(-10px,-10px,17px) rotate(-9deg) rotateX(17deg) scale(.94)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateX(0) scale(1)',
    zIndex: 8,
    transformOrigin: '20% 12%',
    shadowIntensity: 0.23
  },
  {
    id: 'left-chip',
    clipPath: 'polygon(0 39%, 20% 43%, 2% 61%)',
    initialTransform: 'translate3d(13px,-1px,13px) rotate(14deg) rotateY(24deg) scale(.92)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 5,
    transformOrigin: '100% 50%',
    shadowIntensity: 0.18
  },
  {
    id: 'right-chip',
    clipPath: 'polygon(80% 43%, 100% 38%, 98% 60%)',
    initialTransform: 'translate3d(-14px,2px,14px) rotate(-13deg) rotateY(-23deg) scale(.92)',
    finalTransform: 'translate3d(0,0,0) rotate(0) rotateY(0) scale(1)',
    zIndex: 5,
    transformOrigin: '0 50%',
    shadowIntensity: 0.18
  }
];

const CRUMPLE_SHARDS = [
  { left: '8%', top: '18%', width: '34%', height: '26%', rotate: '-18deg', clip: 'polygon(0 20%, 72% 0, 100% 64%, 42% 100%)' },
  { left: '30%', top: '4%', width: '29%', height: '35%', rotate: '11deg', clip: 'polygon(10% 0, 100% 16%, 74% 100%, 0 72%)' },
  { left: '56%', top: '8%', width: '34%', height: '32%', rotate: '19deg', clip: 'polygon(0 6%, 92% 0, 100% 82%, 28% 100%)' },
  { left: '70%', top: '29%', width: '28%', height: '35%', rotate: '-13deg', clip: 'polygon(18% 0, 100% 22%, 79% 100%, 0 76%)' },
  { left: '3%', top: '42%', width: '38%', height: '30%', rotate: '8deg', clip: 'polygon(0 15%, 73% 0, 100% 78%, 21% 100%)' },
  { left: '20%', top: '35%', width: '33%', height: '31%', rotate: '-7deg', clip: 'polygon(9% 0, 100% 17%, 81% 100%, 0 67%)' },
  { left: '45%', top: '31%', width: '36%', height: '34%', rotate: '16deg', clip: 'polygon(0 20%, 66% 0, 100% 71%, 26% 100%)' },
  { left: '62%', top: '53%', width: '34%', height: '31%', rotate: '7deg', clip: 'polygon(14% 0, 100% 12%, 78% 100%, 0 74%)' },
  { left: '7%', top: '65%', width: '32%', height: '25%', rotate: '-10deg', clip: 'polygon(0 8%, 87% 0, 100% 70%, 20% 100%)' },
  { left: '27%', top: '62%', width: '37%', height: '34%', rotate: '13deg', clip: 'polygon(6% 0, 100% 20%, 82% 100%, 0 69%)' },
  { left: '48%', top: '67%', width: '31%', height: '28%', rotate: '-17deg', clip: 'polygon(0 21%, 77% 0, 100% 84%, 19% 100%)' },
  { left: '38%', top: '17%', width: '29%', height: '29%', rotate: '-23deg', clip: 'polygon(19% 0, 100% 27%, 72% 100%, 0 66%)' }
] as const;

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

function CrumpleCreases() {
  return (
    <svg
      className={styles.crumpleCreases}
      viewBox="0 0 300 286"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className={styles.crumpleValleys}>
        <path d="M27 68 64 83l18 39-35 28 42 19-19 45" />
        <path d="m75 24 29 43-22 55 48 12-22 50 17 72" />
        <path d="m139 16-17 50 34 40-26 28 35 48-22 83" />
        <path d="m206 24-34 53 31 43-38 62 41 42-13 42" />
        <path d="m256 57-51 63 44 29-39 35 28 41" />
        <path d="M29 191 88 169l77 13 45 2 56-31" />
        <path d="M55 49 122 66l50 11 62-21M44 228l81-44 68 40 52 4" />
      </g>
      <g className={styles.crumpleRidges}>
        <path d="M30 65 67 80l19 39-34 28 40 18-17 46" />
        <path d="m78 22 30 43-21 53 47 13-21 51 17 72" />
        <path d="m142 14-16 50 34 40-25 29 35 47-21 84" />
        <path d="m210 22-34 54 31 42-37 63 40 40-12 43" />
        <path d="m259 55-50 63 44 28-38 36 27 40" />
        <path d="M31 188 89 166l78 13 44 2 57-31" />
      </g>
      <g className={styles.crumpleScuffs}>
        <path d="m93 44 17 9m93 21 14-8m-94 151 21 9m72-71 15 8M47 112l15-3" />
        <path d="m102 96 8 6m67-56 7 8m38 151 11-3m-164 28 12 2" />
      </g>
    </svg>
  );
}

function UnfoldingFormImpression() {
  return (
    <div className={styles.unfoldingFormImpression} data-unfold-content aria-hidden="true">
      <span className={styles.impressionHeading} />
      <span />
      <span />
      <span className={styles.impressionUpload} />
      <span className={styles.impressionTextarea} />
    </div>
  );
}

export function CrumpledPaper({ transitioning = false }: { transitioning?: boolean }) {
  return (
    <div
      className={`${styles.crumpledPaper} ${
        transitioning ? styles.crumpledTransitioning : ''
      }`}
      data-paper-ball
      aria-label="A crumpled sheet stamped RN"
      role="img"
    >
      <div className={styles.facetStage}>
        {PAPER_FACETS.map((facet, index) => (
          <span
            key={facet.id}
            className={styles.paperFacet}
            data-paper-facet={facet.id}
            style={
              {
                clipPath: facet.clipPath,
                zIndex: facet.zIndex,
                transformOrigin: facet.transformOrigin,
                '--facet-index': index,
                '--facet-shadow': facet.shadowIntensity,
                '--facet-initial-transform': facet.initialTransform,
                '--facet-final-transform': facet.finalTransform
              } as CSSProperties
            }
          />
        ))}
        <span className={styles.crumpleShards} aria-hidden="true">
          {CRUMPLE_SHARDS.map((shard, index) => (
            <i
              key={`${shard.left}-${shard.top}`}
              data-crumple-shard
              style={
                {
                  left: shard.left,
                  top: shard.top,
                  width: shard.width,
                  height: shard.height,
                  clipPath: shard.clip,
                  '--crumple-shard-rotate': shard.rotate,
                  '--crumple-shard-index': index
                } as CSSProperties
              }
            />
          ))}
        </span>
        <CreaseOverlay />
        <CrumpleCreases />
        {transitioning && <UnfoldingFormImpression />}
        <div className={styles.rnStamp} data-rn-stamp>
          <span>RN</span>
        </div>
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
