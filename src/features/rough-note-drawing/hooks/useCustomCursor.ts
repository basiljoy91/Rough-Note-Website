import { useEffect, useRef } from 'react';
import type {
  DrawingAction,
  DrawingTool,
  InteractionMode
} from '../types/drawing';
import {
  applyDrawingCursor,
  clearDrawingCursor
} from '../utils/cursorFactory';

export function useCustomCursor(
  tool: DrawingTool,
  interactionMode: InteractionMode,
  dispatch: React.Dispatch<DrawingAction>
): void {
  const interactionModeRef = useRef(interactionMode);
  const previousModeRef = useRef<InteractionMode | null>(null);

  useEffect(() => {
    interactionModeRef.current = interactionMode;
  }, [interactionMode]);

  useEffect(() => {
    applyDrawingCursor(tool);
    return clearDrawingCursor;
  }, [tool]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      if (isTyping) return;
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        if (previousModeRef.current !== null) return;
        previousModeRef.current = interactionModeRef.current;
        dispatch({ type: 'SET_INTERACTION_MODE', mode: 'browse' });
        document.documentElement.dataset.roughNoteSpaceBrowse = 'true';
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || previousModeRef.current === null) return;
      event.preventDefault();
      dispatch({
        type: 'SET_INTERACTION_MODE',
        mode: previousModeRef.current
      });
      previousModeRef.current = null;
      delete document.documentElement.dataset.roughNoteSpaceBrowse;
    };
    const onBlur = () => {
      if (previousModeRef.current) {
        dispatch({
          type: 'SET_INTERACTION_MODE',
          mode: previousModeRef.current
        });
        previousModeRef.current = null;
      }
      delete document.documentElement.dataset.roughNoteSpaceBrowse;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      delete document.documentElement.dataset.roughNoteSpaceBrowse;
    };
  }, [dispatch]);
}
