import { INITIAL_DRAWING_STATE } from '../../src/features/rough-note-drawing/constants';
import type {
  DrawingState,
  DrawingStroke
} from '../../src/features/rough-note-drawing/types/drawing';

export function createStroke(
  id = 'stroke-1',
  offset = 0
): DrawingStroke {
  return {
    id,
    tool: 'pencil',
    color: '#252421',
    size: 4,
    opacity: 0.82,
    createdAt: 1_700_000_000_000 + offset,
    anchorKey: null,
    points: [
      {
        x: 20 + offset,
        y: 30 + offset,
        pressure: 0.5,
        timestamp: 1
      },
      {
        x: 60 + offset,
        y: 70 + offset,
        pressure: 0.6,
        timestamp: 2
      }
    ]
  };
}

export function createDrawingState(
  overrides: Partial<DrawingState> = {}
): DrawingState {
  return {
    ...INITIAL_DRAWING_STATE,
    toolSizes: { ...INITIAL_DRAWING_STATE.toolSizes },
    strokes: [],
    undoStack: [],
    redoStack: [],
    ...overrides
  };
}
