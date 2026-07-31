import { createRoot, type Root } from 'react-dom/client';
import { RoughNoteDrawing } from './components/RoughNoteDrawing/RoughNoteDrawing';
import './components/RoughNoteDrawing/drawing-toolbar.module.css';

let root: Root | null = null;

export function mountRoughNoteDrawing(): void {
  if (root || document.querySelector('[data-rough-note-root]')) return;
  const host = document.createElement('div');
  host.id = 'rough-note-drawing';
  host.dataset.drawingExclusion = '';
  document.body.append(host);
  root = createRoot(host);
  root.render(<RoughNoteDrawing />);
}

export function unmountRoughNoteDrawing(): void {
  if (!root) return;
  const host = document.getElementById('rough-note-drawing');
  root.unmount();
  root = null;
  host?.remove();
}
