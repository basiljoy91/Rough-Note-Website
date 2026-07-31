import { createRoot, type Root } from 'react-dom/client';
import { FooterPaper } from './components/FooterPaper';
import './components/notebook-footer.module.css';

let footerRoot: Root | null = null;

export function mountNotebookFooter(): void {
  const host = document.getElementById('rough-note-footer-root');
  if (!host || footerRoot || host.querySelector('[data-rough-anchor="notebook-footer"]')) {
    return;
  }
  footerRoot = createRoot(host);
  footerRoot.render(<FooterPaper />);
}

export function unmountNotebookFooter(): void {
  if (!footerRoot) return;
  footerRoot.unmount();
  footerRoot = null;
}
