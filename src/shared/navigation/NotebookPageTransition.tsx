import html2canvas from 'html2canvas';
import { useEffect } from 'react';
import {
  clamp,
  drawPageCurl,
  easePageTurn,
  pageTurnDuration,
  type TurningCanvas
} from '../../features/workbook-carousel/useWorkbookCarousel';
import './notebook-page-transition.global.css';

type NotebookPageTransitionProps = {
  pageSelector: string;
};

const isPlainLeftClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey;

export function NotebookPageTransition({ pageSelector }: NotebookPageTransitionProps) {
  useEffect(() => {
    let cachedCapture: HTMLCanvasElement | null = null;
    let captureRequest = 0;
    let navigating = false;
    let animationFrame = 0;
    let safetyTimer = 0;

    const page = document.querySelector<HTMLElement>(pageSelector);
    if (!page) return;

    const capturePage = async () => {
      await document.fonts.ready;
      return html2canvas(page, {
        backgroundColor: null,
        logging: false,
        scale: Math.min(1.5, Math.max(1, window.devicePixelRatio || 1)),
        useCORS: true
      });
    };

    const warmCapture = async () => {
      const requestId = ++captureRequest;
      try {
        const capture = await capturePage();
        if (!navigating && requestId === captureRequest) cachedCapture = capture;
      } catch {
        // A click retries if an image or font was still settling.
      }
    };

    const navigate = async (destination: URL) => {
      if (navigating) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        window.location.assign(destination.href);
        return;
      }

      navigating = true;
      document.documentElement.classList.add('notebook-page-is-turning');
      page.setAttribute('aria-busy', 'true');

      try {
        const source = cachedCapture ?? (await capturePage());
        const rect = page.getBoundingClientRect();
        const stage = document.createElement('div');
        const destinationFrame = document.createElement('iframe');
        const canvas = document.createElement('canvas');
        const front = page.cloneNode(true) as HTMLElement;

        stage.className = 'notebook-page-turn-stage';
        Object.assign(stage.style, {
          height: `${rect.height}px`,
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`
        });

        destinationFrame.className = 'notebook-page-turn-destination';
        destinationFrame.setAttribute('aria-hidden', 'true');
        destinationFrame.tabIndex = -1;
        destinationFrame.src = destination.href;
        Object.assign(destinationFrame.style, {
          height: `${window.innerHeight}px`,
          left: `${-rect.left}px`,
          top: `${-rect.top}px`,
          width: `${window.innerWidth}px`
        });

        front.classList.add('notebook-page-turn-front');
        front.setAttribute('aria-hidden', 'true');
        front.setAttribute('inert', '');
        front.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
          element.removeAttribute('id');
        });
        Object.assign(front.style, {
          height: `${rect.height}px`,
          margin: '0',
          minHeight: '0',
          width: `${rect.width}px`
        });

        canvas.className = 'notebook-page-turn-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.width = source.width;
        canvas.height = source.height;

        stage.append(destinationFrame, canvas, front);
        document.body.append(stage);

        const turningCanvas = { element: canvas, front, source } satisfies TurningCanvas;
        drawPageCurl(turningCanvas, 0, 'next');

        await new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          destinationFrame.addEventListener('load', finish, { once: true });
          // The next local page normally loads before this; the short ceiling
          // keeps the sheet moving immediately even on a cold first visit.
          window.setTimeout(finish, 220);
        });

        const startTime = performance.now();
        const step = (timestamp: number) => {
          const elapsed = clamp((timestamp - startTime) / pageTurnDuration, 0, 1);
          drawPageCurl(turningCanvas, easePageTurn(elapsed), 'next');

          if (elapsed < 1) {
            animationFrame = window.requestAnimationFrame(step);
            return;
          }

          window.location.assign(destination.href);
        };

        animationFrame = window.requestAnimationFrame(step);
        safetyTimer = window.setTimeout(
          () => window.location.assign(destination.href),
          pageTurnDuration + 1500
        );
      } catch {
        window.location.assign(destination.href);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!isPlainLeftClick(event)) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest<HTMLElement>('[data-notebook-turn]');
      if (!trigger) return;

      const rawHref =
        trigger instanceof HTMLAnchorElement
          ? trigger.href
          : trigger.dataset.notebookHref;
      if (!rawHref) return;

      const destination = new URL(rawHref, window.location.href);
      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      void navigate(destination);
    };

    document.addEventListener('click', onClick, true);
    const warmTimer = window.setTimeout(() => void warmCapture(), 180);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.clearTimeout(warmTimer);
      window.clearTimeout(safetyTimer);
      window.cancelAnimationFrame(animationFrame);
      document.documentElement.classList.remove('notebook-page-is-turning');
    };
  }, [pageSelector]);

  return null;
}
