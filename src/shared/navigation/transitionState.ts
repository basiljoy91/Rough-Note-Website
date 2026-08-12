export const PAGE_TURN_ARRIVAL_KEY = 'rough-note-page-note-arrival';
export const PAGE_TURN_SETTLED_EVENT = 'rough-note:route-settled';

export const isTransitionPreviewDocument = () =>
  window.name === 'rough-note-transition-preview' ||
  (window.frameElement?.classList.contains('rn-page-turn__destination') ?? false);

/**
 * Runs before React mounts so destination previews never start page-local
 * animation work, and real route arrivals can hold it until the curl hands off.
 */
export function prepareTransitionDocument() {
  const root = document.documentElement;

  if (isTransitionPreviewDocument()) {
    root.classList.add('rn-page-turn-preview');
    root.dataset.pageTurnState = 'preview';
    return;
  }

  try {
    if (window.sessionStorage.getItem(PAGE_TURN_ARRIVAL_KEY)) {
      root.dataset.pageTurnArrival = 'pending';
    } else {
      delete root.dataset.pageTurnArrival;
    }
  } catch {
    delete root.dataset.pageTurnArrival;
  }
}
