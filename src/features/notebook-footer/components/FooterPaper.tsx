import { useState } from 'react';
import { CoffeeCard } from './CoffeeIllustration';
import { FooterDecorations } from './FooterDecorations';
import { FooterNavigation } from './FooterNavigation';
import { FooterDivider, FooterHeading } from './FooterTypography';
import { NewsletterCard } from './NewsletterCard';
import { PaperBackground } from './PaperBackground';
import { StickyNote } from './StickyNote';
import styles from './notebook-footer.module.css';

export function FooterPaper() {
  const [pencilInviting, setPencilInviting] = useState(false);

  return (
    <div className={styles.footerScene}>
      <PaperBackground>
        <FooterHeading />

        <div className={styles.upperArea}>
          <NewsletterCard onFocusChange={setPencilInviting} />
          <FooterDivider className={styles.dividerOne} />
          <CoffeeCard />
          <FooterDivider className={styles.dividerTwo} />
          <StickyNote />
        </div>

        <FooterNavigation />
        <FooterDecorations pencilInviting={pencilInviting} />
      </PaperBackground>
    </div>
  );
}
