import { useEffect, type RefObject } from 'react';

export function useCompanySnapshot(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const partners = root?.querySelector<HTMLElement>('.d2-partners');
    const previous = root?.querySelector<HTMLButtonElement>(
      '.d2-carousel-btn--prev'
    );
    const next = root?.querySelector<HTMLButtonElement>(
      '.d2-carousel-btn--next'
    );
    if (!partners || !previous || !next) return;

    const updateButtons = () => {
      const atStart = partners.scrollLeft <= 0;
      const atEnd =
        partners.scrollLeft + partners.clientWidth >= partners.scrollWidth - 10;
      previous.disabled = atStart;
      next.disabled = atEnd;
      previous.style.opacity = atStart ? '0.5' : '1';
      next.style.opacity = atEnd ? '0.5' : '1';
    };
    const movePrevious = () =>
      partners.scrollBy({ left: -151, behavior: 'smooth' });
    const moveNext = () =>
      partners.scrollBy({ left: 151, behavior: 'smooth' });

    previous.addEventListener('click', movePrevious);
    next.addEventListener('click', moveNext);
    partners.addEventListener('scroll', updateButtons);
    updateButtons();

    return () => {
      previous.removeEventListener('click', movePrevious);
      next.removeEventListener('click', moveNext);
      partners.removeEventListener('scroll', updateButtons);
    };
  }, [rootRef]);
}
