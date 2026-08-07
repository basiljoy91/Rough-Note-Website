import { useEffect } from 'react';

const FALLBACK_DURATION = 760;
const FALLBACK_STORAGE_KEY = 'rough-note-page-tear';

function isPlainPrimaryClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}

function findNavigationAnchor(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return null;

  const anchor = target.closest<HTMLAnchorElement>(
    '.header a[href], .mobile-menu a[href], .menu-toggle a[href]'
  );

  if (
    !anchor ||
    anchor.target === '_blank' ||
    anchor.hasAttribute('download') ||
    anchor.getAttribute('rel')?.split(/\s+/).includes('external')
  ) {
    return null;
  }

  return anchor;
}

function moveWithinPage(url: URL) {
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);

  if (!url.hash) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  target?.scrollIntoView({ block: 'start', behavior: 'auto' });
}

export function PageTearTransition() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsViewTransitions =
      typeof document.startViewTransition === 'function';

    if (window.sessionStorage.getItem(FALLBACK_STORAGE_KEY) === 'enter') {
      window.sessionStorage.removeItem(FALLBACK_STORAGE_KEY);
      root.classList.add('rn-page-tear-fallback-enter');
      window.setTimeout(() => {
        root.classList.remove('rn-page-tear-fallback-enter');
      }, FALLBACK_DURATION);
    }

    const onNavigationClick = (event: MouseEvent) => {
      if (!isPlainPrimaryClick(event) || event.defaultPrevented) return;

      const anchor = findNavigationAnchor(event);
      if (!anchor) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const sameDocument =
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;

      if (sameDocument) {
        if (destination.hash === window.location.hash) return;
        event.preventDefault();

        if (reducedMotion.matches || !supportsViewTransitions) {
          moveWithinPage(destination);
          return;
        }

        root.classList.add('rn-page-tear-in-progress');
        const transition = document.startViewTransition(() => {
          moveWithinPage(destination);
        });
        void transition.finished.finally(() => {
          root.classList.remove('rn-page-tear-in-progress');
        });
        return;
      }

      if (reducedMotion.matches || supportsViewTransitions) {
        return;
      }

      event.preventDefault();
      root.classList.add('rn-page-tear-fallback-exit');
      window.sessionStorage.setItem(FALLBACK_STORAGE_KEY, 'enter');
      window.setTimeout(() => {
        window.location.assign(destination.href);
      }, FALLBACK_DURATION - 80);
    };

    document.addEventListener('click', onNavigationClick);
    return () => document.removeEventListener('click', onNavigationClick);
  }, []);

  return (
    <div className="rn-page-tear-fallback" aria-hidden="true">
      <span className="rn-page-tear-fallback__paper rn-page-tear-fallback__paper--left" />
      <span className="rn-page-tear-fallback__paper rn-page-tear-fallback__paper--right" />
      <span className="rn-page-tear-fallback__fibres" />
    </div>
  );
}
