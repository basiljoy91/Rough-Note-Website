import { useLayoutEffect, type RefObject } from 'react';

const TYPE_STEP_MS = 88;

function getTypingPause(character: string, index: number) {
  if (character === '\n') return 320;
  if (character === ' ') return 70;
  if (/[!,.?]/.test(character)) return 220;
  return TYPE_STEP_MS + (index % 4) * 8;
}

export function useHeroInteractions(
  rootRef: RefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const timers: number[] = [];
    const typedNotes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-type-text]')
    );
    const workspace = root.querySelector<HTMLElement>('[data-hero-workspace]');
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const notes = typedNotes.map((note) => {
      const text = note.dataset.typeText ?? note.textContent ?? '';
      const delay = Number(note.dataset.typeDelay ?? 0);
      note.setAttribute('aria-label', text.replaceAll('\n', ' '));

      if (reducedMotion) {
        note.textContent = text;
      } else {
        note.textContent = '';
      }

      return { delay, note, text };
    });

    let hasStartedTyping = false;
    const startTyping = () => {
      if (hasStartedTyping || reducedMotion) return;
      hasStartedTyping = true;

      notes.forEach(({ delay, note, text }) => {
        const startTimer = window.setTimeout(() => {
          let character = 0;
          note.classList.add('is-typing');

          const typeNextCharacter = () => {
            character += 1;
            note.textContent = text.slice(0, character);

            if (character >= text.length) {
              note.classList.remove('is-typing');
              return;
            }

            const lastCharacter = text[character - 1];
            const pause = getTypingPause(lastCharacter, character);
            timers.push(window.setTimeout(typeNextCharacter, pause));
          };

          typeNextCharacter();
        }, delay);
        timers.push(startTimer);
      });
    };

    let typingObserver: IntersectionObserver | undefined;
    if (!reducedMotion && workspace && 'IntersectionObserver' in window) {
      typingObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          typingObserver?.disconnect();
          startTyping();
        },
        { threshold: 0.18 }
      );
      typingObserver.observe(workspace);
    } else {
      startTyping();
    }

    const bulbs = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-idea-bulb]')
    );
    const toggleBulb = (event: MouseEvent) => {
      const bulb = event.currentTarget as HTMLButtonElement;
      const isLit = bulb.getAttribute('aria-pressed') === 'true';
      bulb.setAttribute('aria-pressed', String(!isLit));
      bulb.setAttribute(
        'aria-label',
        isLit ? 'Light up your brain' : 'Turn off idea light'
      );
    };
    bulbs.forEach((bulb) => bulb.addEventListener('click', toggleBulb));

    return () => {
      typingObserver?.disconnect();
      timers.forEach(window.clearTimeout);
      bulbs.forEach((bulb) => bulb.removeEventListener('click', toggleBulb));
    };
  }, [rootRef]);
}
