import { beforeEach, describe, expect, it } from 'vitest';
import {
  acceptDrawingStorage,
  clearAllDrawings,
  declineDrawingStorage,
  DrawingStorageError,
  getInitialConsent,
  isStoredDrawingState,
  loadDrawing,
  loadPreferences,
  saveDrawing,
  savePreferences
} from '../../src/features/rough-note-drawing/utils/drawingStorage';
import type { StoredDrawingState } from '../../src/features/rough-note-drawing/types/drawing';
import { createDrawingState, createStroke } from '../helpers/drawingFixtures';

function storedState(pathname: string): StoredDrawingState {
  const state = createDrawingState();
  return {
    version: 1,
    pathname,
    strokes: [createStroke(`stroke-${pathname}`)],
    activeTool: state.activeTool,
    selectedColor: state.selectedColor,
    toolSizes: state.toolSizes,
    toolbarPosition: { x: 84, y: 112 },
    isToolbarCollapsed: false,
    isDrawingVisible: true,
    updatedAt: Date.now()
  };
}

describe('drawingStorage', () => {
  beforeEach(async () => {
    await clearAllDrawings();
  });

  it('stores and restores separate vector documents per normalized route', async () => {
    const portfolio = storedState('/portfolio');
    const contact = storedState('/contact');
    await saveDrawing(portfolio);
    await saveDrawing(contact);

    await expect(loadDrawing('/portfolio')).resolves.toEqual(portfolio);
    await expect(loadDrawing('/contact')).resolves.toEqual(contact);
    await expect(loadDrawing('/missing')).resolves.toBeNull();
  });

  it('rejects corrupt or incompatible records without writing them', async () => {
    const corrupt = { ...storedState('/bad'), version: 2 };
    expect(isStoredDrawingState(corrupt)).toBe(false);
    await expect(
      saveDrawing(corrupt as unknown as StoredDrawingState)
    ).rejects.toMatchObject({ code: 'corrupt' } satisfies Partial<DrawingStorageError>);
  });

  it('keeps a declined choice session-only and an accepted choice persistent', () => {
    expect(getInitialConsent()).toBe('unknown');

    declineDrawingStorage();
    expect(getInitialConsent()).toBe('declined');
    expect(window.localStorage.length).toBe(0);

    acceptDrawingStorage();
    expect(getInitialConsent()).toBe('accepted');
    expect(window.sessionStorage.length).toBe(0);
  });

  it('persists only small preferences outside IndexedDB after consent', () => {
    const preferences = {
      ...storedState('/').toolSizes,
      pencil: 8
    };
    const state = storedState('/');
    savePreferences({
      activeTool: 'pen',
      selectedColor: '#3479cf',
      toolSizes: preferences,
      toolbarPosition: { x: 120, y: 90 },
      isToolbarCollapsed: true,
      isDrawingVisible: false
    });

    expect(loadPreferences()).toMatchObject({
      activeTool: 'pen',
      selectedColor: '#3479cf',
      toolSizes: { pencil: 8 },
      toolbarPosition: { x: 120, y: 90 },
      isToolbarCollapsed: true,
      isDrawingVisible: false
    });
    expect(
      window.localStorage.getItem('rough-note:drawing-preferences:v1')
    ).not.toContain(state.strokes[0].id);
  });
});
