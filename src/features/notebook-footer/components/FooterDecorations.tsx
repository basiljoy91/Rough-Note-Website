import styles from './notebook-footer.module.css';

interface PencilDecorationProps {
  inviting: boolean;
}

export function PencilDecoration({ inviting }: PencilDecorationProps) {
  return (
    <svg
      className={`${styles.woodPencil} ${inviting ? styles.woodPencilInviting : ''}`}
      data-testid="footer-pencil"
      viewBox="0 0 260 62"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="footer-pencil-lacquer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a252" />
          <stop offset=".18" stopColor="#f0ca86" />
          <stop offset=".48" stopColor="#bf7e31" />
          <stop offset=".7" stopColor="#e5b66e" />
          <stop offset="1" stopColor="#9b5e21" />
        </linearGradient>
        <linearGradient id="footer-pencil-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0d1a0" />
          <stop offset=".48" stopColor="#c49357" />
          <stop offset="1" stopColor="#efd0a0" />
        </linearGradient>
      </defs>
      <path d="M-9 8 205 8l40 21-41 24-213 2V8Z" fill="url(#footer-pencil-lacquer)" stroke="#77491f" strokeWidth="1.4" />
      <path d="m205 8 51 20-52 25c4-14 4-30 1-45Z" fill="url(#footer-pencil-wood)" stroke="#79512c" strokeWidth="1.15" />
      <path d="m244 24 12 4-12 6c1-3 1-7 0-10Z" fill="#201f1d" />
      <path d="M-5 16c60-3 135-2 205-1M-3 47c72-2 139-2 204-1" stroke="#fff3cf" strokeWidth="1.1" opacity=".36" />
      <path d="M18 12c39 7 85 2 125 5M33 49c48-5 99 0 158-5M208 16c9 8 10 20 3 31M218 18c7 8 8 17 3 25M228 22c4 5 5 11 2 16" stroke="#855222" strokeWidth=".8" opacity=".52" />
    </svg>
  );
}

export const FooterPencil = PencilDecoration;

export function BinderClip() {
  return (
    <svg className={styles.binderClip} viewBox="0 0 125 128" aria-hidden="true">
      <defs>
        <linearGradient id="footer-clip-black" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#090908" />
          <stop offset=".47" stopColor="#242422" />
          <stop offset=".7" stopColor="#080807" />
          <stop offset="1" stopColor="#30302e" />
        </linearGradient>
        <linearGradient id="footer-clip-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4d4d49" />
          <stop offset=".32" stopColor="#ecebe4" />
          <stop offset=".58" stopColor="#7c7c77" />
          <stop offset=".83" stopColor="#e2e1da" />
          <stop offset="1" stopColor="#3f3f3c" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 68 97 49l22 62-84 16L17 68Z" fill="url(#footer-clip-black)" stroke="#050505" strokeWidth="3" />
        <path d="M25 66 99 51M36 120l75-13M27 73l82-17" stroke="#5b5b57" strokeWidth="2.2" opacity=".72" />
        <path d="M28 71C3 60-2 30 9 13 19-3 44 5 52 30l7 29M99 54c5-23-5-45-20-49-15-3-27 9-27 29 0 9 4 19 9 27" stroke="#363633" strokeWidth="6.4" />
        <path d="M28 71C3 60-2 30 9 13 19-3 44 5 52 30l7 29M99 54c5-23-5-45-20-49-15-3-27 9-27 29 0 9 4 19 9 27" stroke="url(#footer-clip-metal)" strokeWidth="3.2" />
        <path d="M39 118 34 127M109 107l8 5" stroke="#050505" strokeWidth="4" />
      </g>
    </svg>
  );
}

export const FooterBinderClip = BinderClip;

export function PaperClip() {
  return (
    <svg className={styles.paperClip} viewBox="0 0 86 156" aria-hidden="true">
      <defs>
        <linearGradient id="footer-paperclip-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#434441" />
          <stop offset=".22" stopColor="#d9dad5" />
          <stop offset=".5" stopColor="#747572" />
          <stop offset=".76" stopColor="#f0f0eb" />
          <stop offset="1" stopColor="#494a47" />
        </linearGradient>
      </defs>
      <path
        d="M60 14C47 1 28 5 20 23L4 90c-6 26 28 41 42 18l22-54c8-20-18-31-28-12L23 91c-4 12 12 18 18 6l14-36"
        fill="none"
        stroke="#2e2f2d"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M60 14C47 1 28 5 20 23L4 90c-6 26 28 41 42 18l22-54c8-20-18-31-28-12L23 91c-4 12 12 18 18 6l14-36"
        fill="none"
        stroke="url(#footer-paperclip-metal)"
        strokeWidth="6.4"
        strokeLinecap="round"
      />
      <path
        d="M56 14C45 7 31 11 25 26L9 91c-3 13 8 23 19 22"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
        opacity=".58"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const FooterPaperClip = PaperClip;

export function CoffeeRing() {
  return (
    <svg className={styles.coffeeRing} viewBox="0 0 250 145" aria-hidden="true">
      <path className={styles.coffeeRingMain} d="M19 145C25 67 67 11 126 8c60-3 103 55 109 137" />
      <path className={styles.coffeeRingInner} d="M35 145C40 77 72 27 126 24c50-2 87 48 92 121" />
      <path className={styles.coffeeRingBroken} d="M17 132c8-11 17-14 26-7M219 121c8-4 15-1 20 8M51 60c9-15 20-25 35-32M170 31c13 8 23 20 32 35" />
      <g className={styles.coffeeSpatter}>
        <circle cx="224" cy="47" r="4" />
        <circle cx="239" cy="62" r="2.4" />
        <circle cx="213" cy="69" r="1.8" />
        <circle cx="231" cy="83" r="1.2" />
        <path d="m207 49 6-5 4 6-6 6Z" />
      </g>
    </svg>
  );
}

export function FooterDoodles() {
  return (
    <>
      <svg className={styles.orangeStar} viewBox="0 0 75 78" aria-hidden="true">
        <path d="m37 3 7 25 25-8-19 19 18 18-25-8-6 25-7-25-25 8 18-19L6 20l24 8 7-25Z" />
        <path d="M38 7 28 35 8 23l24 20-13 24 21-19 23 13-16-21 17-16-22 10-4-27Z" opacity=".55" />
      </svg>

      <svg className={styles.paperAirplane} viewBox="0 0 190 165" aria-hidden="true">
        <path d="M44 48 164 9 94 100 72 65 44 48Z" />
        <path d="m72 65 92-56-70 91M74 66l4 39 16-5" />
        <path d="M50 89C14 108 25 138 4 154" strokeDasharray="2 12" />
      </svg>

      <svg className={styles.ideaBulb} viewBox="0 0 125 155" aria-hidden="true">
        <path d="M62 29c-24 0-39 18-37 43 2 17 13 24 19 34l3 14 33-5 1-13c5-11 16-21 14-39-2-22-14-34-33-34Z" />
        <path d="m47 120 34-5M49 128l30-5M54 136l22-4M55 139c7 5 15 3 20-4" />
        <path d="M45 76c5-8 10-7 14 2 4-13 10-13 14-1 4-9 8-10 13-4M59 79l3 34M73 78l-2 36" />
        <path d="M62 9V0M28 18l-8-10M96 18l8-11M111 47l12-4M14 52 2 48" />
      </svg>

      <svg className={styles.rightCurve} viewBox="0 0 90 180" aria-hidden="true">
        <path d="M15 165c54-6 38-52 25-58 34-9 36-55 3-74" />
        <path d="m35 42 8-9 11 7" />
      </svg>

      <svg className={styles.bottomScribble} viewBox="0 0 125 48" aria-hidden="true">
        <path d="M2 17c20-5 42-10 53-1 11 9-13 18 4 23 17 6 37-3 62-4" />
      </svg>

      <span className={styles.inkDotOne} aria-hidden="true" />
      <span className={styles.inkDotTwo} aria-hidden="true" />
      <span className={styles.inkDotThree} aria-hidden="true" />
    </>
  );
}

interface FooterDecorationsProps {
  pencilInviting: boolean;
}

export function FooterDecorations({
  pencilInviting
}: FooterDecorationsProps) {
  return (
    <div className={styles.decorations} aria-hidden="true">
      <FooterDoodles />
      <BinderClip />
      <PencilDecoration inviting={pencilInviting} />
      <PaperClip />
      <CoffeeRing />
    </div>
  );
}
