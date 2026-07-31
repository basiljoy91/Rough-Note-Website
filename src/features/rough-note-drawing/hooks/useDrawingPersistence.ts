import { useCallback, useEffect, useRef, useState } from 'react';
import { DRAWING_SCHEMA_VERSION } from '../constants';
import type {
  DrawingAction,
  DrawingPreferences,
  DrawingState,
  PersistenceConsent,
  StoredDrawingState
} from '../types/drawing';
import {
  acceptDrawingStorage,
  declineDrawingStorage,
  DrawingStorageError,
  getInitialConsent,
  loadDrawing,
  loadPreferences,
  saveDrawing,
  savePreferences
} from '../utils/drawingStorage';

interface DrawingPersistence {
  consent: PersistenceConsent;
  storageError: string | null;
  acceptStorage: () => void;
  declineStorage: () => void;
  clearCurrentDrawing: () => void;
}

function getPreferences(state: DrawingState): DrawingPreferences {
  return {
    activeTool: state.activeTool,
    selectedColor: state.selectedColor,
    toolSizes: state.toolSizes,
    toolbarPosition: state.toolbarPosition,
    isToolbarCollapsed: state.isToolbarCollapsed,
    isDrawingVisible: state.isDrawingVisible
  };
}

export function useDrawingPersistence(
  state: DrawingState,
  pathname: string,
  dispatch: React.Dispatch<DrawingAction>
): DrawingPersistence {
  const [consent, setConsent] = useState<PersistenceConsent>(getInitialConsent);
  const [storageError, setStorageError] = useState<string | null>(null);
  const loadedPath = useRef<string | null>(null);
  const saveTimer = useRef<number | null>(null);
  const stateRef = useRef(state);
  const activePath = useRef(pathname);
  const sessionDocuments = useRef(
    new Map<string, DrawingState['strokes']>([[pathname, state.strokes]])
  );

  useEffect(() => {
    stateRef.current = state;
    if (activePath.current === pathname) {
      sessionDocuments.current.set(pathname, state.strokes);
    }
  }, [pathname, state]);

  useEffect(() => {
    dispatch({ type: 'SET_CONSENT', consent });
  }, [consent, dispatch]);

  useEffect(() => {
    let cancelled = false;
    const previousPath = activePath.current;
    if (previousPath !== pathname) {
      sessionDocuments.current.set(previousPath, stateRef.current.strokes);
      activePath.current = pathname;
    }
    const sessionStrokes =
      sessionDocuments.current.get(pathname) ??
      (previousPath === pathname ? stateRef.current.strokes : []);
    loadedPath.current = null;
    if (consent !== 'accepted') {
      dispatch({
        type: 'LOAD_STORED_STATE',
        state: {
          version: DRAWING_SCHEMA_VERSION,
          pathname,
          strokes: sessionStrokes,
          ...getPreferences(stateRef.current),
          updatedAt: Date.now()
        }
      });
      return;
    }

    const hydrate = async () => {
      try {
        const [drawing, preferences] = await Promise.all([
          loadDrawing(pathname),
          Promise.resolve(loadPreferences())
        ]);
        if (cancelled) return;
        const sessionStrokeIds = new Set(
          sessionStrokes.map((stroke) => stroke.id)
        );
        const mergedStrokes = drawing
          ? [
              ...drawing.strokes.filter(
                (stroke) => !sessionStrokeIds.has(stroke.id)
              ),
              ...sessionStrokes
            ]
          : sessionStrokes;
        const stateToLoad: StoredDrawingState = drawing
          ? { ...drawing, ...preferences, strokes: mergedStrokes }
          : {
              version: DRAWING_SCHEMA_VERSION,
              pathname,
              strokes: mergedStrokes,
              ...preferences,
              updatedAt: Date.now()
            };
        dispatch({ type: 'LOAD_STORED_STATE', state: stateToLoad });
        sessionDocuments.current.set(pathname, mergedStrokes);
        loadedPath.current = pathname;
        setStorageError(null);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof DrawingStorageError && error.code === 'corrupt') {
          dispatch({ type: 'LOAD_STORED_STATE', state: null });
          loadedPath.current = pathname;
          setStorageError('A damaged saved drawing was discarded.');
        } else {
          dispatch({ type: 'LOAD_STORED_STATE', state: null });
          setStorageError('Browser storage is unavailable. Notes remain temporary.');
        }
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [consent, dispatch, pathname]);

  useEffect(() => {
    if (
      consent !== 'accepted' ||
      !state.isHydrated ||
      loadedPath.current !== pathname
    ) {
      return;
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    const snapshot: StoredDrawingState = {
      version: DRAWING_SCHEMA_VERSION,
      pathname,
      strokes: state.strokes,
      ...getPreferences(state),
      updatedAt: Date.now()
    };
    saveTimer.current = window.setTimeout(() => {
      savePreferences(getPreferences(state));
      void saveDrawing(snapshot)
        .then(() => setStorageError(null))
        .catch((error: unknown) => {
          setStorageError(
            error instanceof DrawingStorageError && error.code === 'quota'
              ? 'Browser storage is full. Notes remain temporary.'
              : 'Browser storage is unavailable. Notes remain temporary.'
          );
        });
    }, 350);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [consent, pathname, state]);

  const acceptStorage = useCallback(() => {
    acceptDrawingStorage();
    setConsent('accepted');
  }, []);

  const declineStorage = useCallback(() => {
    declineDrawingStorage();
    setConsent('declined');
  }, []);

  const clearCurrentDrawing = useCallback(() => {
    const currentState = stateRef.current;
    sessionDocuments.current.set(pathname, []);
    dispatch({ type: 'CLEAR_ALL' });

    if (saveTimer.current !== null) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (consent !== 'accepted') return;

    const preferences = getPreferences(currentState);
    const clearedSnapshot: StoredDrawingState = {
      version: DRAWING_SCHEMA_VERSION,
      pathname,
      strokes: [],
      ...preferences,
      updatedAt: Date.now()
    };
    savePreferences(preferences);
    void saveDrawing(clearedSnapshot)
      .then(() => setStorageError(null))
      .catch(() => {
        setStorageError(
          'Browser storage is unavailable. Notes remain temporary.'
        );
      });
  }, [consent, dispatch, pathname]);

  return {
    consent,
    storageError,
    acceptStorage,
    declineStorage,
    clearCurrentDrawing
  };
}
