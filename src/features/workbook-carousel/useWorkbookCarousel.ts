import html2canvas from 'html2canvas';
import { useEffect, type RefObject } from 'react';
import {
  clamp,
  drawPageCurl,
  easePageTurn,
  pageTurnDuration,
  type TurnDirection,
  type TurningCanvas
} from '../../shared/navigation/pageTurnPhysics';

const pages = ['web', 'brand', 'poster', 'logo', 'motion', 'video', 'erp'];

export function useWorkbookCarousel(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const section = root?.querySelector<HTMLElement>('.workbook');
    if (!section) return;

    const intros = Array.from(
      section.querySelectorAll<HTMLElement>('.workbook__intro-item')
    );
    const artwork = Array.from(
      section.querySelectorAll<HTMLElement>('.workbook__art')
    );
    const stickies = Array.from(
      section.querySelectorAll<HTMLElement>('.workbook__sticky-item')
    );
    const dots = Array.from(
      section.querySelectorAll<HTMLButtonElement>('.workbook__dots button')
    );
    const sheet = section.querySelector<HTMLElement>('.workbook__sheet');
    const dotGroup = section.querySelector<HTMLElement>('.workbook__dots');
    const pageCount = section.querySelector<HTMLElement>(
      '.workbook__page-count'
    );
    const previous = section.querySelector<HTMLButtonElement>(
      '.workbook__arrow--prev'
    );
    const next = section.querySelector<HTMLButtonElement>(
      '.workbook__arrow--next'
    );
    if (!sheet || !dotGroup || !previous || !next) return;

    let current = 0;
    let transitionTimer = 0;
    let initialTimer = 0;
    let animationFrame = 0;
    let turningCanvas: TurningCanvas | null = null;
    let isTurning = false;
    let disposed = false;
    let turnRequest = 0;
    let cachedCapture: { index: number; source: HTMLCanvasElement } | null =
      null;
    let captureRequest = 0;

    const renderPage = (index: number) => {
      intros.forEach((item, itemIndex) =>
        item.classList.toggle('is-visible', itemIndex === index)
      );
      artwork.forEach((item, itemIndex) =>
        item.classList.toggle('is-visible', itemIndex === index)
      );
      stickies.forEach((item, itemIndex) =>
        item.classList.toggle('is-visible', itemIndex === index)
      );
      dots.forEach((dot, itemIndex) =>
        dot.classList.toggle('is-active', itemIndex === index)
      );
      dotGroup.setAttribute(
        'aria-label',
        `Work page ${index + 1} of ${pages.length}`
      );
      if (pageCount) pageCount.textContent = `Page 0${index + 1}`;

      const video = section.querySelector<HTMLVideoElement>('#vp-video');
      if (video && pages[index] !== 'video') video.pause();

      [intros[index], artwork[index]].forEach((item) =>
        item?.classList.add('visible')
      );
    };

    const setControlsDisabled = (disabled: boolean) => {
      previous.disabled = disabled;
      next.disabled = disabled;
      dots.forEach((dot) => {
        dot.disabled = disabled;
      });
    };

    const capturePage = async () => {
      const sheetRect = sheet.getBoundingClientRect();
      const pixelRatio = Math.min(
        1.5,
        Math.max(1, window.devicePixelRatio || 1)
      );

      return await html2canvas(sheet, {
        backgroundColor: null,
        height: sheetRect.height,
        logging: false,
        removeContainer: true,
        scale: pixelRatio,
        useCORS: true,
        width: sheetRect.width
      });
    };

    const warmCapture = async (index: number) => {
      const requestId = ++captureRequest;
      await document.fonts.ready;
      if (disposed || index !== current) return;

      try {
        const source = await capturePage();
        if (
          !disposed &&
          requestId === captureRequest &&
          index === current &&
          !isTurning
        ) {
          cachedCapture = { index, source };
        }
      } catch {
        // A click can retry the capture if an asset was still loading here.
      }
    };

    const finishTurn = () => {
      window.clearTimeout(transitionTimer);
      window.cancelAnimationFrame(animationFrame);
      turningCanvas?.element.remove();
      turningCanvas?.front.remove();
      turningCanvas = null;
      animationFrame = 0;
      isTurning = false;
      section.classList.remove('workbook--turning');
      section.removeAttribute('aria-busy');
      setControlsDisabled(false);
      window.setTimeout(() => void warmCapture(current), 120);
    };

    const buildTurningCanvas = (source: HTMLCanvasElement) => {
      const sectionRect = section.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const front = sheet.cloneNode(true) as HTMLElement;

      canvas.className = 'workbook__turn-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.width = source.width;
      canvas.height = source.height;
      Object.assign(canvas.style, {
        height: `${sheetRect.height}px`,
        left: `${sheetRect.left - sectionRect.left}px`,
        top: `${sheetRect.top - sectionRect.top}px`,
        width: `${sheetRect.width}px`
      });
      front.classList.add('workbook__turn-front');
      front.setAttribute('aria-hidden', 'true');
      front.setAttribute('inert', '');
      front.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
        element.removeAttribute('id');
      });
      Object.assign(front.style, {
        height: `${sheetRect.height}px`,
        left: `${sheetRect.left - sectionRect.left}px`,
        margin: '0',
        minHeight: '0',
        top: `${sheetRect.top - sectionRect.top}px`,
        width: `${sheetRect.width}px`
      });
      section.append(canvas);
      section.append(front);

      return { element: canvas, front, source } satisfies TurningCanvas;
    };

    const animateTurningCanvas = (
      canvas: TurningCanvas,
      direction: TurnDirection,
      requestId: number
    ) => {
      const startTime = performance.now();

      const step = (timestamp: number) => {
        if (disposed || requestId !== turnRequest) return;
        const elapsed = clamp(
          (timestamp - startTime) / pageTurnDuration,
          0,
          1
        );
        drawPageCurl(canvas, easePageTurn(elapsed), direction);

        if (elapsed < 1) {
          animationFrame = window.requestAnimationFrame(step);
          return;
        }
        finishTurn();
      };

      animationFrame = window.requestAnimationFrame(step);
    };

    const show = async (requested: number, direction: TurnDirection) => {
      if (isTurning) return;

      const requestedPage = (requested + pages.length) % pages.length;
      if (requestedPage === current) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (reduceMotion) {
        current = requestedPage;
        renderPage(current);
        return;
      }

      const requestId = ++turnRequest;
      isTurning = true;
      setControlsDisabled(true);
      delete section.dataset.pageTurnError;

      try {
        const source =
          cachedCapture?.index === current
            ? cachedCapture.source
            : await capturePage();
        cachedCapture = null;
        captureRequest += 1;
        if (disposed || requestId !== turnRequest) return;

        const canvas = buildTurningCanvas(source);
        turningCanvas = canvas;
        drawPageCurl(canvas, 0, direction);
        section.classList.add('workbook--turning');
        section.setAttribute('aria-busy', 'true');

        animationFrame = window.requestAnimationFrame(() => {
          if (disposed || requestId !== turnRequest) return;
          current = requestedPage;
          renderPage(current);
          animateTurningCanvas(canvas, direction, requestId);
          transitionTimer = window.setTimeout(
            finishTurn,
            pageTurnDuration + 350
          );
        });
      } catch (error) {
        section.dataset.pageTurnError =
          error instanceof Error
            ? `${error.name}: ${error.message}`
            : String(error);
        if (!disposed && requestId === turnRequest) {
          current = requestedPage;
          renderPage(current);
          finishTurn();
        }
      }
    };

    const showPrevious = () => void show(current - 1, 'previous');
    const showNext = () => void show(current + 1, 'next');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrevious();
    };
    const dotHandlers = dots.map((dot, index) => {
      const handler = () =>
        void show(index, index < current ? 'previous' : 'next');
      dot.addEventListener('click', handler);
      return { dot, handler };
    });

    previous.addEventListener('click', showPrevious);
    next.addEventListener('click', showNext);
    section.addEventListener('keydown', onKeyDown);
    artwork[0]?.classList.add('is-visible');
    intros[0]?.classList.add('is-visible');
    stickies[0]?.classList.add('is-visible');
    section.classList.add('workbook--image-page');
    initialTimer = window.setTimeout(() => {
      intros.forEach((item) => item.classList.add('visible'));
      artwork.forEach((item) => item.classList.add('visible'));
      section
        .querySelectorAll<HTMLElement>('.reveal-on-scroll')
        .forEach((item) => item.classList.add('visible'));
      // Let the opening reveal finish so the cached frame is fully opaque.
      window.setTimeout(() => void warmCapture(current), 950);
    }, 100);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) return;
        section.querySelector<HTMLVideoElement>('#vp-video')?.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    return () => {
      disposed = true;
      turnRequest += 1;
      captureRequest += 1;
      window.clearTimeout(initialTimer);
      finishTurn();
      observer.disconnect();
      previous.removeEventListener('click', showPrevious);
      next.removeEventListener('click', showNext);
      section.removeEventListener('keydown', onKeyDown);
      dotHandlers.forEach(({ dot, handler }) =>
        dot.removeEventListener('click', handler)
      );
    };
  }, [rootRef]);
}
