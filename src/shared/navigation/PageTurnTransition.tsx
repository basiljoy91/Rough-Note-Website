import html2canvas from 'html2canvas';
import { useEffect, useRef } from 'react';
import {
  clamp,
  drawPageCurl,
  easePageTurn,
  pageTurnDuration,
  type TurnDirection,
  type TurningCanvas
} from '../../features/workbook-carousel/useWorkbookCarousel';

export const PAGE_TURN_DURATION = pageTurnDuration;

const TRANSITION_CLASSES = [
  'rn-page-turn-locked',
  'rn-page-turn-capturing',
  'rn-page-turn-active'
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

function navigationPosition(url: URL) {
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (
    url.hash === '#div-3' &&
    (pathname === '/' || pathname.endsWith('/index.html'))
  ) {
    return 2;
  }
  if (pathname === '/' || pathname.endsWith('/index.html')) return 0;
  if (pathname.endsWith('/services.html')) return 1;
  if (pathname.endsWith('/process.html')) return 3;
  if (pathname.endsWith('/connect.html')) return 4;
  if (pathname.endsWith('/contact.html')) return 5;
  if (pathname.endsWith('/projects.html')) return 6;
  return null;
}

function getTurnDirection(destination: URL): TurnDirection {
  const currentPosition = navigationPosition(new URL(window.location.href));
  const destinationPosition = navigationPosition(destination);

  if (
    currentPosition !== null &&
    destinationPosition !== null &&
    destinationPosition < currentPosition
  ) {
    return 'previous';
  }

  return 'next';
}

function getContentBounds() {
  const header = document.querySelector<HTMLElement>('.header');
  const headerRect = header?.getBoundingClientRect();
  const headerVisible =
    header &&
    headerRect &&
    getComputedStyle(header).display !== 'none' &&
    headerRect.width > 0;
  const left = headerVisible
    ? clamp(headerRect.right, 0, window.innerWidth - 1)
    : 0;

  return {
    height: Math.max(1, window.innerHeight),
    left,
    width: Math.max(1, window.innerWidth - left)
  };
}

function createPaperFallback(width: number, height: number) {
  const pixelRatio = Math.min(1.35, Math.max(1, window.devicePixelRatio || 1));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#f7f0df';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

export function PageTurnTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    const stage = overlay?.querySelector<HTMLElement>('.rn-page-turn__stage');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set<number>();
    let animationFrame = 0;
    let navigationLocked = false;
    let disposed = false;
    let turningCanvas: TurningCanvas | null = null;

    if (!overlay || !stage) return;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const removeTurningCanvas = () => {
      turningCanvas?.element.remove();
      turningCanvas?.front.remove();
      turningCanvas = null;
    };

    const clearTransition = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      removeTurningCanvas();
      root.classList.remove(...TRANSITION_CLASSES);
      root.removeAttribute('aria-busy');
      stage.removeAttribute('style');
      navigationLocked = false;
    };

    const captureViewport = async (left: number, width: number, height: number) => {
      const pixelRatio = Math.min(
        1.35,
        Math.max(1, window.devicePixelRatio || 1)
      );

      return await html2canvas(document.documentElement, {
        backgroundColor: null,
        height,
        ignoreElements: (element) =>
          element === overlay ||
          element.classList.contains('header') ||
          element.classList.contains('mobile-menu') ||
          element.classList.contains('menu-toggle') ||
          element.classList.contains('menu-backdrop'),
        logging: false,
        removeContainer: true,
        scale: pixelRatio,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        useCORS: true,
        width,
        windowHeight: height,
        windowWidth: window.innerWidth,
        x: window.scrollX + left,
        y: window.scrollY
      });
    };

    const buildTurningCanvas = (
      source: HTMLCanvasElement,
      left: number,
      width: number,
      height: number
    ) => {
      const canvas = document.createElement('canvas');
      const front = document.createElement('canvas');
      canvas.className = 'rn-page-turn__curl';
      front.className = 'rn-page-turn__front';
      canvas.setAttribute('aria-hidden', 'true');
      front.setAttribute('aria-hidden', 'true');
      canvas.width = source.width;
      canvas.height = source.height;
      front.width = source.width;
      front.height = source.height;
      front.getContext('2d')?.drawImage(source, 0, 0);

      Object.assign(stage.style, {
        height: `${height}px`,
        left: `${left}px`,
        width: `${width}px`
      });
      stage.append(front, canvas);

      return { element: canvas, front, source } satisfies TurningCanvas;
    };

    const finishNavigation = (destination: URL, sameDocument: boolean) => {
      if (disposed) return;

      if (sameDocument) {
        moveWithinPage(destination);
        clearTransition();
        return;
      }

      window.location.assign(destination.href);
    };

    const animatePageTurn = (
      canvas: TurningCanvas,
      direction: TurnDirection,
      destination: URL,
      sameDocument: boolean
    ) => {
      const startTime = performance.now();

      const step = (timestamp: number) => {
        if (disposed || !navigationLocked) return;
        const elapsed = clamp(
          (timestamp - startTime) / PAGE_TURN_DURATION,
          0,
          1
        );
        drawPageCurl(canvas, easePageTurn(elapsed), direction);

        if (elapsed < 1) {
          animationFrame = window.requestAnimationFrame(step);
          return;
        }

        finishNavigation(destination, sameDocument);
      };

      animationFrame = window.requestAnimationFrame(step);
    };

    const beginTurn = async (
      destination: URL,
      sameDocument: boolean,
      direction: TurnDirection
    ) => {
      const bounds = getContentBounds();
      let source: HTMLCanvasElement;

      try {
        source = await captureViewport(bounds.left, bounds.width, bounds.height);
      } catch {
        source = createPaperFallback(bounds.width, bounds.height);
      }

      if (disposed || !navigationLocked) return;

      turningCanvas = buildTurningCanvas(
        source,
        bounds.left,
        bounds.width,
        bounds.height
      );
      drawPageCurl(turningCanvas, 0, direction);
      root.classList.remove('rn-page-turn-capturing');
      root.classList.add('rn-page-turn-active');
      animatePageTurn(turningCanvas, direction, destination, sameDocument);
    };

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
      root.classList.add('rn-page-turn-locked', 'rn-page-turn-capturing');
      root.setAttribute('aria-busy', 'true');
      schedule(
        () =>
          void beginTurn(
            destination,
            sameDocument,
            getTurnDirection(destination)
          ),
        0
      );
    };

    document.addEventListener('click', onNavigationClick);
    return () => {
      disposed = true;
      document.removeEventListener('click', onNavigationClick);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      clearTransition();
    };
  }, []);

  return (
    <div ref={overlayRef} className="rn-page-turn" aria-hidden="true">
      <div className="rn-page-turn__stage">
        <span className="rn-page-turn__underlay" />
        <span className="rn-page-turn__binding">
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} />
          ))}
        </span>
      </div>
    </div>
  );
}
