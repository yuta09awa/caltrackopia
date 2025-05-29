
import { useMemo } from 'react';

interface CurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const useCurrency = (options: CurrencyOptions = {}) => {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    });
  }, [currency, locale, minimumFractionDigits, maximumFractionDigits]);

  const format = useMemo(() => {
    return (amount: number): string => {
      if (isNaN(amount)) return formatter.format(0);
      return formatter.format(amount);
    };
  }, [formatter]);

  const formatCompact = useMemo(() => {
    const compactFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    
    return (amount: number): string => {
      if (isNaN(amount)) return compactFormatter.format(0);
      return compactFormatter.format(amount);
    };
  }, [currency, locale]);

  return {
    format,
    formatCompact,
    currency,
    locale
  };
};
