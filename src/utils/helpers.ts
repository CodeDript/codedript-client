// Zoom control utility
export const initZoomControl = (): void => {
  // Prevent keyboard zoom (Ctrl/Cmd + +/-)
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')
    ) {
      e.preventDefault();
    }
  });

  // Prevent trackpad/mouse wheel zoom
  document.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Monitor and enforce zoom limits
  const checkZoom = (): void => {
    const visualViewport = window.visualViewport;
    
    if (visualViewport) {
      const scale = visualViewport.scale;
      
      // If zoom is outside acceptable range, try to reset
      if (scale < 0.75 || scale > 1.25) {
        // Attempt to reset viewport
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0, minimum-scale=0.75, maximum-scale=1.25, user-scalable=yes'
          );
        }
      }
    }
  };

  // Check zoom periodically
  setInterval(checkZoom, 100);
  
  // Check on resize
  window.addEventListener('resize', checkZoom);
  
  // Initial check
  checkZoom();
};

// Format currency for blockchain transactions
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Truncate wallet address
export const truncateAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Validate Ethereum address
export const isValidEthAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
