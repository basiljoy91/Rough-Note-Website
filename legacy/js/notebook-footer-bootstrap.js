const FOOTER_ROOT_ID = 'rough-note-footer-root';
const FOOTER_BUNDLE_VERSION = '2026.07.29.14';

async function loadNotebookFooter() {
  const host = document.getElementById(FOOTER_ROOT_ID);
  if (!host || host.dataset.footerMounted === 'true') return;
  host.dataset.footerMounted = 'true';

  const stylesheetUrl = new URL(
    './notebook-footer-dist/notebook-footer.css',
    import.meta.url
  );
  stylesheetUrl.searchParams.set('v', FOOTER_BUNDLE_VERSION);
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = stylesheetUrl.href;
  stylesheet.dataset.notebookFooterStyles = '';
  document.head.append(stylesheet);

  const moduleUrl = new URL(
    './notebook-footer-dist/notebook-footer.js',
    import.meta.url
  );
  moduleUrl.searchParams.set('v', FOOTER_BUNDLE_VERSION);
  const module = await import(/* @vite-ignore */ moduleUrl.href);
  module.mountNotebookFooter();
}

export function bootstrapNotebookFooter() {
  const host = document.getElementById(FOOTER_ROOT_ID);
  if (!host) return;

  const startLoading = () => {
    void loadNotebookFooter().catch((error) => {
      const currentHost = document.getElementById(FOOTER_ROOT_ID);
      if (currentHost) delete currentHost.dataset.footerMounted;
      console.error('The notebook footer could not be loaded.', error);
    });
  };

  if (!('IntersectionObserver' in window)) {
    startLoading();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      startLoading();
    },
    { rootMargin: '1000px 0px' }
  );
  observer.observe(host);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapNotebookFooter, {
    once: true
  });
} else {
  bootstrapNotebookFooter();
}
