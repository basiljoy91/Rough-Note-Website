import { useEffect, useReducer, useRef, useState } from 'react';
import { INITIAL_DRAWING_STATE } from '../../constants';
import { useCustomCursor } from '../../hooks/useCustomCursor';
import { useDrawingEngine } from '../../hooks/useDrawingEngine';
import { useDrawingPersistence } from '../../hooks/useDrawingPersistence';
import { useResponsiveDrawingUI } from '../../hooks/useResponsiveDrawingUI';
import { drawingReducer } from '../../state/drawingReducer';
import { normalizePathname } from '../../utils/coordinateUtils';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingConsent } from './DrawingConsent';
import { DrawingToolbar } from './DrawingToolbar';
import { MobileToolDrawer } from './MobileToolDrawer';
import styles from './drawing-toolbar.module.css';

const ONBOARDING_KEY = 'rough-note:drawing-onboarding:v1';

function shouldShowOnboarding(): boolean {
  try {
    if (window.sessionStorage.getItem(ONBOARDING_KEY)) return false;
    window.sessionStorage.setItem(ONBOARDING_KEY, 'shown');
  } catch {
    // The hint remains best-effort when session storage is blocked.
  }
  return true;
}

function useDrawingPathname(): string {
  const [pathname, setPathname] = useState(() => normalizePathname());

  useEffect(() => {
    const update = () => setPathname(normalizePathname());
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    window.history.pushState = function pushState(...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event('rough-note-route-change'));
    };
    window.history.replaceState = function replaceState(...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('rough-note-route-change'));
    };
    window.addEventListener('popstate', update);
    window.addEventListener('rough-note-route-change', update);
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', update);
      window.removeEventListener('rough-note-route-change', update);
    };
  }, []);

  return pathname;
}

export function RoughNoteDrawing() {
  const responsive = useResponsiveDrawingUI();
  const [state, dispatch] = useReducer(
    drawingReducer,
    INITIAL_DRAWING_STATE,
    (initial) => ({
      ...initial,
      toolSizes: { ...initial.toolSizes },
      isToolbarCollapsed: window.matchMedia('(max-width: 767px)').matches
    })
  );
  const pathname = useDrawingPathname();
  const committedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eraserPreviewRef = useRef<HTMLDivElement | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

  const persistence = useDrawingPersistence(state, pathname, dispatch);
  useCustomCursor(state.activeTool, state.interactionMode, dispatch);
  useDrawingEngine({
    committedCanvasRef,
    activeCanvasRef,
    eraserPreviewRef,
    state,
    dispatch
  });

  useEffect(() => {
    document.documentElement.dataset.roughNoteInteraction =
      state.interactionMode;
    return () => {
      delete document.documentElement.dataset.roughNoteInteraction;
    };
  }, [state.interactionMode]);

  useEffect(() => {
    if (!showOnboarding) return;
    const timer = window.setTimeout(() => setShowOnboarding(false), 4800);
    return () => window.clearTimeout(timer);
  }, [showOnboarding]);

  return (
    <div
      className={styles.drawingRoot}
      data-rough-note-root
      data-active-tool={state.activeTool}
      data-interaction-mode={state.interactionMode}
      data-stroke-count={state.strokes.length}
    >
      <DrawingCanvas
        committedCanvasRef={committedCanvasRef}
        activeCanvasRef={activeCanvasRef}
        eraserPreviewRef={eraserPreviewRef}
        visible={state.isDrawingVisible}
      />

      {responsive.isMobile ? (
        <MobileToolDrawer
          state={state}
          dispatch={dispatch}
          onClearDrawing={persistence.clearCurrentDrawing}
        />
      ) : (
        <DrawingToolbar
          state={state}
          dispatch={dispatch}
          compact={responsive.isTablet}
          onClearDrawing={persistence.clearCurrentDrawing}
        />
      )}

      {persistence.consent === 'unknown' && (
        <DrawingConsent
          onAccept={persistence.acceptStorage}
          onDecline={persistence.declineStorage}
        />
      )}

      {showOnboarding && (
        <p className={styles.onboardingHint} role="status" data-drawing-exclusion>
          {responsive.isMobile
            ? 'Draw with one finger. Scroll with two.'
            : 'Hold Space to interact with the page'}
        </p>
      )}

      <p className={styles.srOnly} role="status" aria-live="polite">
        {persistence.storageError ?? ''}
      </p>
    </div>
  );
}
