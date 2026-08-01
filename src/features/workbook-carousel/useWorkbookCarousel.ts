import { useEffect, type RefObject } from 'react';

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
    const paper = section.querySelector<HTMLElement>('.workbook__paper');
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
    if (!paper || !dotGroup || !previous || !next) return;

    let current = 0;
    let transitionTimer = 0;
    let initialTimer = 0;

    const show = (requested: number) => {
      current = (requested + pages.length) % pages.length;
      paper.classList.remove('is-turning');
      void paper.offsetWidth;
      paper.classList.add('is-turning');
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => {
        intros.forEach((item, index) =>
          item.classList.toggle('is-visible', index === current)
        );
        artwork.forEach((item, index) =>
          item.classList.toggle('is-visible', index === current)
        );
        stickies.forEach((item, index) =>
          item.classList.toggle('is-visible', index === current)
        );
        dots.forEach((dot, index) =>
          dot.classList.toggle('is-active', index === current)
        );
        dotGroup.setAttribute(
          'aria-label',
          `Work page ${current + 1} of ${pages.length}`
        );
        if (pageCount) {
          pageCount.textContent = `Page 0${current + 1}`;
        }

        const video = section.querySelector<HTMLVideoElement>('#vp-video');
        if (video && pages[current] !== 'video') video.pause();

        [intros[current], artwork[current]].forEach((item) => {
          if (!item) return;
          item.classList.remove('visible');
          void item.offsetWidth;
          item.classList.add('visible');
        });
      }, 285);
    };

    const showPrevious = () => show(current - 1);
    const showNext = () => show(current + 1);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrevious();
    };
    const dotHandlers = dots.map((dot, index) => {
      const handler = () => show(index);
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
