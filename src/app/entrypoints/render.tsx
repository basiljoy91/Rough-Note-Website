import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import '../styles/globals.css';

export function renderPage(page: ReactNode) {
  const mount = document.getElementById('app');
  if (!mount) {
    throw new Error('Page mount #app was not found.');
  }
  createRoot(mount).render(page);
}
