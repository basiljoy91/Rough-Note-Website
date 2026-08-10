import { useEffect } from 'react';

export const PAGE_TURN_DURATION = 880;
export const PAGE_LOAD_TIMEOUT = 6000;
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

interface TurnStage {
  destination: HTMLIFrameElement;
  element: HTMLDivElement;
  sheet: HTMLDivElement;
}

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

function getNavigationDestinations() {
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

  return urls;
}

function prefetchNavigationPages() {
  getNavigationDestinations().forEach((href) => {
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

function removeDuplicateAccessibilityTree(clone: HTMLElement) {
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('inert', '');
  clone.querySelectorAll('video, audio').forEach((media) => {
    (media as HTMLMediaElement).pause();
  });
}

/**
 * Builds a viewport-sized stage without rasterising the page. The destination
 * document is a real, fully loaded same-origin page underneath a DOM clone of
 * the current paper, so the turn begins immediately and never exposes a blank
 * interstitial sheet.
 */
function createTurnStage(destinationUrl: string): TurnStage | null {
  const source = document.querySelector<HTMLElement>('.rn-page-surface');
  if (!source) return null;

  const rect = source.getBoundingClientRect();
  const left = Math.max(0, Math.min(window.innerWidth - 1, rect.left));
  const width = Math.max(1, Math.min(rect.width, window.innerWidth - left));

  const element = document.createElement('div');
  element.className = 'rn-page-turn';
  element.setAttribute('aria-hidden', 'true');
  element.style.setProperty('--rn-page-left', `${left}px`);
  element.style.setProperty('--rn-page-width', `${width}px`);

  const destination = document.createElement('iframe');
  destination.className = 'rn-page-turn__destination';
  destination.src = destinationUrl;
  destination.tabIndex = -1;
  destination.title = 'Loading next page';
  destination.setAttribute('aria-hidden', 'true');

  const sheet = document.createElement('div');
  sheet.className = 'rn-page-turn__sheet';

  const clone = source.cloneNode(true) as HTMLElement;
  clone.classList.add('rn-page-turn__clone');
  clone.style.setProperty('--rn-clone-top', `${rect.top}px`);
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.minHeight = `${rect.height}px`;
  removeDuplicateAccessibilityTree(clone);

  const edge = document.createElement('span');
  edge.className = 'rn-page-turn__edge';
  edge.setAttribute('aria-hidden', 'true');

  sheet.append(clone, edge);
  element.append(destination, sheet);
  document.body.append(element);

  return { destination, element, sheet };
}

/**
 * Runs a deterministic cross-document page turn. It intentionally avoids the
 * browser-only cross-document View Transition API so the effect works in the
 * hosted browser, local preview, and in-app browser alike.
 */
export function PageTurnTransition() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set<number>();
    let navigationLocked = false;
    let disposed = false;
    let activeStage: TurnStage | null = null;

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

    const removeStage = () => {
      activeStage?.element.remove();
      activeStage = null;
    };

    const clearTransition = () => {
      removeStage();
      root.classList.remove(...TRANSITION_CLASSES);
      root.removeAttribute('aria-busy');
      navigationLocked = false;
    };

    const finishCrossPageNavigation = (destination: URL) => {
      if (disposed) return;
      window.sessionStorage.setItem(PAGE_NOTE_ARRIVAL_KEY, 'enter');
      window.location.assign(destination.href);
    };

    const beginCrossPageTurn = (destination: URL) => {
      activeStage = createTurnStage(destination.href);
      if (!activeStage) {
        finishCrossPageNavigation(destination);
        return;
      }

      let turnStarted = false;
      const beginTurn = () => {
        if (turnStarted || disposed || !activeStage) return;
        turnStarted = true;
        activeStage.element.classList.add('rn-page-turn--ready');

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            if (disposed || !activeStage) return;
            activeStage.element.classList.add('rn-page-turn--turning');
            schedule(
              () => finishCrossPageNavigation(destination),
              PAGE_TURN_DURATION
            );
          });
        });
      };

      activeStage.destination.addEventListener('load', beginTurn, { once: true });
      schedule(() => {
        if (turnStarted || disposed) return;
        clearTransition();
        finishCrossPageNavigation(destination);
      }, PAGE_LOAD_TIMEOUT);
    };

    root.classList.remove(...TRANSITION_CLASSES);
    root.removeAttribute('aria-busy');

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
        else finishCrossPageNavigation(destination);
        return;
      }

      lockNavigation();

      if (sameDocument) {
        moveWithinPage(destination);
        clearTransition();
        beginPageNoteArrival();
        return;
      }

      beginCrossPageTurn(destination);
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
