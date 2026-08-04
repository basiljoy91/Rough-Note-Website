import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ScheduleSuccessPage } from '../../pages/schedule/ScheduleSuccessPage';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <ScheduleSuccessPage />
  </StrictMode>
);
