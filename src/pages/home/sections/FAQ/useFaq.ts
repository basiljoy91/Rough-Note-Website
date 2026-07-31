import { useEffect, type RefObject } from 'react';

export function useFaq(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const controls = Array.from(
      root.querySelectorAll<HTMLElement>('.d8-faq-content')
    );

    const toggle = (control: HTMLElement) => {
      const item = control.closest<HTMLElement>('.d8-faq-item');
      if (!item) return;
      root.querySelectorAll('.d8-faq-item').forEach((candidate) => {
        if (candidate !== item) {
          candidate.classList.remove('active');
          candidate
            .querySelector<HTMLElement>('.d8-faq-content')
            ?.setAttribute('aria-expanded', 'false');
        }
      });
      const active = item.classList.toggle('active');
      control.setAttribute('aria-expanded', String(active));
    };

    const cleanups = controls.map((control) => {
      control.setAttribute('role', 'button');
      control.setAttribute('tabindex', '0');
      control.setAttribute(
        'aria-expanded',
        String(control.closest('.d8-faq-item')?.classList.contains('active'))
      );
      const onClick = () => toggle(control);
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        toggle(control);
      };
      control.addEventListener('click', onClick);
      control.addEventListener('keydown', onKeyDown);
      return () => {
        control.removeEventListener('click', onClick);
        control.removeEventListener('keydown', onKeyDown);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [rootRef]);
}
