import { HandDrawnUnderline } from './FooterTypography';
import styles from './notebook-footer.module.css';

export function CoffeeSteam() {
  return (
    <g className={styles.coffeeSteam}>
      <path d="M99 56c-11-12 8-19-1-31-8-11 5-17 1-24" />
      <path d="M137 59c-15-15 10-24-1-39-8-11 4-17 0-20" />
      <path d="M172 57c-11-12 8-20-1-31-7-9 4-16 0-21" />
    </g>
  );
}

export function CoffeeCupIllustration() {
  return (
    <svg
      className={styles.coffeeDrawing}
      viewBox="0 0 300 270"
      role="img"
      aria-label="A hand-drawn coffee cup marked RN"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <CoffeeSteam />
        <path
          className={styles.coffeeSurface}
          d="M66 84c3-13 36-23 78-23 43 0 76 10 79 23-2 14-36 24-79 24-42 0-76-10-78-24Z"
        />
        <path
          d="M65 83c0-14 35-25 79-25s80 11 80 25-36 26-80 26-79-12-79-26Z"
          fill="none"
          strokeWidth="3.9"
        />
        <path
          d="M72 79c10-9 38-15 72-15 35 0 64 7 74 16M75 85c14 9 40 13 69 13 31 0 58-5 72-14"
          fill="none"
          strokeWidth="1.55"
        />
        <path
          className={styles.coffeeSurfaceHighlight}
          d="M83 79c18-7 40-9 64-8 21 0 39 3 55 8M93 86c20 4 67 5 96-2"
        />
        <path
          d="M65 84c2 57 10 98 28 119 16 19 83 22 102 0 17-21 26-64 29-120"
          fill="none"
          strokeWidth="4"
        />
        <path
          d="M72 91c1 45 9 88 27 106 17 17 72 19 91 0 16-18 24-63 27-106"
          fill="none"
          opacity=".62"
          strokeWidth="1.45"
        />
        <path
          d="M224 105c35-9 51 6 50 35-1 32-22 57-65 58M225 120c22-8 34 1 33 21-1 20-14 35-42 39"
          fill="none"
          strokeWidth="4"
        />
        <path
          d="M229 111c17-2 27 5 31 16M250 162c-6 15-17 23-34 27"
          fill="none"
          opacity=".5"
          strokeWidth="1.2"
        />
        <path
          d="M35 206c22-17 62-25 109-25 49 0 92 9 117 27 12 9 11 18-2 27-21 15-69 22-117 21-47 0-90-7-112-23-13-10-10-18 5-27Z"
          fill="none"
          strokeWidth="3.6"
        />
        <path
          d="M43 211c22 16 61 23 100 23 42 1 84-7 108-23M55 225c25 16 58 21 90 21 38 0 72-6 96-19M71 238c34 9 112 10 151-1"
          fill="none"
          opacity=".68"
          strokeWidth="1.35"
        />
        <path
          className={styles.coffeeHatching}
          d="M72 109l9-5m-8 12 9-6m-8 15 10-6m-8 16 9-5m-7 15 8-5m-6 17 8-5m-5 15 8-5m-5 15 9-5m101-62 10-5m-11 14 10-5m-12 15 11-5m-13 16 12-6m-14 17 12-6m-13 17 10-5m-13 17 10-5M91 197l14 8m-4-4 12 8m65-9-13 9m20-13-14 11M55 214l16 8m5 5 16 7m101-3 17-6m8-6 17-7"
        />
        <path
          className={styles.coffeeConstruction}
          d="M57 75h9m-4-5 1 11m166 7h12m-6-5 1 10M50 199l12 1m-7-5 1 10m211 6h11m-5-5v10M82 216c21 7 45 10 70 9m-55 6c18 5 39 7 60 6"
        />
      </g>
      <text
        x="143"
        y="166"
        textAnchor="middle"
        className={styles.coffeeMonogram}
      >
        RN
      </text>
      <g className={styles.coffeeGraphiteShadow} aria-hidden="true">
        <path d="M56 256c54 12 139 12 188-1" />
        <path d="M80 263c41 7 111 6 145-2" />
      </g>
    </svg>
  );
}

export const CoffeeIllustration = CoffeeCupIllustration;

export function CoffeeCard() {
  return (
    <section
      className={`${styles.column} ${styles.coffeeCard}`}
      data-testid="coffee-card"
    >
      <h3 className={styles.columnTitle}>Let’s meet over coffee</h3>
      <HandDrawnUnderline />
      <p className={styles.coffeeIntro}>(virtual or real) and talk ideas!</p>
      <div className={styles.coffeeComposition}>
        <CoffeeCupIllustration />
        <div className={styles.coffeeQuote}>
          Great ideas
          <br />
          start with a
          <br />
          conversation.
          <svg viewBox="0 0 128 18" aria-hidden="true">
            <path d="M4 8c30 1 58-3 94-2 11 0 20 1 26 0M77 14c15-2 28-1 39-4" />
          </svg>
        </div>
      </div>
      <svg className={styles.coffeeArrow} viewBox="0 0 48 46" aria-hidden="true">
        <path d="M4 38c16-1 29-10 35-29M27 14 39 9l2 13" />
      </svg>
    </section>
  );
}
