// Centralized spacing constants matching current implementation
export const SPACING = {
  // Container horizontal padding (responsive)
  container: {
    base: '1rem',      // 16px (px-4)
    sm: '1.5rem',      // 24px (sm:px-6)
    md: '2rem',        // 32px (md:px-8)
  },
  
  // Navbar spacing
  navbar: {
    py: '0.5rem',      // 8px (py-2)
  },
  
  // Hero section spacing
  hero: {
    pt: '5rem',        // 80px (pt-20)
    pb: '5rem',        // 80px (pb-20)
  },
  
  // Section spacing
  section: {
    py: '5rem',        // 80px (py-20)
  },
  
  // Sidebar header spacing
  sidebar: {
    px: '0.75rem',     // 12px (px-3)
    pt: '1.5rem',      // 24px (pt-6)
    pb: '1rem',        // 16px (pb-4)
    innerPx: '0.25rem', // 4px (px-1)
  },
  
  // Edge-aligned override
  edge: {
    px: '1rem',        // 16px (px-4) - used with size="full"
  }
} as const;
