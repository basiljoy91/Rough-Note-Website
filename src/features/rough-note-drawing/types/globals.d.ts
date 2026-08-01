export {};

declare global {
  interface Window {
    ROUGH_NOTE_FEATURE_FLAGS?: Record<string, boolean>;
    __roughPencilProtectedClicks?: number;
  }
}
