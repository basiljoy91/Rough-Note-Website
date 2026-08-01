import type {
  DrawingPreferences,
  DrawingState,
  DrawingTool,
  ToolSizes
} from './types/drawing';

export const DRAWING_SCHEMA_VERSION = 1 as const;
export const MAX_HISTORY_ACTIONS = 80;

export const DRAWING_COLORS = [
  { name: 'Black', value: '#252421' },
  { name: 'Blue', value: '#3479cf' },
  { name: 'Red', value: '#e34a36' },
  { name: 'Yellow', value: '#f4c52b' },
  { name: 'Green', value: '#39a56a' },
  { name: 'Purple', value: '#8657be' }
] as const;

export const DEFAULT_TOOL_SIZES: ToolSizes = {
  pencil: 4,
  pen: 4,
  highlighter: 20,
  eraser: 28
};

export const TOOL_SIZE_RANGES: Record<DrawingTool, { min: number; max: number }> = {
  pencil: { min: 1, max: 12 },
  pen: { min: 1, max: 16 },
  highlighter: { min: 8, max: 40 },
  eraser: { min: 8, max: 60 }
};

export const TOOL_OPACITY = {
  pencil: 0.82,
  pen: 1,
  highlighter: 0.32
} as const;

export const DEFAULT_PREFERENCES: DrawingPreferences = {
  activeTool: 'pencil',
  selectedColor: DRAWING_COLORS[0].value,
  toolSizes: DEFAULT_TOOL_SIZES,
  toolbarPosition: null,
  isToolbarCollapsed: false,
  isDrawingVisible: true
};

export const INITIAL_DRAWING_STATE: DrawingState = {
  ...DEFAULT_PREFERENCES,
  toolSizes: { ...DEFAULT_TOOL_SIZES },
  strokes: [],
  undoStack: [],
  redoStack: [],
  interactionMode: 'draw',
  persistenceConsent: 'unknown',
  isHydrated: false
};
