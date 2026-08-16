import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { ReactNode } from 'react';
import { prepareTransitionDocument } from '../../shared/navigation/transitionState';
import '../styles/globals.css';

export function renderPage(page: ReactNode) {
  const mount = document.getElementById('app');
  if (!mount) {
    throw new Error('Page mount #app was not found.');
  }
  prepareTransitionDocument();
  const root = createRoot(mount);

  // Cross-document view transitions may capture the destination as soon as
  // its deferred module has finished evaluating. Commit the first React tree
  // inside that evaluation so the browser never snapshots an empty #app and
  // replaces it with the real page a frame later.
  flushSync(() => root.render(page));
}
