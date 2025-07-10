import { logger } from '@/services/logging/LoggingService';

/**
 * Accessibility service for ARIA management and keyboard navigation
 */
export class AccessibilityService {
  private static instance: AccessibilityService;
  private announcements: HTMLElement | null = null;
  private focusHistory: HTMLElement[] = [];

  private constructor() {
    this.initializeLiveRegion();
    this.setupKeyboardTraps();
  }

  static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  /**
   * Initialize ARIA live region for announcements
   */
  private initializeLiveRegion(): void {
    if (typeof window === 'undefined') return;

    this.announcements = document.createElement('div');
    this.announcements.setAttribute('aria-live', 'polite');
    this.announcements.setAttribute('aria-atomic', 'true');
    this.announcements.className = 'sr-only';
    this.announcements.id = 'accessibility-announcements';
    document.body.appendChild(this.announcements);
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcements) return;

    this.announcements.setAttribute('aria-live', priority);
    this.announcements.textContent = message;

    logger.debug('Accessibility announcement', { message, priority });

    // Clear after announcement
    setTimeout(() => {
      if (this.announcements) {
        this.announcements.textContent = '';
      }
    }, 1000);
  }

  /**
   * Setup global keyboard event handlers
   */
  private setupKeyboardTraps(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('keydown', (event) => {
      // Skip links navigation (Alt + 1-9)
      if (event.altKey && event.key >= '1' && event.key <= '9') {
        this.handleSkipLink(parseInt(event.key));
        event.preventDefault();
      }

      // Escape key handling
      if (event.key === 'Escape') {
        this.handleEscape();
      }

      // Focus visible indicator for keyboard navigation
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    // Remove focus indicator on mouse use
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * Handle skip link navigation
   */
  private handleSkipLink(index: number): void {
    const skipTargets = [
      '#main-content',
      '#navigation',
      '#search',
      '#sidebar',
      '#footer'
    ];

    const targetId = skipTargets[index - 1];
    if (targetId) {
      const target = document.querySelector(targetId) as HTMLElement;
      if (target) {
        target.focus();
        this.announce(`Skipped to ${target.getAttribute('aria-label') || targetId.slice(1)}`);
      }
    }
  }

  /**
   * Handle escape key - close modals, dropdowns, etc.
   */
  private handleEscape(): void {
    // Trigger escape event that components can listen to
    const escapeEvent = new CustomEvent('accessibility:escape');
    document.dispatchEvent(escapeEvent);
  }

  /**
   * Focus management utilities
   */
  focus = {
    /**
     * Save current focus for restoration later
     */
    save: (): void => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement !== document.body) {
        this.focusHistory.push(activeElement);
      }
    },

    /**
     * Restore previously saved focus
     */
    restore: (): void => {
      const lastFocused = this.focusHistory.pop();
      if (lastFocused && document.contains(lastFocused)) {
        lastFocused.focus();
      }
    },

    /**
     * Trap focus within an element
     */
    trap: (container: HTMLElement): (() => void) => {
      const focusableElements = container.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);

      // Return cleanup function
      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    },

    /**
     * Get all focusable elements within container
     */
    getFocusableElements: (container: HTMLElement): HTMLElement[] => {
      return Array.from(container.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )) as HTMLElement[];
    }
  };

  /**
   * ARIA attribute helpers
   */
  aria = {
    /**
     * Set ARIA label with fallback
     */
    setLabel: (element: HTMLElement, label: string): void => {
      element.setAttribute('aria-label', label);
    },

    /**
     * Set ARIA described by
     */
    setDescribedBy: (element: HTMLElement, descriptionId: string): void => {
      element.setAttribute('aria-describedby', descriptionId);
    },

    /**
     * Set ARIA expanded state
     */
    setExpanded: (element: HTMLElement, expanded: boolean): void => {
      element.setAttribute('aria-expanded', expanded.toString());
    },

    /**
     * Set ARIA selected state
     */
    setSelected: (element: HTMLElement, selected: boolean): void => {
      element.setAttribute('aria-selected', selected.toString());
    },

    /**
     * Set ARIA pressed state for toggle buttons
     */
    setPressed: (element: HTMLElement, pressed: boolean): void => {
      element.setAttribute('aria-pressed', pressed.toString());
    },

    /**
     * Set ARIA live region
     */
    setLive: (element: HTMLElement, live: 'off' | 'polite' | 'assertive'): void => {
      element.setAttribute('aria-live', live);
    }
  };

  /**
   * Color contrast utilities
   */
  contrast = {
    /**
     * Check if color combination meets WCAG AA standards
     */
    checkContrast: (foreground: string, background: string): {
      ratio: number;
      level: 'AAA' | 'AA' | 'fail';
    } => {
      // Simplified contrast calculation - in production use a proper library
      const ratio = this.calculateContrastRatio(foreground, background);
      
      let level: 'AAA' | 'AA' | 'fail' = 'fail';
      if (ratio >= 7) level = 'AAA';
      else if (ratio >= 4.5) level = 'AA';

      return { ratio, level };
    },

    /**
     * Get high contrast alternative
     */
    getHighContrast: (color: string, background: string = '#ffffff'): string => {
      const contrast = this.contrast.checkContrast(color, background);
      if (contrast.level === 'fail') {
        // Return high contrast alternative
        return background === '#ffffff' ? '#000000' : '#ffffff';
      }
      return color;
    }
  };

  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified calculation - use a proper library like chroma-js in production
    // This is a placeholder implementation
    return 4.5; // Default to AA level
  }

  /**
   * Keyboard navigation helpers
   */
  keyboard = {
    /**
     * Handle arrow key navigation in lists/grids
     */
    handleArrowNavigation: (
      event: KeyboardEvent,
      items: HTMLElement[],
      currentIndex: number,
      options: {
        wrap?: boolean;
        horizontal?: boolean;
        vertical?: boolean;
      } = {}
    ): number => {
      const { wrap = true, horizontal = true, vertical = true } = options;
      let newIndex = currentIndex;

      switch (event.key) {
        case 'ArrowDown':
          if (vertical) {
            newIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
            event.preventDefault();
          }
          break;
        case 'ArrowUp':
          if (vertical) {
            newIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
            event.preventDefault();
          }
          break;
        case 'ArrowRight':
          if (horizontal) {
            newIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
            event.preventDefault();
          }
          break;
        case 'ArrowLeft':
          if (horizontal) {
            newIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
            event.preventDefault();
          }
          break;
        case 'Home':
          newIndex = 0;
          event.preventDefault();
          break;
        case 'End':
          newIndex = items.length - 1;
          event.preventDefault();
          break;
      }

      if (newIndex !== currentIndex && items[newIndex]) {
        items[newIndex].focus();
      }

      return newIndex;
    }
  };

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if user prefers high contrast
   */
  prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
}

// Export singleton instance
export const accessibility = AccessibilityService.getInstance();

// Export React hook for accessibility features
export const useAccessibility = () => {
  return accessibility;
};