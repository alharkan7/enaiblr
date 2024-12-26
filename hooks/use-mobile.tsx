import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialize with a default value based on window width if available
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    
    // Set initial value
    setIsMobile(mql.matches);
    
    // Use the more efficient matchMedia API
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
