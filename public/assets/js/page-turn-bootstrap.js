(() => {
  const root = document.documentElement;
  const key = 'rough-note-page-note-arrival';
  let preview = window.name === 'rough-note-transition-preview';
  try {
    preview =
      preview ||
      Boolean(
        window.frameElement?.classList.contains('rn-page-turn__destination')
      );
  } catch {
    // Cross-origin frames are intentionally ignored.
  }
  if (preview) {
    root.classList.add('rn-page-turn-preview');
    root.dataset.pageTurnState = 'preview';
    return;
  }
  try {
    if (window.sessionStorage.getItem(key)) {
      root.dataset.pageTurnArrival = 'pending';
    }
  } catch {
    // Storage may be disabled; page navigation still works without the hint.
  }
})();
