
import { useMemo, useCallback } from 'react';
import { useAppStore } from '@/app/store';

interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number; // Exchange rate from USD
}

interface LocaleConfig {
  code: string;
  currency: CurrencyConfig;
  taxRate: number;
  tipSuggestions: number[];
}

const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  'en-US': {
    code: 'en-US',
    currency: { code: 'USD', symbol: '$', rate: 1 },
    taxRate: 0.08,
    tipSuggestions: [0.15, 0.18, 0.20, 0.25]
  },
  'en-CA': {
    code: 'en-CA',
    currency: { code: 'CAD', symbol: 'C$', rate: 1.35 },
    taxRate: 0.13,
    tipSuggestions: [0.15, 0.18, 0.20]
  },
  'en-GB': {
    code: 'en-GB',
    currency: { code: 'GBP', symbol: '£', rate: 0.79 },
    taxRate: 0.20,
    tipSuggestions: [0.10, 0.12, 0.15]
  },
  'es-ES': {
    code: 'es-ES',
    currency: { code: 'EUR', symbol: '€', rate: 0.85 },
    taxRate: 0.21,
    tipSuggestions: [0.05, 0.10, 0.15]
  }
};

export const useInternationalization = () => {
  const { userPreferences } = useAppStore();
  
  const currentLocale = useMemo(() => {
    const browserLocale = navigator.language || 'en-US';
    const savedLocale = localStorage.getItem('user-locale');
    const locale = savedLocale || browserLocale;
    
    return SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES['en-US'];
  }, []);

  const formatCurrency = useCallback((amount: number, options?: {
    showCurrencyCode?: boolean;
    compact?: boolean;
  }) => {
    const { showCurrencyCode = false, compact = false } = options || {};
    const convertedAmount = amount * currentLocale.currency.rate;
    
    const formatter = new Intl.NumberFormat(currentLocale.code, {
      style: 'currency',
      currency: currentLocale.currency.code,
      notation: compact ? 'compact' : 'standard',
      minimumFractionDigits: compact ? 0 : 2,
      maximumFractionDigits: compact ? 1 : 2
    });

    let formatted = formatter.format(convertedAmount);
    
    if (showCurrencyCode && !compact) {
      formatted += ` ${currentLocale.currency.code}`;
    }
    
    return formatted;
  }, [currentLocale]);

  const formatNumber = useCallback((num: number) => {
    return new Intl.NumberFormat(currentLocale.code).format(num);
  }, [currentLocale]);

  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(currentLocale.code, options).format(date);
  }, [currentLocale]);

  const calculateTax = useCallback((amount: number) => {
    return amount * currentLocale.taxRate;
  }, [currentLocale]);

  const calculateTip = useCallback((amount: number, tipPercentage: number) => {
    return amount * tipPercentage;
  }, []);

  const getTipSuggestions = useCallback(() => {
    return currentLocale.tipSuggestions;
  }, [currentLocale]);

  const setLocale = useCallback((localeCode: string) => {
    if (SUPPORTED_LOCALES[localeCode]) {
      localStorage.setItem('user-locale', localeCode);
      window.location.reload(); // Simple refresh to apply new locale
    }
  }, []);

  return {
    currentLocale,
    formatCurrency,
    formatNumber,
    formatDate,
    calculateTax,
    calculateTip,
    getTipSuggestions,
    setLocale,
    supportedLocales: Object.keys(SUPPORTED_LOCALES)
  };
};
