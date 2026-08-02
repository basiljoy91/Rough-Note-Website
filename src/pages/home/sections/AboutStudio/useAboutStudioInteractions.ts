import { useLayoutEffect, type RefObject } from 'react';

export function useAboutStudioInteractions(
  rootRef: RefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lamps = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-about-lamp]')
    );

    const toggleLamp = (event: MouseEvent) => {
      const lamp = event.currentTarget as HTMLButtonElement;
      const isLit = lamp.getAttribute('aria-pressed') === 'true';

      lamp.setAttribute('aria-pressed', String(!isLit));
      lamp.setAttribute(
        'aria-label',
        isLit ? 'Turn desk lamp on' : 'Turn desk lamp off'
      );
    };

    lamps.forEach((lamp) => lamp.addEventListener('click', toggleLamp));

    return () => {
      lamps.forEach((lamp) => lamp.removeEventListener('click', toggleLamp));
    };
  }, [rootRef]);
}
