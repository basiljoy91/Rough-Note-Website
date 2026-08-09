import { useEffect } from 'react';

const FOOTER_BOUNDARY_SELECTOR = '[data-drawing-toolbar-boundary]';
const TOOLBAR_BOUNDARY_GAP = 18;
const TOOLBAR_LIFT_PROPERTY = '--drawing-footer-lift';

export function calculateFooterToolbarLift(
  naturalBottom: number,
  boundaryTop: number
): number {
  return Math.max(0, naturalBottom + TOOLBAR_BOUNDARY_GAP - boundaryTop);
}

export function useFooterToolbarBoundary(
  toolbarRef: React.RefObject<HTMLElement | null>,
  active = true
) {
  useEffect(() => {
    if (!active) return;

    let animationFrame = 0;
    const mountedToolbar = toolbarRef.current;

    const updateToolbarPosition = () => {
      const toolbar = toolbarRef.current;
      const boundary = document.querySelector<HTMLElement>(
        FOOTER_BOUNDARY_SELECTOR
      );

      if (!toolbar || !boundary) {
        toolbar?.style.removeProperty(TOOLBAR_LIFT_PROPERTY);
        return;
      }

      const previousLift =
        Number.parseFloat(
          toolbar.style.getPropertyValue(TOOLBAR_LIFT_PROPERTY)
        ) || 0;
      const toolbarBottom = toolbar.getBoundingClientRect().bottom + previousLift;
      const boundaryTop = boundary.getBoundingClientRect().top;
      const nextLift = calculateFooterToolbarLift(toolbarBottom, boundaryTop);

      if (nextLift > 0) {
        toolbar.style.setProperty(TOOLBAR_LIFT_PROPERTY, `${nextLift}px`);
      } else {
        toolbar.style.removeProperty(TOOLBAR_LIFT_PROPERTY);
      }
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateToolbarPosition);
    };

    updateToolbarPosition();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      mountedToolbar?.style.removeProperty(TOOLBAR_LIFT_PROPERTY);
    };
  }, [active, toolbarRef]);
}
