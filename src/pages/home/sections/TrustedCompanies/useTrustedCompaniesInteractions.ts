import { useEffect, type RefObject } from 'react';

type ProjectTrigger = HTMLButtonElement & {
  dataset: DOMStringMap & {
    projectAlt?: string;
    projectImage?: string;
    projectTitle?: string;
    projectType?: string;
    projectUrl?: string;
  };
};

export function useTrustedCompaniesInteractions(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const section = root?.querySelector<HTMLElement>('.trusted-companies');
    const modal = section?.querySelector<HTMLElement>('.trusted-project-modal');

    if (!section || !modal) return;

    const triggers = Array.from(
      section.querySelectorAll<ProjectTrigger>('.trusted-review__laptop')
    );
    const closeControls = Array.from(
      modal.querySelectorAll<HTMLButtonElement>('[data-project-close]')
    );
    const closeButton = modal.querySelector<HTMLButtonElement>('.trusted-project-modal__close');
    const title = modal.querySelector<HTMLElement>('#trusted-project-modal-title');
    const type = modal.querySelector<HTMLElement>('.trusted-project-modal__type');
    const image = modal.querySelector<HTMLImageElement>('.trusted-project-modal__screen img');
    const visit = modal.querySelector<HTMLAnchorElement>('.trusted-project-modal__visit');
    const pending = modal.querySelector<HTMLElement>('.trusted-project-modal__pending');

    if (!closeButton || !title || !type || !image || !visit || !pending) return;

    let activeTrigger: ProjectTrigger | null = null;
    let previousBodyOverflow = '';

    const closeModal = () => {
      if (modal.hidden) return;

      modal.hidden = true;
      document.body.style.overflow = previousBodyOverflow;
      activeTrigger?.focus();
      activeTrigger = null;
    };

    const openModal = (trigger: ProjectTrigger) => {
      const projectUrl = trigger.dataset.projectUrl?.trim() ?? '';

      activeTrigger = trigger;
      title.textContent = trigger.dataset.projectTitle ?? 'Featured project';
      type.textContent = trigger.dataset.projectType ?? '';
      image.src = trigger.dataset.projectImage ?? '';
      image.alt = trigger.dataset.projectAlt ?? '';

      if (projectUrl && projectUrl !== '#') {
        visit.href = projectUrl;
        visit.hidden = false;
        pending.hidden = true;
      } else {
        visit.removeAttribute('href');
        visit.hidden = true;
        pending.hidden = false;
      }

      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      modal.hidden = false;
      closeButton.focus();
    };

    const triggerHandlers = triggers.map((trigger) => {
      const handler = () => openModal(trigger);
      trigger.addEventListener('click', handler);
      return { handler, trigger };
    });

    const closeHandlers = closeControls.map((control) => {
      const handler = () => closeModal();
      control.addEventListener('click', handler);
      return { control, handler };
    });

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !modal.hidden) closeModal();
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      triggerHandlers.forEach(({ handler, trigger }) => trigger.removeEventListener('click', handler));
      closeHandlers.forEach(({ control, handler }) => control.removeEventListener('click', handler));
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [rootRef]);
}
