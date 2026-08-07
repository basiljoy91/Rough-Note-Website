import { useEffect } from 'react';

export const PAGE_TEAR_EXIT_DURATION = 520;
export const PAGE_TEAR_ENTER_DURATION = 620;
export const PAGE_TEAR_STORAGE_KEY = 'rough-note-page-tear';

const TRANSITION_CLASSES = [
  'rn-page-tear-locked',
  'rn-page-tear-fallback-exit',
  'rn-page-tear-fallback-enter'
] as const;

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
    const timers = new Set<number>();
    let navigationLocked = false;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const clearTransition = () => {
      root.classList.remove(...TRANSITION_CLASSES);
      root.removeAttribute('aria-busy');
      navigationLocked = false;
    };

    const beginEnter = () => {
      root.classList.remove('rn-page-tear-fallback-exit');
      root.classList.add('rn-page-tear-locked', 'rn-page-tear-fallback-enter');
      root.setAttribute('aria-busy', 'true');
      schedule(clearTransition, PAGE_TEAR_ENTER_DURATION);
    };

    if (window.sessionStorage.getItem(PAGE_TEAR_STORAGE_KEY) === 'enter') {
      window.sessionStorage.removeItem(PAGE_TEAR_STORAGE_KEY);
      navigationLocked = true;
      beginEnter();
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

      if (sameDocument && destination.hash === window.location.hash) return;

      event.preventDefault();
      if (navigationLocked) return;

      if (reducedMotion.matches) {
        if (sameDocument) {
          moveWithinPage(destination);
        } else {
          window.location.assign(destination.href);
        }
        return;
      }

      navigationLocked = true;
      root.classList.remove('rn-page-tear-fallback-enter');
      root.classList.add('rn-page-tear-locked', 'rn-page-tear-fallback-exit');
      root.setAttribute('aria-busy', 'true');

      if (sameDocument) {
        schedule(() => {
          moveWithinPage(destination);
          beginEnter();
        }, PAGE_TEAR_EXIT_DURATION);
        return;
      }

      window.sessionStorage.setItem(PAGE_TEAR_STORAGE_KEY, 'enter');
      schedule(() => {
        window.location.assign(destination.href);
      }, PAGE_TEAR_EXIT_DURATION);
    };

    document.addEventListener('click', onNavigationClick);
    return () => {
      document.removeEventListener('click', onNavigationClick);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      clearTransition();
    };
  }, []);

  return (
    <div className="rn-page-tear-fallback" aria-hidden="true">
      <span className="rn-page-tear-fallback__paper rn-page-tear-fallback__paper--left" />
      <span className="rn-page-tear-fallback__paper rn-page-tear-fallback__paper--right" />
      <span className="rn-page-tear-fallback__fibres" />
    </div>
  );
}
