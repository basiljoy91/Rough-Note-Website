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
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    typedNotes.forEach((note) => {
      const text = note.dataset.typeText ?? note.textContent ?? '';
      const delay = Number(note.dataset.typeDelay ?? 0);
      note.setAttribute('aria-label', text.replaceAll('\n', ' '));

      if (reducedMotion) {
        note.textContent = text;
        return;
      }

      note.textContent = '';
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

    const bulb = root.querySelector<HTMLButtonElement>('[data-idea-bulb]');
    const toggleBulb = () => {
      if (!bulb) return;
      const isLit = bulb.getAttribute('aria-pressed') === 'true';
      bulb.setAttribute('aria-pressed', String(!isLit));
      bulb.setAttribute(
        'aria-label',
        isLit ? 'Light up your brain' : 'Turn off idea light'
      );
    };
    bulb?.addEventListener('click', toggleBulb);

    return () => {
      timers.forEach(window.clearTimeout);
      bulb?.removeEventListener('click', toggleBulb);
    };
  }, [rootRef]);
}
