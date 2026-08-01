import { useEffect, useRef, useState } from 'react';
import type { DrawingAction, DrawingState, DrawingTool } from '../../types/drawing';
import { ClearConfirmation } from './ClearConfirmation';
import { CollapsedPencilTab } from './CollapsedPencilTab';
import { ColorPicker } from './ColorPicker';
import {
  CollapseIcon,
  HiddenEyeIcon,
  RedoIcon,
  TrashIcon,
  UndoIcon,
  VisibleEyeIcon
} from './DrawingIcons';
import { StrokeSizeControl } from './StrokeSizeControl';
import { ToolButton } from './ToolButton';
import styles from './drawing-toolbar.module.css';

interface MobileToolDrawerProps {
  state: DrawingState;
  dispatch: React.Dispatch<DrawingAction>;
  onClearDrawing?: () => void;
}

export function MobileToolDrawer({
  state,
  dispatch,
  onClearDrawing
}: MobileToolDrawerProps) {
  const [clearOpen, setClearOpen] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const collapseTimer = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (collapseTimer.current !== null) {
        window.clearTimeout(collapseTimer.current);
      }
    },
    []
  );

  if (state.isToolbarCollapsed) {
    return (
      <CollapsedPencilTab
        mobile
        onExpand={() => dispatch({ type: 'SET_COLLAPSED', value: false })}
      />
    );
  }

  const selectTool = (tool: DrawingTool) =>
    dispatch({ type: 'SET_TOOL', tool });
  const collapse = () => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reducedMotion) {
      dispatch({ type: 'SET_COLLAPSED', value: true });
      return;
    }
    setClearOpen(false);
    setIsCollapsing(true);
    collapseTimer.current = window.setTimeout(() => {
      dispatch({ type: 'SET_COLLAPSED', value: true });
      setIsCollapsing(false);
    }, 260);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.mobileModeTab} ${
          state.interactionMode === 'draw' ? styles.mobileModeTabActive : ''
        }`}
        aria-label={`Switch to ${
          state.interactionMode === 'draw' ? 'browse' : 'draw'
        } mode`}
        aria-pressed={state.interactionMode === 'draw'}
        onClick={() =>
          dispatch({
            type: 'SET_INTERACTION_MODE',
            mode: state.interactionMode === 'draw' ? 'browse' : 'draw'
          })
        }
        data-drawing-exclusion
      >
        <span>{state.interactionMode === 'draw' ? 'Draw' : 'Browse'}</span>
      </button>
      <section
        className={`${styles.mobileDrawer} ${
          isCollapsing ? styles.mobileDrawerCollapsing : ''
        }`}
        role="toolbar"
        aria-label="Drawing tools"
        data-drawing-exclusion
        data-cursor="pointer"
        data-testid="mobile-drawing-toolbar"
      >
        <div className={styles.mobileFirstRow}>
          <button
            type="button"
            className={styles.mobileGrip}
            aria-label="Drag down to collapse tools"
            onPointerDown={(event) => {
              dragStartY.current = event.clientY;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              if (
                dragStartY.current !== null &&
                event.clientY - dragStartY.current > 52
              ) {
                collapse();
              }
              dragStartY.current = null;
            }}
            onPointerCancel={() => {
              dragStartY.current = null;
            }}
          >
            <span className={styles.mobileGripLine} aria-hidden="true" />
          </button>
          <div className={styles.mobileTools}>
            {(['pencil', 'pen', 'highlighter', 'eraser'] as const).map((tool) => (
              <ToolButton
                key={tool}
                tool={tool}
                selected={state.activeTool === tool}
                onSelect={selectTool}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Collapse tools"
            data-tooltip="Collapse tools"
            onClick={collapse}
          >
            <CollapseIcon />
          </button>
        </div>

        <div className={styles.mobileSecondRow}>
          <ColorPicker
            selectedColor={state.selectedColor}
            onSelect={(color) => dispatch({ type: 'SET_COLOR', color })}
          />
          <span className={styles.divider} aria-hidden="true" />
          <StrokeSizeControl
            tool={state.activeTool}
            size={state.toolSizes[state.activeTool]}
            onChange={(size) =>
              dispatch({ type: 'SET_SIZE', tool: state.activeTool, size })
            }
          />
          <span className={styles.divider} aria-hidden="true" />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Undo"
            data-tooltip="Undo"
            disabled={state.undoStack.length === 0}
            onClick={() => dispatch({ type: 'UNDO' })}
          >
            <UndoIcon />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Redo"
            data-tooltip="Redo"
            disabled={state.redoStack.length === 0}
            onClick={() => dispatch({ type: 'REDO' })}
          >
            <RedoIcon />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={state.isDrawingVisible ? 'Hide drawing' : 'Show drawing'}
            aria-pressed={!state.isDrawingVisible}
            data-tooltip={
              state.isDrawingVisible ? 'Hide drawing' : 'Show drawing'
            }
            onClick={() => dispatch({ type: 'TOGGLE_VISIBILITY' })}
          >
            {state.isDrawingVisible ? <HiddenEyeIcon /> : <VisibleEyeIcon />}
          </button>
          <div className={styles.deleteControl}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear drawing"
              aria-expanded={clearOpen}
              data-tooltip="Clear drawing"
              onClick={() => setClearOpen((open) => !open)}
            >
              <TrashIcon />
            </button>
            <ClearConfirmation
              open={clearOpen}
              onKeep={() => setClearOpen(false)}
              onClear={() => {
                if (onClearDrawing) {
                  onClearDrawing();
                } else {
                  dispatch({ type: 'CLEAR_ALL' });
                }
                setClearOpen(false);
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
