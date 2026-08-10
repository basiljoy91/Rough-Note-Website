import { useEffect } from 'react';

export const PAGE_TURN_DURATION = 760;
export const PAGE_NOTE_SETTLE_DURATION = 720;
export const PAGE_NOTE_ARRIVAL_KEY = 'rough-note-page-note-arrival';

const TRANSITION_CLASSES = [
  'rn-page-turn-locked',
  'rn-page-turn-active'
] as const;

const PAGE_NOTE_CLASSES = [
  'page-note--departing',
  'page-note--fall-next',
  'page-note--fall-previous',
  'page-note--arriving'
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

function prefetchNavigationPages() {
  const current = new URL(window.location.href);
  const urls = new Set<string>();

  document
    .querySelectorAll<HTMLAnchorElement>(
      '.header a[href], .mobile-menu a[href], .menu-toggle a[href]'
    )
    .forEach((anchor) => {
      const destination = new URL(anchor.href, current);
      if (
        destination.origin !== current.origin ||
        (destination.pathname === current.pathname &&
          destination.search === current.search)
      ) {
        return;
      }

      destination.hash = '';
      urls.add(destination.href);
    });

  urls.forEach((href) => {
    if (document.head.querySelector(`link[data-rn-prefetch][href="${href}"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = href;
    link.dataset.rnPrefetch = 'true';
    document.head.append(link);
  });
}

/**
 * Coordinates native same-origin View Transitions for notebook navigation.
 * The browser supplies the real destination page as the lower layer, avoiding
 * the expensive html2canvas capture and white-paper interstitial used before.
 */
export function PageTurnTransition() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set<number>();
    let navigationLocked = false;
    let disposed = false;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const getPageNote = () =>
      document.querySelector<HTMLElement>('[data-page-note]');

    const clearPageNoteMotion = () => {
      getPageNote()?.classList.remove(...PAGE_NOTE_CLASSES);
    };

    const beginPageNoteArrival = () => {
      const pageNote = getPageNote();
      if (!pageNote) return;

      pageNote.classList.remove(
        'page-note--departing',
        'page-note--fall-next',
        'page-note--fall-previous'
      );
      pageNote.classList.add('page-note--arriving');
      schedule(() => {
        pageNote.classList.remove('page-note--arriving');
      }, PAGE_NOTE_SETTLE_DURATION);
    };

    const beginPageNoteDeparture = () => {
      const pageNote = getPageNote();
      if (!pageNote) return;

      pageNote.classList.remove(...PAGE_NOTE_CLASSES);
      pageNote.classList.add('page-note--departing', 'page-note--fall-next');
    };

    const lockNavigation = () => {
      navigationLocked = true;
      root.classList.add(...TRANSITION_CLASSES);
      root.setAttribute('aria-busy', 'true');
    };

    const clearTransition = () => {
      root.classList.remove(...TRANSITION_CLASSES);
      root.removeAttribute('aria-busy');
      navigationLocked = false;
    };

    if (window.sessionStorage.getItem(PAGE_NOTE_ARRIVAL_KEY) === 'enter') {
      window.sessionStorage.removeItem(PAGE_NOTE_ARRIVAL_KEY);
      beginPageNoteArrival();
    }

    prefetchNavigationPages();

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

      beginPageNoteDeparture();

      if (reducedMotion.matches) {
        if (sameDocument) moveWithinPage(destination);
        else window.location.assign(destination.href);
        return;
      }

      lockNavigation();

      if (!sameDocument) {
        window.sessionStorage.setItem(PAGE_NOTE_ARRIVAL_KEY, 'enter');
        window.requestAnimationFrame(() => {
          if (!disposed) window.location.assign(destination.href);
        });
        return;
      }

      const startViewTransition =
        document.startViewTransition?.bind(document);

      if (!startViewTransition) {
        moveWithinPage(destination);
        clearTransition();
        beginPageNoteArrival();
        return;
      }

      const transition = startViewTransition(() => moveWithinPage(destination));
      void transition.finished.finally(() => {
        if (disposed) return;
        clearTransition();
        beginPageNoteArrival();
      });
    };

    document.addEventListener('click', onNavigationClick);
    return () => {
      disposed = true;
      document.removeEventListener('click', onNavigationClick);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      clearTransition();
      clearPageNoteMotion();
    };
  }, []);

  return null;
}
