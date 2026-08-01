import {
  DEFAULT_PREFERENCES,
  DRAWING_COLORS,
  DRAWING_SCHEMA_VERSION,
  TOOL_SIZE_RANGES
} from '../constants';
import type {
  DrawingPoint,
  DrawingPreferences,
  DrawingStroke,
  DrawingTool,
  PersistenceConsent,
  StoredDrawingState
} from '../types/drawing';

const DATABASE_NAME = 'rough-note-drawing';
const STORE_NAME = 'drawings';
const DATABASE_VERSION = 1;
const CONSENT_KEY = 'rough-note:drawing-consent:v1';
const SESSION_DECLINE_KEY = 'rough-note:drawing-consent-declined:v1';
const PREFERENCES_KEY = 'rough-note:drawing-preferences:v1';

export class DrawingStorageError extends Error {
  constructor(
    public readonly code:
      | 'unavailable'
      | 'quota'
      | 'corrupt'
      | 'transaction',
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'DrawingStorageError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isTool(value: unknown): value is DrawingTool {
  return (
    value === 'pencil' ||
    value === 'pen' ||
    value === 'highlighter' ||
    value === 'eraser'
  );
}

function isPoint(value: unknown): value is DrawingPoint {
  if (!isRecord(value)) return false;
  const relativeCoordinatesAreValid =
    (value.relativeX === undefined && value.relativeY === undefined) ||
    (isFiniteNumber(value.relativeX) && isFiniteNumber(value.relativeY));
  return (
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.pressure) &&
    value.pressure >= 0 &&
    value.pressure <= 1 &&
    isFiniteNumber(value.timestamp) &&
    relativeCoordinatesAreValid
  );
}

function isStroke(value: unknown): value is DrawingStroke {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    (value.tool === 'pencil' ||
      value.tool === 'pen' ||
      value.tool === 'highlighter') &&
    typeof value.color === 'string' &&
    /^#[0-9a-f]{6}$/i.test(value.color) &&
    isFiniteNumber(value.size) &&
    value.size >= 1 &&
    value.size <= 60 &&
    isFiniteNumber(value.opacity) &&
    value.opacity >= 0 &&
    value.opacity <= 1 &&
    isFiniteNumber(value.createdAt) &&
    (value.anchorKey === null || typeof value.anchorKey === 'string') &&
    Array.isArray(value.points) &&
    value.points.length > 0 &&
    value.points.length <= 50_000 &&
    value.points.every(isPoint)
  );
}

function isToolSizes(value: unknown): value is DrawingPreferences['toolSizes'] {
  if (!isRecord(value)) return false;
  return (['pencil', 'pen', 'highlighter', 'eraser'] as const).every((tool) => {
    const range = TOOL_SIZE_RANGES[tool];
    return (
      isFiniteNumber(value[tool]) &&
      value[tool] >= range.min &&
      value[tool] <= range.max
    );
  });
}

export function isStoredDrawingState(
  value: unknown
): value is StoredDrawingState {
  if (!isRecord(value)) return false;
  return (
    value.version === DRAWING_SCHEMA_VERSION &&
    typeof value.pathname === 'string' &&
    value.pathname.startsWith('/') &&
    Array.isArray(value.strokes) &&
    value.strokes.length <= 10_000 &&
    value.strokes.every(isStroke) &&
    isTool(value.activeTool) &&
    typeof value.selectedColor === 'string' &&
    DRAWING_COLORS.some((color) => color.value === value.selectedColor) &&
    isToolSizes(value.toolSizes) &&
    (value.toolbarPosition === null ||
      (isRecord(value.toolbarPosition) &&
        isFiniteNumber(value.toolbarPosition.x) &&
        isFiniteNumber(value.toolbarPosition.y))) &&
    typeof value.isToolbarCollapsed === 'boolean' &&
    typeof value.isDrawingVisible === 'boolean' &&
    isFiniteNumber(value.updatedAt)
  );
}

function toStorageError(error: unknown): DrawingStorageError {
  if (error instanceof DrawingStorageError) return error;
  if (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  ) {
    return new DrawingStorageError('quota', 'Browser drawing storage is full.', {
      cause: error
    });
  }
  return new DrawingStorageError(
    'transaction',
    'Browser drawing storage failed.',
    { cause: error }
  );
}

let databasePromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;
  if (!window.indexedDB) {
    return Promise.reject(
      new DrawingStorageError('unavailable', 'IndexedDB is unavailable.')
    );
  }

  databasePromise = new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    } catch (error) {
      reject(
        new DrawingStorageError('unavailable', 'IndexedDB could not open.', {
          cause: error
        })
      );
      return;
    }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        const store = request.result.createObjectStore(STORE_NAME, {
          keyPath: 'pathname'
        });
        store.createIndex('updatedAt', 'updatedAt');
      }
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => {
        request.result.close();
        databasePromise = null;
      };
      resolve(request.result);
    };
    request.onerror = () => {
      databasePromise = null;
      reject(
        new DrawingStorageError('unavailable', 'IndexedDB could not open.', {
          cause: request.error
        })
      );
    };
    request.onblocked = () => {
      databasePromise = null;
      reject(
        new DrawingStorageError('unavailable', 'IndexedDB is blocked.')
      );
    };
  });
  return databasePromise;
}

async function runRequest<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    try {
      const transaction = database.transaction(STORE_NAME, mode);
      const request = operation(transaction.objectStore(STORE_NAME));
      let result: T | undefined;
      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => reject(toStorageError(request.error));
      transaction.oncomplete = () => resolve(result as T);
      transaction.onerror = () => reject(toStorageError(transaction.error));
      transaction.onabort = () => reject(toStorageError(transaction.error));
    } catch (error) {
      reject(toStorageError(error));
    }
  });
}

export async function loadDrawing(
  pathname: string
): Promise<StoredDrawingState | null> {
  const value = await runRequest<unknown>('readonly', (store) =>
    store.get(pathname)
  );
  if (value === undefined) return null;
  if (!isStoredDrawingState(value)) {
    try {
      await deleteDrawing(pathname);
    } catch {
      // Corrupt-data cleanup is best effort.
    }
    throw new DrawingStorageError(
      'corrupt',
      'A corrupt drawing record was discarded.'
    );
  }
  return value;
}

export async function saveDrawing(
  drawing: StoredDrawingState
): Promise<void> {
  if (!isStoredDrawingState(drawing)) {
    throw new DrawingStorageError('corrupt', 'Invalid drawing data was rejected.');
  }
  await runRequest('readwrite', (store) => store.put(drawing));
}

export async function deleteDrawing(pathname: string): Promise<void> {
  await runRequest('readwrite', (store) => store.delete(pathname));
}

export async function clearAllDrawings(): Promise<void> {
  await runRequest('readwrite', (store) => store.clear());
}

export function getInitialConsent(): PersistenceConsent {
  try {
    if (window.localStorage.getItem(CONSENT_KEY) === 'accepted') return 'accepted';
    if (window.sessionStorage.getItem(SESSION_DECLINE_KEY) === 'declined') {
      return 'declined';
    }
  } catch {
    return 'unknown';
  }
  return 'unknown';
}

export function acceptDrawingStorage(): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, 'accepted');
    window.sessionStorage.removeItem(SESSION_DECLINE_KEY);
  } catch {
    // Consent still applies to the current runtime when storage is blocked.
  }
}

export function declineDrawingStorage(): void {
  try {
    window.sessionStorage.setItem(SESSION_DECLINE_KEY, 'declined');
  } catch {
    // The prompt component also remembers this choice in React state.
  }
}

export function loadPreferences(): DrawingPreferences {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(PREFERENCES_KEY) ?? 'null'
    );
    if (!isRecord(parsed)) return { ...DEFAULT_PREFERENCES };
    const candidate = {
      version: 1,
      pathname: '/',
      strokes: [],
      updatedAt: Date.now(),
      ...parsed
    };
    if (isStoredDrawingState(candidate)) {
      return {
        activeTool: candidate.activeTool,
        selectedColor: candidate.selectedColor,
        toolSizes: candidate.toolSizes,
        toolbarPosition: candidate.toolbarPosition,
        isToolbarCollapsed: candidate.isToolbarCollapsed,
        isDrawingVisible: candidate.isDrawingVisible
      };
    }
  } catch {
    // Invalid preferences use defaults.
  }
  return { ...DEFAULT_PREFERENCES, toolSizes: { ...DEFAULT_PREFERENCES.toolSizes } };
}

export function savePreferences(preferences: DrawingPreferences): void {
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Preferences are optional and quota-safe.
  }
}
