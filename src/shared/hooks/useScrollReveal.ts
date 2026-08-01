import { useEffect, type RefObject } from 'react';

export function useScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.classList.add('visible');

          target.querySelectorAll<SVGPathElement>('.marker-circle path').forEach(
            (circle, index) => {
              timers.push(
                window.setTimeout(() => {
                  circle.style.strokeDashoffset = '0';
                }, 400 + index * 200)
              );
            }
          );

          if (target.classList.contains('reveal-notebook')) {
            target.querySelectorAll<SVGPathElement>('.check-svg path').forEach(
              (check, index) => {
                timers.push(
                  window.setTimeout(() => {
                    check.style.strokeDashoffset = '0';
                  }, 800 + index * 150)
                );
              }
            );
          }

          if (target.classList.contains('journey-container')) {
            target
              .querySelectorAll<HTMLElement>('.timeline-item, .timeline-arrow')
              .forEach((element, index) => {
                timers.push(
                  window.setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = '';
                  }, index * 150)
                );
              });
          }

          if (target.classList.contains('d4-section')) {
            target.querySelectorAll('.d4-card').forEach((card, index) => {
              timers.push(
                window.setTimeout(
                  () => card.classList.add('visible'),
                  200 + index * 100
                )
              );
            });
          }

          observer.unobserve(target);
        });
      },
      { threshold: 0.15 }
    );

    root
      .querySelectorAll(
        '.reveal-on-scroll, .reveal-notebook, .journey-container'
      )
      .forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [rootRef]);
}
