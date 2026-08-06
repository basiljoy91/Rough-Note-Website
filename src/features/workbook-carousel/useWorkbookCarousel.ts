import { useEffect, type RefObject } from 'react';

const pages = ['web', 'brand', 'poster', 'logo', 'motion', 'video', 'erp'];
const pageTurnDuration = 1280;

type TurnDirection = 'next' | 'previous';

type PageStrip = {
  element: HTMLElement;
  shade: HTMLElement;
  center: number;
};

type TurnMesh = {
  element: HTMLElement;
  shadow: HTMLElement;
  shadowWidth: number;
  sheetLeft: number;
  sheetWidth: number;
  strips: PageStrip[];
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
    let turningMesh: TurnMesh | null = null;
    let isTurning = false;

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

      [intros[index], artwork[index]].forEach((item) => {
        if (!item) return;
        item.classList.remove('visible');
        void item.offsetWidth;
        item.classList.add('visible');
      });
    };

    const finishTurn = () => {
      window.clearTimeout(transitionTimer);
      window.cancelAnimationFrame(animationFrame);
      turningMesh?.element.remove();
      turningMesh?.shadow.remove();
      turningMesh = null;
      animationFrame = 0;
      isTurning = false;
      section.classList.remove('workbook--turning');
      section.removeAttribute('aria-busy');
      previous.disabled = false;
      next.disabled = false;
      dots.forEach((dot) => {
        dot.disabled = false;
      });
    };

    const preparePageClone = () => {
      const clone = sheet.cloneNode(true) as HTMLElement;
      clone.classList.add('workbook__page-strip-content');
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('inert', '');
      clone
        .querySelectorAll<HTMLElement>(
          '.workbook__intro-item:not(.is-visible), .workbook__art:not(.is-visible), .workbook__sticky-item:not(.is-visible)'
        )
        .forEach((element) => element.remove());
      clone.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
        element.removeAttribute('id');
      });
      clone.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
        video.pause();
        video.removeAttribute('controls');
      });
      return clone;
    };

    const buildTurningMesh = () => {
      const sectionRect = section.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const left = sheetRect.left - sectionRect.left;
      const top = sheetRect.top - sectionRect.top;
      const stripCount = Math.max(
        18,
        Math.min(32, Math.ceil(sheetRect.width / 46))
      );
      const stripWidth = sheetRect.width / stripCount;
      const source = preparePageClone();
      const mesh = document.createElement('div');
      const strips: PageStrip[] = [];

      mesh.className = 'workbook__turn-mesh';
      mesh.setAttribute('aria-hidden', 'true');
      Object.assign(mesh.style, {
        height: `${sheetRect.height}px`,
        left: `${left}px`,
        top: `${top}px`,
        width: `${sheetRect.width}px`
      });

      for (let index = 0; index < stripCount; index += 1) {
        const stripLeft = index * stripWidth;
        const strip = document.createElement('div');
        const content = source.cloneNode(true) as HTMLElement;
        const shade = document.createElement('span');

        strip.className = 'workbook__page-strip';
        shade.className = 'workbook__page-strip-shade';
        Object.assign(strip.style, {
          left: `${stripLeft}px`,
          width: `${stripWidth + 1.5}px`
        });
        Object.assign(content.style, {
          height: `${sheetRect.height}px`,
          left: `${-stripLeft}px`,
          minHeight: '0',
          top: '0',
          width: `${sheetRect.width}px`
        });
        strip.append(content, shade);
        mesh.append(strip);
        strips.push({
          element: strip,
          shade,
          center: (stripLeft + stripWidth / 2) / sheetRect.width
        });
      }

      const shadow = document.createElement('span');
      const shadowWidth = Math.max(74, sheetRect.width * 0.18);
      shadow.className = 'workbook__mesh-shadow';
      shadow.setAttribute('aria-hidden', 'true');
      Object.assign(shadow.style, {
        height: `${sheetRect.height}px`,
        left: `${left + sheetRect.width - shadowWidth / 2}px`,
        top: `${top}px`,
        width: `${shadowWidth}px`
      });

      section.append(shadow, mesh);
      return {
        element: mesh,
        shadow,
        shadowWidth,
        sheetLeft: left,
        sheetWidth: sheetRect.width,
        strips
      } satisfies TurnMesh;
    };

    const updateTurningMesh = (
      mesh: TurnMesh,
      progress: number,
      direction: TurnDirection
    ) => {
      const curlWidth = 0.22;
      const curlRadius = curlWidth / Math.PI;
      const directionSign = direction === 'next' ? -1 : 1;
      const front =
        direction === 'next'
          ? 1 - progress * (1 + curlWidth)
          : progress * (1 + curlWidth);

      mesh.strips.forEach(({ element, shade, center }) => {
        const distance =
          direction === 'next' ? center - front : front - center;
        let angle = 0;
        let mappedCenter = center;

        if (distance > 0) {
          if (distance < curlWidth) {
            angle = distance / curlRadius;
            mappedCenter =
              direction === 'next'
                ? front + curlRadius * Math.sin(angle)
                : front - curlRadius * Math.sin(angle);
          } else {
            angle = Math.PI;
            mappedCenter =
              direction === 'next'
                ? front - (distance - curlWidth)
                : front + (distance - curlWidth);
          }
        }

        const fold = Math.sin(angle);
        const lift = curlRadius * mesh.sheetWidth * (1 - Math.cos(angle));
        const translateX = (mappedCenter - center) * mesh.sheetWidth;
        const angleDegrees = (angle * 180) / Math.PI;
        const ripple = fold * Math.sin((center + progress) * Math.PI) * 2.2;

        element.style.transform =
          `translate3d(${translateX}px, ${ripple}px, ${lift}px) ` +
          `rotateY(${directionSign * angleDegrees}deg) ` +
          `rotateZ(${directionSign * fold * 0.55}deg)`;
        shade.style.opacity = `${Math.min(0.62, fold * 0.48 + angle / Math.PI * 0.1)}`;
      });

      const shadowOpacity = Math.sin(progress * Math.PI) * 0.72;
      const shadowCenter = front * mesh.sheetWidth;
      mesh.shadow.style.left = `${
        mesh.sheetLeft + shadowCenter - mesh.shadowWidth / 2
      }px`;
      mesh.shadow.style.opacity = `${Math.max(0, shadowOpacity)}`;
      mesh.shadow.style.transform = `scaleX(${0.72 + shadowOpacity * 0.48})`;
    };

    const animateTurningMesh = (
      mesh: TurnMesh,
      direction: TurnDirection
    ) => {
      let startTime = 0;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = Math.min(1, (timestamp - startTime) / pageTurnDuration);
        const progress =
          elapsed * elapsed * elapsed *
          (elapsed * (elapsed * 6 - 15) + 10);

        updateTurningMesh(mesh, progress, direction);
        if (elapsed < 1) {
          animationFrame = window.requestAnimationFrame(step);
          return;
        }
        finishTurn();
      };

      updateTurningMesh(mesh, 0, direction);
      animationFrame = window.requestAnimationFrame(step);
    };

    const show = (requested: number, direction: TurnDirection) => {
      if (isTurning) return;

      const requestedPage = (requested + pages.length) % pages.length;
      if (requestedPage === current) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      window.clearTimeout(transitionTimer);
      const mesh = reduceMotion ? null : buildTurningMesh();

      current = requestedPage;
      renderPage(current);

      if (reduceMotion) return;

      isTurning = true;
      section.classList.add('workbook--turning');
      section.setAttribute('aria-busy', 'true');
      previous.disabled = true;
      next.disabled = true;
      dots.forEach((dot) => {
        dot.disabled = true;
      });
      if (mesh) {
        turningMesh = mesh;
        animateTurningMesh(mesh, direction);
      }
      transitionTimer = window.setTimeout(finishTurn, pageTurnDuration + 250);
    };

    const showPrevious = () => show(current - 1, 'previous');
    const showNext = () => show(current + 1, 'next');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrevious();
    };
    const dotHandlers = dots.map((dot, index) => {
      const handler = () => show(index, index < current ? 'previous' : 'next');
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
      window.clearTimeout(transitionTimer);
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
