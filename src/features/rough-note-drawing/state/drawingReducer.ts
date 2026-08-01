import {
  MAX_HISTORY_ACTIONS,
  TOOL_SIZE_RANGES
} from '../constants';
import type {
  DrawingAction,
  DrawingState,
  DrawingStroke
} from '../types/drawing';

function pushHistory(
  undoStack: DrawingStroke[][],
  strokes: DrawingStroke[]
): DrawingStroke[][] {
  return [...undoStack, strokes].slice(-MAX_HISTORY_ACTIONS);
}

export function drawingReducer(
  state: DrawingState,
  action: DrawingAction
): DrawingState {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, activeTool: action.tool };
    case 'SET_COLOR':
      return { ...state, selectedColor: action.color };
    case 'SET_SIZE': {
      const range = TOOL_SIZE_RANGES[action.tool];
      const size = Math.min(range.max, Math.max(range.min, action.size));
      return {
        ...state,
        toolSizes: { ...state.toolSizes, [action.tool]: size }
      };
    }
    case 'ADD_STROKE':
      return {
        ...state,
        strokes: [...state.strokes, action.stroke],
        undoStack: pushHistory(state.undoStack, state.strokes),
        redoStack: []
      };
    case 'REPLACE_STROKES':
      if (action.strokes === state.strokes) return state;
      return {
        ...state,
        strokes: action.strokes,
        undoStack: pushHistory(state.undoStack, state.strokes),
        redoStack: []
      };
    case 'CLEAR_ALL':
      if (state.strokes.length === 0) return state;
      return {
        ...state,
        strokes: [],
        undoStack: pushHistory(state.undoStack, state.strokes),
        redoStack: []
      };
    case 'UNDO': {
      const previous = state.undoStack.at(-1);
      if (!previous) return state;
      return {
        ...state,
        strokes: previous,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [state.strokes, ...state.redoStack].slice(
          0,
          MAX_HISTORY_ACTIONS
        )
      };
    }
    case 'REDO': {
      const next = state.redoStack[0];
      if (!next) return state;
      return {
        ...state,
        strokes: next,
        undoStack: pushHistory(state.undoStack, state.strokes),
        redoStack: state.redoStack.slice(1)
      };
    }
    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        isDrawingVisible: !state.isDrawingVisible,
        interactionMode: state.isDrawingVisible ? 'browse' : 'draw'
      };
    case 'SET_VISIBILITY':
      return {
        ...state,
        isDrawingVisible: action.value,
        interactionMode: action.value ? 'draw' : 'browse'
      };
    case 'SET_COLLAPSED':
      return { ...state, isToolbarCollapsed: action.value };
    case 'SET_TOOLBAR_POSITION':
      return { ...state, toolbarPosition: action.position };
    case 'SET_INTERACTION_MODE':
      return {
        ...state,
        interactionMode: state.isDrawingVisible ? action.mode : 'browse'
      };
    case 'SET_CONSENT':
      return { ...state, persistenceConsent: action.consent };
    case 'LOAD_STORED_STATE': {
      const stored = action.state;
      if (!stored) return { ...state, isHydrated: true };
      return {
        ...state,
        activeTool: stored.activeTool,
        selectedColor: stored.selectedColor,
        toolSizes: stored.toolSizes,
        toolbarPosition: stored.toolbarPosition,
        isToolbarCollapsed: stored.isToolbarCollapsed,
        isDrawingVisible: stored.isDrawingVisible,
        strokes: stored.strokes,
        undoStack: [],
        redoStack: [],
        interactionMode: stored.isDrawingVisible ? state.interactionMode : 'browse',
        isHydrated: true
      };
    }
    default:
      return state;
  }
}
