import styles from './notebook-footer.module.css';

function FooterSeparator() {
  return (
    <svg className={styles.footerSeparator} viewBox="0 0 15 15" aria-hidden="true">
      <path d="M8 2.5c3.2.2 5 2 4.7 5.1-.2 3-2 4.8-5 4.7-3.1-.2-4.8-2-4.6-5.2C3.3 4.2 5 2.4 8 2.5Z" />
      <path d="M7.1 3.6c2.5-.3 4.4 1.6 4.4 4.1" opacity=".42" />
    </svg>
  );
}

export function FooterCopyright() {
  const currentYear = new Date().getFullYear();

  return (
    <p className={styles.copyright} data-testid="footer-copyright">
      © {currentYear} Rough Note. All rights reserved.
      <svg viewBox="0 0 110 18" aria-hidden="true">
        <path d="M3 7c25 1 50-2 101 0M31 11c18-2 37-1 49 3-9 1-16 2-23 4" />
      </svg>
    </p>
  );
}

export function FooterNavigation() {
  return (
    <div className={styles.lowerArea}>
      <svg
        className={styles.pencilDivider}
        viewBox="0 0 1400 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        data-drawing-toolbar-boundary
      >
        <path d="M3 6c172 2 353-2 526 0 203 3 397-2 590 0 100 1 190-1 278 0" />
        <path d="M4 8c190 1 370-1 550 0 201 1 394-1 586 0 91 1 177 0 257 1" opacity=".28" />
      </svg>
      <nav className={styles.footerNavigation} aria-label="Footer navigation">
        <a href="/html/careers.html">Careers</a>
        <FooterSeparator />
        <a href="/html/terms.html">Terms &amp; Conditions</a>
        <FooterSeparator />
        <a href="/html/privacy.html">Privacy Policy</a>
      </nav>
      <FooterCopyright />
    </div>
  );
}
