import { toCanvas } from 'html-to-image';
import { useEffect, type RefObject } from 'react';

const pages = ['web', 'brand', 'poster', 'logo', 'motion', 'video', 'erp'];
const pageTurnDuration = 1480;
const curlWidth = 0.26;

type TurnDirection = 'next' | 'previous';

type TurningCanvas = {
  element: HTMLCanvasElement;
  source: HTMLCanvasElement;
};

type CurlPoint = {
  angle: number;
  depth: number;
  x: number;
};

type CurlColumn = {
  angle: number;
  depth: number;
  destinationLeft: number;
  destinationWidth: number;
  normalizedCenter: number;
  sourceLeft: number;
  sourceWidth: number;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const easePageTurn = (progress: number) =>
  progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

const getCurlPoint = (
  position: number,
  progress: number,
  direction: TurnDirection
): CurlPoint => {
  const radius = curlWidth / Math.PI;
  const mirroredPosition = direction === 'next' ? position : 1 - position;
  const foldFront = 1 - progress * (1 + curlWidth);
  const distance = mirroredPosition - foldFront;
  let angle = 0;
  let mappedPosition = mirroredPosition;

  if (distance > 0 && distance < curlWidth) {
    angle = distance / radius;
    mappedPosition = foldFront + radius * Math.sin(angle);
  } else if (distance >= curlWidth) {
    angle = Math.PI;
    mappedPosition = foldFront - (distance - curlWidth);
  }

  return {
    angle,
    depth: radius * (1 - Math.cos(angle)),
    x: direction === 'next' ? mappedPosition : 1 - mappedPosition
  };
};

const drawPageCurl = (
  turningCanvas: TurningCanvas,
  progress: number,
  direction: TurnDirection
) => {
  const { element, source } = turningCanvas;
  const context = element.getContext('2d');
  if (!context) return;

  const width = element.width;
  const height = element.height;
  const normalizedProgress = clamp(progress, 0, 1);
  context.clearRect(0, 0, width, height);

  if (normalizedProgress <= 0.0001) {
    context.drawImage(source, 0, 0, width, height);
    return;
  }

  if (normalizedProgress >= 0.9999) return;

  const foldFront = 1 - normalizedProgress * (1 + curlWidth);
  const foldPosition =
    (direction === 'next' ? foldFront : 1 - foldFront) * width;
  const turnStrength = Math.sin(normalizedProgress * Math.PI);
  const shadowWidth = width * (0.075 + turnStrength * 0.085);
  const shadow = context.createLinearGradient(
    foldPosition - shadowWidth,
    0,
    foldPosition + shadowWidth,
    0
  );

  shadow.addColorStop(0, 'rgba(49, 31, 17, 0)');
  shadow.addColorStop(0.43, `rgba(49, 31, 17, ${0.08 * turnStrength})`);
  shadow.addColorStop(0.56, `rgba(49, 31, 17, ${0.31 * turnStrength})`);
  shadow.addColorStop(1, 'rgba(49, 31, 17, 0)');
  context.fillStyle = shadow;
  context.fillRect(0, 0, width, height);

  const sourceStep = Math.max(2, Math.ceil(width / 620));
  const columns: CurlColumn[] = [];

  for (let sourceLeft = 0; sourceLeft < width; sourceLeft += sourceStep) {
    const sourceWidth = Math.min(sourceStep, width - sourceLeft);
    const sourceRight = sourceLeft + sourceWidth;
    const normalizedCenter = (sourceLeft + sourceWidth / 2) / width;
    const leftPoint = getCurlPoint(
      sourceLeft / width,
      normalizedProgress,
      direction
    );
    const rightPoint = getCurlPoint(
      sourceRight / width,
      normalizedProgress,
      direction
    );
    const centerPoint = getCurlPoint(
      normalizedCenter,
      normalizedProgress,
      direction
    );
    const destinationStart = leftPoint.x * width;
    const destinationEnd = rightPoint.x * width;

    columns.push({
      angle: centerPoint.angle,
      depth: centerPoint.depth,
      destinationLeft: Math.min(destinationStart, destinationEnd) - 0.8,
      destinationWidth: Math.max(
        1.25,
        Math.abs(destinationEnd - destinationStart) + 1.6
      ),
      normalizedCenter,
      sourceLeft,
      sourceWidth
    });
  }

  columns.sort((left, right) => left.depth - right.depth);

  columns.forEach((column) => {
    if (
      column.destinationLeft > width + 3 ||
      column.destinationLeft + column.destinationWidth < -3
    ) {
      return;
    }

    const fold = Math.sin(column.angle);
    const isReverseSide = column.angle > Math.PI / 2;
    const verticalScale = 1 - fold * 0.025;
    const destinationHeight = height * verticalScale;
    const paperRipple =
      fold *
      Math.sin(
        (column.normalizedCenter * 1.8 + normalizedProgress * 0.65) *
          Math.PI
      ) *
      Math.max(0.75, height * 0.0015);
    const destinationTop = (height - destinationHeight) / 2 + paperRipple;

    context.drawImage(
      source,
      column.sourceLeft,
      0,
      column.sourceWidth,
      height,
      column.destinationLeft,
      destinationTop,
      column.destinationWidth,
      destinationHeight
    );

    if (isReverseSide) {
      const reverseAmount = clamp(
        (column.angle - Math.PI / 2) / (Math.PI / 2),
        0,
        1
      );
      context.fillStyle = `rgba(247, 240, 223, ${0.7 + reverseAmount * 0.18})`;
      context.fillRect(
        column.destinationLeft,
        destinationTop,
        column.destinationWidth,
        destinationHeight
      );
    }

    const foldShade = fold * (isReverseSide ? 0.2 : 0.3);
    if (foldShade > 0.002) {
      context.fillStyle = `rgba(64, 42, 23, ${foldShade})`;
      context.fillRect(
        column.destinationLeft,
        destinationTop,
        column.destinationWidth,
        destinationHeight
      );
    }

    const highlight = Math.max(0, Math.sin(column.angle * 2)) * 0.18;
    if (highlight > 0.002) {
      context.fillStyle = `rgba(255, 254, 243, ${highlight})`;
      context.fillRect(
        column.destinationLeft,
        destinationTop,
        column.destinationWidth,
        destinationHeight
      );
    }
  });

  const freeEdgePosition = direction === 'next' ? 1 : 0;
  const freeEdge = getCurlPoint(
    freeEdgePosition,
    normalizedProgress,
    direction
  );
  const freeEdgeX = freeEdge.x * width;

  if (freeEdgeX > -3 && freeEdgeX < width + 3) {
    const edgeGradient = context.createLinearGradient(
      freeEdgeX - 4,
      0,
      freeEdgeX + 4,
      0
    );
    edgeGradient.addColorStop(0, 'rgba(47, 31, 17, 0)');
    edgeGradient.addColorStop(0.47, 'rgba(47, 31, 17, 0.32)');
    edgeGradient.addColorStop(0.58, 'rgba(255, 255, 245, 0.72)');
    edgeGradient.addColorStop(1, 'rgba(255, 255, 245, 0)');
    context.fillStyle = edgeGradient;
    context.fillRect(freeEdgeX - 4, 0, 8, height);
  }
};

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

    const prepareCaptureClone = () => {
      const sectionRect = section.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const host = document.createElement('div');
      const clone = sheet.cloneNode(true) as HTMLElement;

      host.className = section.className;
      host.setAttribute('aria-hidden', 'true');
      Object.assign(host.style, {
        height: `${sectionRect.height}px`,
        left: '-20000px',
        minHeight: '0',
        pointerEvents: 'none',
        position: 'fixed',
        top: '0',
        width: `${sectionRect.width}px`,
        zIndex: '-1'
      });
      clone.setAttribute('inert', '');
      clone
        .querySelectorAll<HTMLElement>(
          '.workbook__intro-item:not(.is-visible), .workbook__art:not(.is-visible), .workbook__sticky-item:not(.is-visible)'
        )
        .forEach((element) => element.remove());
      clone.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
        element.removeAttribute('id');
      });
      clone.querySelectorAll('video').forEach((video) => video.remove());
      Object.assign(clone.style, {
        height: `${sheetRect.height}px`,
        left: `${sheetRect.left - sectionRect.left}px`,
        margin: '0',
        minHeight: '0',
        position: 'absolute',
        top: `${sheetRect.top - sectionRect.top}px`,
        width: `${sheetRect.width}px`
      });
      host.append(clone);
      document.body.append(host);
      return { clone, host, sheetRect };
    };

    const capturePage = async () => {
      const { clone, host, sheetRect } = prepareCaptureClone();
      const pixelRatio = Math.min(
        1.5,
        Math.max(1, window.devicePixelRatio || 1)
      );

      try {
        return await toCanvas(clone, {
          cacheBust: false,
          canvasHeight: Math.round(sheetRect.height * pixelRatio),
          canvasWidth: Math.round(sheetRect.width * pixelRatio),
          height: sheetRect.height,
          pixelRatio,
          skipAutoScale: true,
          width: sheetRect.width
        });
      } finally {
        host.remove();
      }
    };

    const finishTurn = () => {
      window.clearTimeout(transitionTimer);
      window.cancelAnimationFrame(animationFrame);
      turningCanvas?.element.remove();
      turningCanvas = null;
      animationFrame = 0;
      isTurning = false;
      section.classList.remove('workbook--turning');
      section.removeAttribute('aria-busy');
      setControlsDisabled(false);
    };

    const buildTurningCanvas = (source: HTMLCanvasElement) => {
      const sectionRect = section.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const canvas = document.createElement('canvas');

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
      section.append(canvas);

      return { element: canvas, source } satisfies TurningCanvas;
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
        const source = await capturePage();
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
