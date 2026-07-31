import { useEffect, useState } from 'react';

export interface ResponsiveDrawingUi {
  isMobile: boolean;
  isTablet: boolean;
  hasFinePointer: boolean;
}

function readResponsiveState(): ResponsiveDrawingUi {
  return {
    isMobile: window.matchMedia('(max-width: 767px)').matches,
    isTablet: window.matchMedia(
      '(min-width: 768px) and (max-width: 1180px)'
    ).matches,
    hasFinePointer: window.matchMedia('(pointer: fine)').matches
  };
}

export function useResponsiveDrawingUI(): ResponsiveDrawingUi {
  const [responsive, setResponsive] = useState(readResponsiveState);

  useEffect(() => {
    const queries = [
      window.matchMedia('(max-width: 767px)'),
      window.matchMedia('(min-width: 768px) and (max-width: 1180px)'),
      window.matchMedia('(pointer: fine)')
    ];
    const update = () => setResponsive(readResponsiveState());
    queries.forEach((query) => query.addEventListener('change', update));
    return () =>
      queries.forEach((query) => query.removeEventListener('change', update));
  }, []);

  return responsive;
}
