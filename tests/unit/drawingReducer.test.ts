import { describe, expect, it } from 'vitest';
import { drawingReducer } from '../../src/features/rough-note-drawing/state/drawingReducer';
import { createDrawingState, createStroke } from '../helpers/drawingFixtures';

describe('drawingReducer', () => {
  it('selects tools and remembers a separate width for each one', () => {
    let state = createDrawingState();
    state = drawingReducer(state, { type: 'SET_SIZE', tool: 'pencil', size: 7 });
    state = drawingReducer(state, { type: 'SET_TOOL', tool: 'highlighter' });
    state = drawingReducer(state, {
      type: 'SET_SIZE',
      tool: 'highlighter',
      size: 32
    });
    state = drawingReducer(state, { type: 'SET_TOOL', tool: 'pencil' });

    expect(state.activeTool).toBe('pencil');
    expect(state.toolSizes.pencil).toBe(7);
    expect(state.toolSizes.highlighter).toBe(32);
  });

  it('clamps widths to the selected tool range', () => {
    const state = drawingReducer(createDrawingState(), {
      type: 'SET_SIZE',
      tool: 'pencil',
      size: 99
    });
    expect(state.toolSizes.pencil).toBe(12);
  });

  it('adds, undoes and redoes a completed stroke', () => {
    const stroke = createStroke();
    let state = drawingReducer(createDrawingState(), {
      type: 'ADD_STROKE',
      stroke
    });
    expect(state.strokes).toEqual([stroke]);

    state = drawingReducer(state, { type: 'UNDO' });
    expect(state.strokes).toEqual([]);
    expect(state.redoStack).toEqual([[stroke]]);

    state = drawingReducer(state, { type: 'REDO' });
    expect(state.strokes).toEqual([stroke]);
  });

  it('makes clear-all one undoable action', () => {
    const strokes = [createStroke('one'), createStroke('two', 10)];
    let state = createDrawingState({ strokes });
    state = drawingReducer(state, { type: 'CLEAR_ALL' });
    expect(state.strokes).toEqual([]);

    state = drawingReducer(state, { type: 'UNDO' });
    expect(state.strokes).toEqual(strokes);
  });

  it('switches to browse mode when drawings are hidden', () => {
    let state = drawingReducer(createDrawingState(), {
      type: 'TOGGLE_VISIBILITY'
    });
    expect(state.isDrawingVisible).toBe(false);
    expect(state.interactionMode).toBe('browse');
    state = drawingReducer(state, { type: 'TOGGLE_VISIBILITY' });
    expect(state.isDrawingVisible).toBe(true);
    expect(state.interactionMode).toBe('draw');
  });
});
