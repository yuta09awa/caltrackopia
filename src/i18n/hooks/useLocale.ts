import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/app/store';
import { isRTL, getDirection } from '../utils/rtl';

export interface LocaleFormatters {
  formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (date: Date | string) => string;
  formatDistance: (meters: number) => string;
}

export const useLocale = () => {
  const { t, i18n } = useTranslation();
  const { userPreferences, setUserPreferences } = useAppStore();
  
  const currentLocale = userPreferences.locale || i18n.language || 'en';
  const currentCurrency = userPreferences.currency || 'USD';
  const currentMeasurementUnit = userPreferences.measurementUnit || 'metric';

  const changeLanguage = useCallback(async (locale: string) => {
    await i18n.changeLanguage(locale);
    setUserPreferences({ locale });
  }, [i18n, setUserPreferences]);

  const setCurrency = useCallback((currency: string) => {
    setUserPreferences({ currency });
  }, [setUserPreferences]);

  const setMeasurementUnit = useCallback((unit: 'metric' | 'imperial') => {
    setUserPreferences({ measurementUnit: unit });
  }, [setUserPreferences]);

  const formatters: LocaleFormatters = useMemo(() => ({
    formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency: currentCurrency,
        ...options,
      }).format(amount);
    },

    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(currentLocale, options).format(value);
    },

    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(currentLocale, options).format(dateObj);
    },

    formatRelativeTime: (date: Date | string) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
      
      const rtf = new Intl.RelativeTimeFormat(currentLocale, { numeric: 'auto' });
      
      if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
      if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    },

    formatDistance: (meters: number) => {
      if (currentMeasurementUnit === 'imperial') {
        const miles = meters / 1609.34;
        if (miles < 0.1) {
          const feet = meters * 3.28084;
          return `${Math.round(feet)} ft`;
        }
        return `${miles.toFixed(1)} mi`;
      } else {
        if (meters < 1000) {
          return `${Math.round(meters)} m`;
        }
        return `${(meters / 1000).toFixed(1)} km`;
      }
    },
  }), [currentLocale, currentCurrency, currentMeasurementUnit]);

  return {
    t,
    currentLocale,
    currentCurrency,
    currentMeasurementUnit,
    changeLanguage,
    setCurrency,
    setMeasurementUnit,
    isRTL: isRTL(currentLocale),
    direction: getDirection(currentLocale),
    ...formatters,
  };
};
