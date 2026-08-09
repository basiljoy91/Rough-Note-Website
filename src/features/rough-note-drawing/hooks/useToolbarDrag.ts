import { useCallback, useEffect, useRef } from 'react';
import type { DrawingAction, ToolbarPosition } from '../types/drawing';

interface DragOrigin {
  pointerX: number;
  pointerY: number;
  toolbarX: number;
  toolbarY: number;
  pointerId: number;
}

export function useToolbarDrag(
  toolbarRef: React.RefObject<HTMLElement | null>,
  position: ToolbarPosition | null,
  dispatch: React.Dispatch<DrawingAction>,
  disabled: boolean
) {
  const dragOrigin = useRef<DragOrigin | null>(null);

  const clampPosition = useCallback(
    (x: number, y: number): ToolbarPosition => {
      const toolbar = toolbarRef.current;
      if (!toolbar) return { x, y };
      const safe = 10;
      const rect = toolbar.getBoundingClientRect();
      const toolbarWidth = rect.width || toolbar.offsetWidth;
      const toolbarHeight = rect.height || toolbar.offsetHeight;
      const maxX = Math.max(safe, window.innerWidth - toolbarWidth - safe);
      const maxY = Math.max(safe, window.innerHeight - toolbarHeight - safe);
      return {
        x: Math.min(maxX, Math.max(safe, x)),
        y: Math.min(maxY, Math.max(safe, y))
      };
    },
    [toolbarRef]
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || event.button > 0 || !toolbarRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      const toolbar = toolbarRef.current;
      const rect = toolbar.getBoundingClientRect();
      const footerLift =
        Number.parseFloat(
          window
            .getComputedStyle(toolbar)
            .getPropertyValue('--drawing-footer-lift')
        ) || 0;
      dragOrigin.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        toolbarX: rect.left,
        toolbarY: rect.top + footerLift,
        pointerId: event.pointerId
      };
    },
    [disabled, toolbarRef]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const origin = dragOrigin.current;
      if (!origin || origin.pointerId !== event.pointerId) return;
      event.preventDefault();
      dispatch({
        type: 'SET_TOOLBAR_POSITION',
        position: clampPosition(
          origin.toolbarX + event.clientX - origin.pointerX,
          origin.toolbarY + event.clientY - origin.pointerY
        )
      });
    },
    [clampPosition, dispatch]
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (dragOrigin.current?.pointerId !== event.pointerId) return;
      dragOrigin.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  const resetPosition = useCallback(() => {
    dispatch({ type: 'SET_TOOLBAR_POSITION', position: null });
  }, [dispatch]);

  useEffect(() => {
    if (!position) return;
    const onResize = () => {
      const nextPosition = clampPosition(position.x, position.y);
      if (
        nextPosition.x === position.x &&
        nextPosition.y === position.y
      ) {
        return;
      }
      dispatch({
        type: 'SET_TOOLBAR_POSITION',
        position: nextPosition
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [clampPosition, dispatch, position]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: finishDrag,
    onPointerCancel: finishDrag,
    onDoubleClick: resetPosition
  };
}
