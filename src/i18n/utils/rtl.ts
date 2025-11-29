/**
 * RTL (Right-to-Left) Support Utilities
 * Handles language direction detection and document attribute management
 */

const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'] as const;

/**
 * Check if a locale uses RTL text direction
 */
export const isRTL = (locale: string): boolean => {
  const baseLocale = locale.split('-')[0].toLowerCase();
  return RTL_LOCALES.includes(baseLocale as any);
};

/**
 * Get text direction for a locale
 */
export const getDirection = (locale: string): 'ltr' | 'rtl' => {
  return isRTL(locale) ? 'rtl' : 'ltr';
};

/**
 * Apply direction attribute to document
 */
export const applyDirection = (locale: string): void => {
  const dir = getDirection(locale);
  document.documentElement.setAttribute('dir', dir);
};

/**
 * Get opposite direction (useful for certain UI elements)
 */
export const getOppositeDirection = (locale: string): 'ltr' | 'rtl' => {
  return isRTL(locale) ? 'ltr' : 'rtl';
};

/**
 * Check if current document is in RTL mode
 */
export const isDocumentRTL = (): boolean => {
  return document.documentElement.getAttribute('dir') === 'rtl';
};
