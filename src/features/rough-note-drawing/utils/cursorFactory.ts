import type { DrawingTool } from '../types/drawing';

export const CURSOR_HOTSPOTS: Record<DrawingTool, { x: number; y: number }> = {
  pencil: { x: 3, y: 29 },
  pen: { x: 3, y: 29 },
  highlighter: { x: 4, y: 28 },
  eraser: { x: 10, y: 28 }
};

export function applyDrawingCursor(tool: DrawingTool): void {
  document.documentElement.dataset.roughNoteTool = tool;
}

export function clearDrawingCursor(): void {
  delete document.documentElement.dataset.roughNoteTool;
}
