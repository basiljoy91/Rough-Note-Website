import coffeeRn from '../../../assets/illustrations/coffee-rn.svg';
import { HandDrawnUnderline } from './FooterTypography';
import styles from './notebook-footer.module.css';

export function CoffeeCupIllustration() {
  return (
    <img
      className={styles.coffeeDrawing}
      src={coffeeRn}
      alt="A hand-drawn coffee cup marked RN"
    />
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
