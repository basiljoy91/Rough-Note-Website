import { useEffect, useRef } from 'react';
import { TOOL_OPACITY } from '../constants';
import type {
  DrawingAction,
  DrawingPoint,
  DrawingState,
  DrawingStroke
} from '../types/drawing';
import {
  captureDrawingPoint,
  findDrawingAnchor,
  isInteractiveTarget,
  simplifyPoints,
  strokeIntersectsEraser
} from '../utils/coordinateUtils';
import {
  clearCanvas,
  renderStroke,
  renderStrokes,
  resizeCanvas
} from '../utils/canvasRenderer';

interface DrawingEngineOptions {
  committedCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  eraserPreviewRef: React.RefObject<HTMLDivElement | null>;
  state: DrawingState;
  dispatch: React.Dispatch<DrawingAction>;
}

function createStrokeId(): string {
  return crypto.randomUUID?.() ?? `rough-${Date.now()}-${Math.random()}`;
}

export function useDrawingEngine({
  committedCanvasRef,
  activeCanvasRef,
  eraserPreviewRef,
  state,
  dispatch
}: DrawingEngineOptions): void {
  const stateRef = useRef(state);
  const activeStroke = useRef<DrawingStroke | null>(null);
  const activePointerId = useRef<number | null>(null);
  const eraserWorkingStrokes = useRef<DrawingStroke[] | null>(null);
  const committedContext = useRef<CanvasRenderingContext2D | null>(null);
  const activeContext = useRef<CanvasRenderingContext2D | null>(null);
  const renderFrame = useRef<number | null>(null);
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const twoFingerCenterY = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const committedCanvas = committedCanvasRef.current;
    const activeCanvas = activeCanvasRef.current;
    if (!committedCanvas || !activeCanvas) return;

    const resize = () => {
      committedContext.current = resizeCanvas(committedCanvas);
      activeContext.current = resizeCanvas(activeCanvas);
      renderStrokes(
        committedCanvas,
        committedContext.current,
        stateRef.current.isDrawingVisible ? stateRef.current.strokes : []
      );
      if (activeStroke.current && activeContext.current) {
        renderStrokes(activeCanvas, activeContext.current, [
          activeStroke.current
        ]);
      }
    };
    resize();
    const visualViewport = window.visualViewport;
    window.addEventListener('resize', resize, { passive: true });
    visualViewport?.addEventListener('resize', resize, { passive: true });

    const bodyObserver = new ResizeObserver(() => {
      if (committedContext.current) {
        renderStrokes(
          committedCanvas,
          committedContext.current,
          stateRef.current.isDrawingVisible ? stateRef.current.strokes : []
        );
      }
    });
    bodyObserver.observe(document.body);
    return () => {
      window.removeEventListener('resize', resize);
      visualViewport?.removeEventListener('resize', resize);
      bodyObserver.disconnect();
    };
  }, [activeCanvasRef, committedCanvasRef]);

  useEffect(() => {
    const canvas = committedCanvasRef.current;
    const context = committedContext.current;
    if (!canvas || !context) return;
    renderStrokes(canvas, context, state.isDrawingVisible ? state.strokes : []);
  }, [committedCanvasRef, state.isDrawingVisible, state.strokes]);

  useEffect(() => {
    const committedCanvas = committedCanvasRef.current;
    const activeCanvas = activeCanvasRef.current;
    if (!committedCanvas || !activeCanvas) return;

    const scheduleActiveRender = () => {
      if (renderFrame.current !== null) return;
      renderFrame.current = window.requestAnimationFrame(() => {
        renderFrame.current = null;
        if (!activeContext.current) return;
        clearCanvas(activeCanvas, activeContext.current);
        if (activeStroke.current) {
          renderStroke(activeContext.current, activeStroke.current);
        }
      });
    };

    const renderCommitted = (strokes = stateRef.current.strokes) => {
      if (!committedContext.current) return;
      renderStrokes(
        committedCanvas,
        committedContext.current,
        stateRef.current.isDrawingVisible ? strokes : []
      );
    };

    const updateEraserPreview = (event: PointerEvent) => {
      const preview = eraserPreviewRef.current;
      if (!preview) return;
      if (
        stateRef.current.activeTool !== 'eraser' ||
        !stateRef.current.isDrawingVisible ||
        isInteractiveTarget(event.target)
      ) {
        preview.hidden = true;
        return;
      }
      const size = stateRef.current.toolSizes.eraser;
      preview.hidden = false;
      preview.style.width = `${size}px`;
      preview.style.height = `${Math.max(12, size * 0.58)}px`;
      preview.style.transform = `translate3d(${event.clientX - size / 2}px, ${
        event.clientY - size * 0.29
      }px, 0) rotate(-8deg)`;
    };

    const discardActiveStroke = () => {
      activeStroke.current = null;
      eraserWorkingStrokes.current = null;
      activePointerId.current = null;
      if (activeContext.current) clearCanvas(activeCanvas, activeContext.current);
      renderCommitted();
    };

    const finishGesture = (pointerId: number) => {
      if (activePointerId.current !== pointerId) return;
      if (activeStroke.current) {
        const stroke = {
          ...activeStroke.current,
          points: simplifyPoints(activeStroke.current.points)
        };
        dispatch({ type: 'ADD_STROKE', stroke });
      } else if (
        eraserWorkingStrokes.current &&
        eraserWorkingStrokes.current !== stateRef.current.strokes
      ) {
        dispatch({
          type: 'REPLACE_STROKES',
          strokes: eraserWorkingStrokes.current
        });
      }
      activeStroke.current = null;
      eraserWorkingStrokes.current = null;
      activePointerId.current = null;
      if (activeContext.current) clearCanvas(activeCanvas, activeContext.current);
    };

    const eraseAt = (event: PointerEvent) => {
      const size = stateRef.current.toolSizes.eraser;
      const point = {
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY
      };
      const source =
        eraserWorkingStrokes.current ?? stateRef.current.strokes;
      const filtered = source.filter(
        (stroke) => !strokeIntersectsEraser(stroke, point, size)
      );
      if (filtered.length !== source.length) {
        eraserWorkingStrokes.current = filtered;
        renderCommitted(filtered);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      updateEraserPreview(event);
      if (event.pointerType === 'touch') {
        touches.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY
        });
        if (touches.current.size > 1) {
          event.preventDefault();
          discardActiveStroke();
          const points = [...touches.current.values()];
          twoFingerCenterY.current =
            points.reduce((sum, point) => sum + point.y, 0) / points.length;
          return;
        }
      }

      const current = stateRef.current;
      const shouldDraw =
        current.isDrawingVisible &&
        (event.pointerType === 'pen' || current.interactionMode === 'draw');
      if (
        !shouldDraw ||
        isInteractiveTarget(event.target) ||
        activePointerId.current !== null ||
        event.button > 0
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      activePointerId.current = event.pointerId;
      if (event.target instanceof Element && 'setPointerCapture' in event.target) {
        try {
          (event.target as Element & {
            setPointerCapture(pointerId: number): void;
          }).setPointerCapture(event.pointerId);
        } catch {
          // Document listeners safely finish the stroke if capture is unavailable.
        }
      }

      if (current.activeTool === 'eraser') {
        eraserWorkingStrokes.current = current.strokes;
        eraseAt(event);
        return;
      }

      const anchor = findDrawingAnchor(event.clientX, event.clientY);
      activeStroke.current = {
        id: createStrokeId(),
        tool: current.activeTool,
        color: current.selectedColor,
        size: current.toolSizes[current.activeTool],
        opacity: TOOL_OPACITY[current.activeTool],
        points: [captureDrawingPoint(event, anchor)],
        createdAt: Date.now(),
        anchorKey: anchor?.dataset.roughAnchor ?? null
      };
      scheduleActiveRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      updateEraserPreview(event);
      if (event.pointerType === 'touch' && touches.current.has(event.pointerId)) {
        touches.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY
        });
        if (touches.current.size > 1) {
          event.preventDefault();
          const points = [...touches.current.values()];
          const centerY =
            points.reduce((sum, point) => sum + point.y, 0) / points.length;
          if (twoFingerCenterY.current !== null) {
            window.scrollBy(0, twoFingerCenterY.current - centerY);
          }
          twoFingerCenterY.current = centerY;
          renderCommitted(eraserWorkingStrokes.current ?? undefined);
          scheduleActiveRender();
          return;
        }
      }

      if (activePointerId.current !== event.pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      const samples = event.getCoalescedEvents?.() ?? [event];
      if (stateRef.current.activeTool === 'eraser') {
        samples.forEach(eraseAt);
        return;
      }
      const stroke = activeStroke.current;
      if (!stroke) return;
      const anchor = stroke.anchorKey
        ? document.querySelector<HTMLElement>(
            `[data-rough-anchor="${CSS.escape(stroke.anchorKey)}"]`
          )
        : null;
      const points = [...stroke.points];
      for (const sample of samples) {
        const point = captureDrawingPoint(sample, anchor);
        const previous = points.at(-1) as DrawingPoint;
        if (Math.hypot(point.x - previous.x, point.y - previous.y) >= 0.35) {
          points.push(point);
        }
      }
      activeStroke.current = { ...stroke, points };
      scheduleActiveRender();
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        touches.current.delete(event.pointerId);
        if (touches.current.size < 2) twoFingerCenterY.current = null;
      }
      if (activePointerId.current !== event.pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      finishGesture(event.pointerId);
    };

    const onScroll = () => {
      renderCommitted(eraserWorkingStrokes.current ?? undefined);
      scheduleActiveRender();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        dispatch({ type: event.shiftKey ? 'REDO' : 'UNDO' });
      } else if (modifier && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        dispatch({ type: 'REDO' });
      } else if (event.key === 'Escape') {
        dispatch({ type: 'SET_INTERACTION_MODE', mode: 'browse' });
      }
    };

    const onWindowBlur = () => {
      if (activePointerId.current !== null) {
        finishGesture(activePointerId.current);
      }
      touches.current.clear();
      twoFingerCenterY.current = null;
    };

    document.addEventListener('pointerdown', onPointerDown, {
      capture: true,
      passive: false
    });
    document.addEventListener('pointermove', onPointerMove, {
      capture: true,
      passive: false
    });
    document.addEventListener('pointerup', onPointerEnd, {
      capture: true,
      passive: false
    });
    document.addEventListener('pointercancel', onPointerEnd, {
      capture: true,
      passive: false
    });
    document.addEventListener('lostpointercapture', onPointerEnd, true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('blur', onWindowBlur);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('pointermove', onPointerMove, true);
      document.removeEventListener('pointerup', onPointerEnd, true);
      document.removeEventListener('pointercancel', onPointerEnd, true);
      document.removeEventListener('lostpointercapture', onPointerEnd, true);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('blur', onWindowBlur);
      if (renderFrame.current !== null) cancelAnimationFrame(renderFrame.current);
    };
  }, [
    activeCanvasRef,
    committedCanvasRef,
    dispatch,
    eraserPreviewRef
  ]);
}
