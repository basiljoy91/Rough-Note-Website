const FEATURE_NAME = 'roughPencil';
const ROOT_ID = 'rough-note-drawing';
const BUNDLE_VERSION = '2026.07.29.3';

/**
 * @returns {boolean}
 */
export function isRoughPencilEnabled() {
  return window.ROUGH_NOTE_FEATURE_FLAGS?.[FEATURE_NAME] !== false;
}

/**
 * Adds the cursor synchronously, before the lazy React drawing engine arrives.
 */
export function applyInitialRoughPencilCursor() {
  if (!isRoughPencilEnabled()) return;
  document.documentElement.dataset.roughNoteTool = 'pencil';
  document.documentElement.dataset.roughNoteInteraction = 'draw';
}

/**
 * @returns {boolean}
 */
function isCinematicIntro() {
  return (
    document.body.classList.contains('no-scroll') &&
    Boolean(document.getElementById('preloader'))
  );
}

/**
 * @returns {Promise<void>}
 */
async function loadDrawingIsland() {
  if (document.getElementById(ROOT_ID)) return;

  const stylesheetUrl = new URL(
    './rough-pencil-dist/rough-pencil.css',
    import.meta.url
  );
  stylesheetUrl.searchParams.set('v', BUNDLE_VERSION);
  const stylesheetHref = stylesheetUrl.href;
  if (!document.querySelector(`link[href="${stylesheetHref}"]`)) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = stylesheetHref;
    stylesheet.dataset.roughPencilStyles = '';
    document.head.append(stylesheet);
  }

  const moduleUrl = new URL(
    './rough-pencil-dist/rough-pencil.js',
    import.meta.url
  );
  moduleUrl.searchParams.set('v', BUNDLE_VERSION);
  const module = await import(/* @vite-ignore */ moduleUrl.href);
  module.mountRoughNoteDrawing();
}

/**
 * @returns {void}
 */
export function bootstrapRoughPencil() {
  applyInitialRoughPencilCursor();
  if (!isRoughPencilEnabled() || isCinematicIntro()) return;

  void loadDrawingIsland().catch((error) => {
    console.error(
      'Rough Pencil could not be loaded. The website remains available.',
      error
    );
    document.documentElement.removeAttribute('data-rough-note-interaction');
  });
}

applyInitialRoughPencilCursor();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapRoughPencil, {
    once: true
  });
} else {
  bootstrapRoughPencil();
}
