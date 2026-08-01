import { createRoot, type Root } from 'react-dom/client';
import { ContactJourney } from './ContactJourney';

const ROOT_ID = 'rough-note-contact-root';
let root: Root | null = null;

export function mountRoughNoteContact() {
  const host = document.getElementById(ROOT_ID);
  if (!host || root) return;
  root = createRoot(host);
  root.render(<ContactJourney />);
}

export function unmountRoughNoteContact() {
  root?.unmount();
  root = null;
}
