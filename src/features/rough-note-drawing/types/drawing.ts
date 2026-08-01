export type DrawingTool = 'pencil' | 'pen' | 'highlighter' | 'eraser';
export type DrawingStrokeTool = Exclude<DrawingTool, 'eraser'>;
export type InteractionMode = 'draw' | 'browse';
export type PersistenceConsent = 'unknown' | 'accepted' | 'declined';

export interface DrawingPoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
  relativeX?: number;
  relativeY?: number;
}

export interface DrawingStroke {
  id: string;
  tool: DrawingStrokeTool;
  color: string;
  size: number;
  opacity: number;
  points: DrawingPoint[];
  createdAt: number;
  anchorKey: string | null;
}

export interface ToolbarPosition {
  x: number;
  y: number;
}

export type ToolSizes = Record<DrawingTool, number>;

export interface DrawingPreferences {
  activeTool: DrawingTool;
  selectedColor: string;
  toolSizes: ToolSizes;
  toolbarPosition: ToolbarPosition | null;
  isToolbarCollapsed: boolean;
  isDrawingVisible: boolean;
}

export interface DrawingState extends DrawingPreferences {
  strokes: DrawingStroke[];
  undoStack: DrawingStroke[][];
  redoStack: DrawingStroke[][];
  interactionMode: InteractionMode;
  persistenceConsent: PersistenceConsent;
  isHydrated: boolean;
}

export interface StoredDrawingState extends DrawingPreferences {
  version: 1;
  pathname: string;
  strokes: DrawingStroke[];
  updatedAt: number;
}

export type DrawingAction =
  | { type: 'SET_TOOL'; tool: DrawingTool }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_SIZE'; tool: DrawingTool; size: number }
  | { type: 'ADD_STROKE'; stroke: DrawingStroke }
  | { type: 'REPLACE_STROKES'; strokes: DrawingStroke[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_ALL' }
  | { type: 'TOGGLE_VISIBILITY' }
  | { type: 'SET_VISIBILITY'; value: boolean }
  | { type: 'SET_COLLAPSED'; value: boolean }
  | { type: 'SET_TOOLBAR_POSITION'; position: ToolbarPosition | null }
  | { type: 'SET_INTERACTION_MODE'; mode: InteractionMode }
  | { type: 'SET_CONSENT'; consent: PersistenceConsent }
  | { type: 'LOAD_STORED_STATE'; state: StoredDrawingState | null };
