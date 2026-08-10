import html2canvas from 'html2canvas';
import { useEffect } from 'react';
import {
  clamp,
  drawPageCurl,
  easePageTurn,
  pageTurnDuration,
  type TurningCanvas
} from './pageTurnPhysics';

export const PAGE_TURN_DURATION = pageTurnDuration;
export const PAGE_LOAD_TIMEOUT = 4200;
export const PAGE_NOTE_SETTLE_DURATION = 720;
export const PAGE_NOTE_ARRIVAL_KEY = 'rough-note-page-note-arrival';

type PageTurnState =
  | 'idle'
  | 'preparing'
  | 'turning'
  | 'route-swap'
  | 'settling'
  | 'complete';

type CaptureCache = {
  canvas: HTMLCanvasElement;
  key: string;
};

type TurnStage = {
  canvas: HTMLCanvasElement;
  destination: HTMLIFrameElement;
  destinationReady: Promise<void>;
  element: HTMLDivElement;
  front: HTMLDivElement;
};

type ExperimentalNavigationDestination = {
  key: string | null;
  url: string;
};

type ExperimentalNavigateEvent = Event & {
  canIntercept: boolean;
  destination: ExperimentalNavigationDestination;
  navigationType: string;
};

type ExperimentalNavigation = EventTarget & {
  traverseTo: (key: string) => unknown;
};

const TRANSITION_CLASSES = ['rn-page-turn-locked', 'rn-page-turn-active'] as const;
const PAGE_NOTE_CLASSES = [
  'page-note--departing',
  'page-note--fall-next',
  'page-note--fall-previous',
  'page-note--arriving'
] as const;
const NAVIGATION_SELECTOR = [
  '.header a[href]',
  '.mobile-menu a[href]',
  '[data-page-turn][href]',
  '[data-notebook-turn][href]'
].join(',');
const MAX_CAPTURE_PIXELS = 3_200_000;

const isPlainPrimaryClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey;

const sanitizeDestination = (input: string | URL) => {
  const destination = new URL(input, window.location.href);
  // The old home-only query starts an unrelated intro animation. A page that
  // is already being revealed by the curl must arrive in its settled state.
  if (
    destination.pathname.endsWith('/index.html') &&
    destination.searchParams.get('animated') === 'true'
  ) {
    destination.searchParams.delete('animated');
  }
  return destination;
};

const routeIdentity = (url: URL) => {
  const normalized = new URL(url);
  normalized.hash = '';
  normalized.searchParams.delete('animated');
  return `${normalized.pathname}${normalized.search}`;
};

const isEligibleAnchor = (anchor: HTMLAnchorElement) => {
  if (
    anchor.target === '_blank' ||
    anchor.hasAttribute('download') ||
    anchor.dataset.pageTurn === 'false' ||
    anchor.getAttribute('rel')?.split(/\s+/).includes('external')
  ) {
    return false;
  }

  const rawHref = anchor.getAttribute('href');
  if (!rawHref || rawHref.startsWith('#')) return false;

  const destination = sanitizeDestination(anchor.href);
  if (destination.origin !== window.location.origin) return false;

  return (
    anchor.matches(NAVIGATION_SELECTOR) ||
    destination.pathname.endsWith('.html') ||
    destination.pathname.endsWith('/')
  );
};

const findNavigationAnchor = (event: Event) => {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  const anchor = target.closest<HTMLAnchorElement>('a[href]');
  return anchor && isEligibleAnchor(anchor) ? anchor : null;
};

const getNavigationDestinations = () => {
  const destinations = new Set<string>();
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    if (!isEligibleAnchor(anchor)) return;
    const destination = sanitizeDestination(anchor.href);
    if (routeIdentity(destination) !== routeIdentity(new URL(window.location.href))) {
      destination.hash = '';
      destinations.add(destination.href);
    }
  });
  return destinations;
};

const prefetchDocument = (href: string) => {
  if (document.head.querySelector(`link[data-rn-prefetch][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'document';
  link.href = href;
  link.dataset.rnPrefetch = 'true';
  document.head.append(link);
};

const removeDuplicateAccessibilityTree = (clone: HTMLElement) => {
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('inert', '');
  clone.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
    element.removeAttribute('id');
  });
  clone.querySelectorAll('video, audio').forEach((media) => {
    (media as HTMLMediaElement).pause();
  });
};

const getCaptureKey = (surface: HTMLElement) => {
  const rect = surface.getBoundingClientRect();
  return [
    Math.round(rect.width),
    window.innerHeight,
    Math.round(window.scrollX),
    Math.round(window.scrollY)
  ].join(':');
};

const captureVisibleSurface = async (surface: HTMLElement) => {
  if (document.fonts?.ready) await document.fonts.ready;
  const rect = surface.getBoundingClientRect();
  const cssPixels = Math.max(1, rect.width * window.innerHeight);
  const preferredScale = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
  const scale = Math.max(
    0.82,
    Math.min(preferredScale, Math.sqrt(MAX_CAPTURE_PIXELS / cssPixels))
  );

  return html2canvas(surface, {
    backgroundColor: '#f7f0df',
    height: window.innerHeight,
    imageTimeout: 1800,
    logging: false,
    removeContainer: true,
    scale,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    useCORS: true,
    width: rect.width,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    x: 0,
    y: window.scrollY
  });
};

const waitForDestinationDocument = async (frame: HTMLIFrameElement) => {
  try {
    const frameDocument = frame.contentDocument;
    if (!frameDocument) return;
    if (frameDocument.fonts?.ready) {
      await Promise.race([
        frameDocument.fonts.ready,
        new Promise<void>((resolve) => window.setTimeout(resolve, 450))
      ]);
    }
    const images = Array.from(frameDocument.images).filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.top < frame.contentWindow!.innerHeight && rect.bottom > 0;
    });
    await Promise.race([
      Promise.all(images.map((image) => image.decode().catch(() => undefined))),
      new Promise<void>((resolve) => window.setTimeout(resolve, 450))
    ]);
    frame.contentWindow?.scrollTo({ left: 0, top: 0, behavior: 'auto' });
  } catch {
    // A same-origin document is expected. If browser privacy settings make the
    // iframe opaque, its load event still guarantees a paintable destination.
  }
};

const createTurnStage = (
  destinationUrl: string,
  surface: HTMLElement,
  signal: AbortSignal
): TurnStage => {
  const rect = surface.getBoundingClientRect();
  const element = document.createElement('div');
  const destination = document.createElement('iframe');
  const canvas = document.createElement('canvas');
  const front = document.createElement('div');
  const clone = surface.cloneNode(true) as HTMLElement;

  element.className = 'rn-page-turn';
  element.setAttribute('aria-hidden', 'true');
  element.style.setProperty('--rn-page-left', `${Math.max(0, rect.left)}px`);
  element.style.setProperty('--rn-page-width', `${rect.width}px`);

  destination.className = 'rn-page-turn__destination';
  destination.tabIndex = -1;
  destination.title = 'Loading destination page';
  destination.setAttribute('aria-hidden', 'true');
  Object.assign(destination.style, {
    height: `${window.innerHeight}px`,
    left: `${-Math.max(0, rect.left)}px`,
    width: `${window.innerWidth}px`
  });

  canvas.className = 'rn-page-turn__canvas';
  canvas.setAttribute('aria-hidden', 'true');

  front.className = 'rn-page-turn__front';
  front.setAttribute('aria-hidden', 'true');
  front.setAttribute('inert', '');

  clone.classList.add('rn-page-turn__clone');
  removeDuplicateAccessibilityTree(clone);
  Object.assign(clone.style, {
    height: `${Math.max(surface.scrollHeight, window.innerHeight)}px`,
    minHeight: '0',
    top: `${rect.top}px`,
    width: `${rect.width}px`
  });

  front.append(clone);
  element.append(destination, canvas, front);

  const destinationReady = new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error('Destination page did not become ready in time.')),
      PAGE_LOAD_TIMEOUT
    );
    const abort = () => {
      window.clearTimeout(timeout);
      reject(new DOMException('Navigation cancelled.', 'AbortError'));
    };
    signal.addEventListener('abort', abort, { once: true });
    destination.addEventListener(
      'load',
      () => {
        window.clearTimeout(timeout);
        signal.removeEventListener('abort', abort);
        void waitForDestinationDocument(destination).then(resolve);
      },
      { once: true }
    );
  });

  destination.src = destinationUrl;
  document.body.append(element);
  return { canvas, destination, destinationReady, element, front };
};

const moveWithinPage = (destination: URL) => {
  window.history.pushState({}, '', `${destination.pathname}${destination.search}${destination.hash}`);
  if (!destination.hash) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
  target?.scrollIntoView({ block: 'start', behavior: 'auto' });
  if (target instanceof HTMLElement) {
    if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
};

/**
 * One controller for the site's cross-document navigation. The fixed sidebar
 * and mobile controls stay outside the animated surface; only the paper page
 * uses the Product Showcase's canvas curl.
 */
export function PageTurnProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set<number>();
    let state: PageTurnState = 'idle';
    let disposed = false;
    let committing = false;
    let requestId = 0;
    let animationFrame = 0;
    let activeDestination: URL | null = null;
    let activeCommit: (() => void) | null = null;
    let activeStage: TurnStage | null = null;
    let activeAbort: AbortController | null = null;
    let cachedCapture: CaptureCache | null = null;
    let captureInFlight: Promise<HTMLCanvasElement> | null = null;
    let captureInFlightKey = '';
    let warmIdleCallback = 0;

    const surface = document.querySelector<HTMLElement>('.rn-page-surface');
    if (!surface) return;

    const setState = (nextState: PageTurnState) => {
      state = nextState;
      root.dataset.pageTurnState = nextState;
    };

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const getPageNote = () => document.querySelector<HTMLElement>('[data-page-note]');

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
      schedule(() => pageNote.classList.remove('page-note--arriving'), PAGE_NOTE_SETTLE_DURATION);
    };

    const beginPageNoteDeparture = () => {
      const pageNote = getPageNote();
      if (!pageNote) return;
      pageNote.classList.remove(...PAGE_NOTE_CLASSES);
      pageNote.classList.add('page-note--departing', 'page-note--fall-next');
    };

    const lockNavigation = () => {
      root.classList.add(...TRANSITION_CLASSES);
      root.setAttribute('aria-busy', 'true');
      surface.setAttribute('aria-busy', 'true');
    };

    const unlockNavigation = () => {
      root.classList.remove(...TRANSITION_CLASSES, 'rn-page-turn-reduced');
      root.removeAttribute('aria-busy');
      surface.removeAttribute('aria-busy');
    };

    const removeStage = () => {
      activeStage?.element.remove();
      activeStage = null;
    };

    const resetController = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      activeAbort?.abort();
      activeAbort = null;
      removeStage();
      activeDestination = null;
      activeCommit = null;
      unlockNavigation();
      if (!disposed) setState('idle');
    };

    const invalidateCapture = () => {
      cachedCapture = null;
    };

    const getCapture = async () => {
      const key = getCaptureKey(surface);
      if (cachedCapture?.key === key) return cachedCapture.canvas;
      if (captureInFlight && captureInFlightKey === key) return captureInFlight;

      captureInFlightKey = key;
      captureInFlight = captureVisibleSurface(surface);
      try {
        const canvas = await captureInFlight;
        if (!disposed && getCaptureKey(surface) === key && state !== 'turning') {
          cachedCapture = { canvas, key };
        }
        return canvas;
      } finally {
        if (captureInFlightKey === key) {
          captureInFlight = null;
          captureInFlightKey = '';
        }
      }
    };

    const warmCapture = () => {
      if (state !== 'idle' || disposed) return;
      void getCapture().catch(() => undefined);
    };

    const scheduleWarmCapture = () => {
      if (warmIdleCallback) return;
      const requestIdle = window.requestIdleCallback;
      if (requestIdle) {
        warmIdleCallback = requestIdle(
          () => {
            warmIdleCallback = 0;
            warmCapture();
          },
          { timeout: 1400 }
        );
      } else {
        warmIdleCallback = schedule(() => {
          warmIdleCallback = 0;
          warmCapture();
        }, 900);
      }
    };

    const recordArrival = (destination: URL) => {
      window.sessionStorage.setItem(
        PAGE_NOTE_ARRIVAL_KEY,
        JSON.stringify({ route: routeIdentity(destination), timestamp: Date.now() })
      );
    };

    const commitNavigation = () => {
      if (disposed || committing || !activeDestination || !activeCommit) return;
      committing = true;
      setState('route-swap');
      recordArrival(activeDestination);
      activeCommit();
    };

    const animateStage = (stage: TurnStage, capture: HTMLCanvasElement, id: number) => {
      stage.canvas.width = capture.width;
      stage.canvas.height = capture.height;
      const turningCanvas = {
        element: stage.canvas,
        front: stage.front,
        source: capture
      } satisfies TurningCanvas;
      drawPageCurl(turningCanvas, 0, 'next');
      stage.element.classList.add('rn-page-turn--ready');
      setState('turning');
      const startTime = performance.now();

      const step = (timestamp: number) => {
        if (disposed || id !== requestId || state !== 'turning') return;
        const elapsed = clamp((timestamp - startTime) / pageTurnDuration, 0, 1);
        drawPageCurl(turningCanvas, easePageTurn(elapsed), 'next');
        if (elapsed < 1) {
          animationFrame = window.requestAnimationFrame(step);
          return;
        }
        setState('settling');
        commitNavigation();
      };

      animationFrame = window.requestAnimationFrame(step);
    };

    const beginReducedMotionNavigation = (destination: URL, commit: () => void) => {
      activeDestination = destination;
      activeCommit = commit;
      setState('preparing');
      lockNavigation();
      root.classList.add('rn-page-turn-reduced');
      beginPageNoteDeparture();
      schedule(commitNavigation, 140);
    };

    const beginCrossPageTurn = async (destination: URL, commit: () => void) => {
      if (state !== 'idle') return;
      if (reducedMotion.matches) {
        beginReducedMotionNavigation(destination, commit);
        return;
      }

      const id = ++requestId;
      const abort = new AbortController();
      activeAbort = abort;
      activeDestination = destination;
      activeCommit = commit;
      setState('preparing');
      lockNavigation();
      beginPageNoteDeparture();
      activeStage = createTurnStage(destination.href, surface, abort.signal);

      try {
        const [capture] = await Promise.all([getCapture(), activeStage.destinationReady]);
        if (disposed || id !== requestId || abort.signal.aborted || !activeStage) return;
        cachedCapture = null;
        animateStage(activeStage, capture, id);
      } catch {
        if (disposed || id !== requestId || abort.signal.aborted) return;
        // A blank lower sheet is worse than no effect. Slow or blocked routes
        // fall back to native navigation and can never strand the controller.
        commitNavigation();
      }
    };

    const onNavigationClick = (event: MouseEvent) => {
      if (!isPlainPrimaryClick(event) || event.defaultPrevented) return;
      const anchor = findNavigationAnchor(event);
      if (!anchor) return;

      const destination = sanitizeDestination(anchor.href);
      const current = sanitizeDestination(window.location.href);
      const sameRoute = routeIdentity(destination) === routeIdentity(current);
      const sameLocation = sameRoute && destination.hash === current.hash;

      if (sameLocation) {
        event.preventDefault();
        return;
      }

      if (state !== 'idle') {
        event.preventDefault();
        return;
      }

      if (sameRoute) {
        event.preventDefault();
        moveWithinPage(destination);
        beginPageNoteArrival();
        return;
      }

      event.preventDefault();
      void beginCrossPageTurn(destination, () => window.location.assign(destination.href));
    };

    const onNavigationIntent = (event: Event) => {
      const anchor = findNavigationAnchor(event);
      if (!anchor) return;
      const destination = sanitizeDestination(anchor.href);
      if (routeIdentity(destination) === routeIdentity(new URL(window.location.href))) return;
      prefetchDocument(destination.href);
      scheduleWarmCapture();
    };

    const navigationApi = (window as Window & { navigation?: ExperimentalNavigation }).navigation;
    let traversalCommitAllowed = false;
    const onBrowserTraversal = (nativeEvent: Event) => {
      const event = nativeEvent as ExperimentalNavigateEvent;
      if (
        disposed ||
        committing ||
        traversalCommitAllowed ||
        event.navigationType !== 'traverse' ||
        !event.canIntercept ||
        !event.destination.key ||
        state !== 'idle'
      ) {
        traversalCommitAllowed = false;
        return;
      }

      const destination = sanitizeDestination(event.destination.url);
      if (destination.origin !== window.location.origin) return;

      try {
        event.preventDefault();
      } catch {
        return;
      }

      const destinationKey = event.destination.key;
      void beginCrossPageTurn(destination, () => {
        traversalCommitAllowed = true;
        navigationApi?.traverseTo(destinationKey);
      });
    };

    const onResize = () => {
      invalidateCapture();
      if (state !== 'idle') commitNavigation();
    };

    const onScroll = () => invalidateCapture();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && state !== 'idle') commitNavigation();
    };

    const restoreArrivalFocus = () => {
      const rawArrival = window.sessionStorage.getItem(PAGE_NOTE_ARRIVAL_KEY);
      if (!rawArrival) return;
      window.sessionStorage.removeItem(PAGE_NOTE_ARRIVAL_KEY);
      try {
        const arrival = JSON.parse(rawArrival) as { route?: string; timestamp?: number };
        if (
          arrival.route !== routeIdentity(new URL(window.location.href)) ||
          !arrival.timestamp ||
          Date.now() - arrival.timestamp > 15_000
        ) {
          return;
        }
      } catch {
        return;
      }

      setState('settling');
      beginPageNoteArrival();
      schedule(() => {
        const main = surface.querySelector<HTMLElement>('main');
        if (main) {
          const hadTabIndex = main.hasAttribute('tabindex');
          if (!hadTabIndex) main.tabIndex = -1;
          main.focus({ preventScroll: true });
          if (!hadTabIndex) main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
        }
        setState('complete');
        schedule(() => setState('idle'), 80);
      }, 90);
    };

    root.classList.remove(...TRANSITION_CLASSES, 'rn-page-turn-reduced');
    root.removeAttribute('aria-busy');
    setState('idle');
    restoreArrivalFocus();
    getNavigationDestinations().forEach(prefetchDocument);
    scheduleWarmCapture();

    document.addEventListener('click', onNavigationClick, true);
    document.addEventListener('focusin', onNavigationIntent, true);
    document.addEventListener('pointerover', onNavigationIntent, true);
    document.addEventListener('touchstart', onNavigationIntent, { capture: true, passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    navigationApi?.addEventListener('navigate', onBrowserTraversal);

    return () => {
      disposed = true;
      requestId += 1;
      document.removeEventListener('click', onNavigationClick, true);
      document.removeEventListener('focusin', onNavigationIntent, true);
      document.removeEventListener('pointerover', onNavigationIntent, true);
      document.removeEventListener('touchstart', onNavigationIntent, true);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      navigationApi?.removeEventListener('navigate', onBrowserTraversal);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      if (warmIdleCallback && window.cancelIdleCallback) {
        window.cancelIdleCallback(warmIdleCallback);
      }
      resetController();
      clearPageNoteMotion();
      delete root.dataset.pageTurnState;
    };
  }, []);

  return null;
}

// Kept as a compatibility export for older entry points while SiteLayout uses
// the provider name that reflects its controller role.
export const PageTurnTransition = PageTurnProvider;
