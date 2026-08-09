import { useEffect, useRef, useState } from 'react';
import { useFooterToolbarBoundary } from '../../hooks/useFooterToolbarBoundary';
import { useToolbarDrag } from '../../hooks/useToolbarDrag';
import type { DrawingAction, DrawingState, DrawingTool } from '../../types/drawing';
import { ColorPicker } from './ColorPicker';
import { ClearConfirmation } from './ClearConfirmation';
import { CollapsedPencilTab } from './CollapsedPencilTab';
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

interface DrawingToolbarProps {
  state: DrawingState;
  dispatch: React.Dispatch<DrawingAction>;
  compact?: boolean;
  onClearDrawing?: () => void;
}

export function DrawingToolbar({
  state,
  dispatch,
  compact = false,
  onClearDrawing
}: DrawingToolbarProps) {
  const toolbarRef = useRef<HTMLElement | null>(null);
  const collapseTimer = useRef<number | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  useFooterToolbarBoundary(toolbarRef, !state.isToolbarCollapsed);
  const dragHandlers = useToolbarDrag(
    toolbarRef,
    state.toolbarPosition,
    dispatch,
    false
  );

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
  const positionStyle = state.toolbarPosition
    ? {
        left: state.toolbarPosition.x,
        top: state.toolbarPosition.y,
        bottom: 'auto',
        transform: 'scale(var(--toolbar-scale))',
        transformOrigin: 'top left'
      }
    : undefined;

  return (
    <section
      ref={toolbarRef}
      className={`${styles.toolbar} ${compact ? styles.toolbarCompact : ''} ${
        isCollapsing ? styles.toolbarCollapsing : ''
      }`}
      style={positionStyle}
      role="toolbar"
      aria-label="Drawing tools"
      data-drawing-exclusion
      data-cursor="pointer"
      data-testid="drawing-toolbar"
    >
      <button
        type="button"
        className={styles.dragHandle}
        aria-label="Move drawing toolbar"
        data-tooltip="Drag toolbar · double-click to reset"
        data-cursor="grab"
        {...dragHandlers}
      >
        <span className={styles.dragDots} aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} />
          ))}
        </span>
      </button>

      <div className={styles.toolButtons}>
        {(['pencil', 'pen', 'highlighter', 'eraser'] as const).map((tool) => (
          <ToolButton
            key={tool}
            tool={tool}
            selected={state.activeTool === tool}
            onSelect={selectTool}
          />
        ))}
      </div>

      <span className={styles.divider} aria-hidden="true" />
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

      <div className={styles.actionButtons}>
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
      </div>

      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        className={`${styles.iconButton} ${styles.eyeButton}`}
        aria-label={state.isDrawingVisible ? 'Hide drawing' : 'Show drawing'}
        aria-pressed={!state.isDrawingVisible}
        data-tooltip={state.isDrawingVisible ? 'Hide drawing' : 'Show drawing'}
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
      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        className={`${styles.iconButton} ${styles.collapseButton}`}
        aria-label="Collapse tools"
        data-tooltip="Collapse tools"
        onClick={collapse}
      >
        <CollapseIcon />
      </button>
    </section>
  );
}
