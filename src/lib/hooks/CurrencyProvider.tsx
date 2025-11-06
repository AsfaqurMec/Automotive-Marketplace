'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CURRENCY_SYMBOL, SupportedCurrency, USD_BASE_RATES, convertFromUsd, formatCurrency, roundForDisplay } from '../utils/currency';

type CurrencyContextType = {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  rates: Record<SupportedCurrency, number>;
  convertFromUSD: (amountUSD: number) => number;
  formatFromUSD: (amountUSD: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'nextdeal_currency_code';

export function CurrencyProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [currency, setCurrencyState] = useState<SupportedCurrency>('USD');
  const [rates] = useState<Record<SupportedCurrency, number>>(USD_BASE_RATES);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as SupportedCurrency | null;
    if (saved === 'USD' || saved === 'BDT' || saved === 'INR') {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = useCallback((c: SupportedCurrency) => {
    setCurrencyState(c);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, c);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const convertFromUSD = useCallback((amountUSD: number) => {
    return roundForDisplay(convertFromUsd(amountUSD, currency, rates));
  }, [currency, rates]);

  const formatFromUSD = useCallback((amountUSD: number) => {
    const converted = convertFromUsd(amountUSD, currency, rates);
    return formatCurrency(roundForDisplay(converted), currency);
  }, [currency, rates]);

  const value = useMemo<CurrencyContextType>(() => ({
    currency,
    setCurrency,
    rates,
    convertFromUSD,
    formatFromUSD,
    symbol: CURRENCY_SYMBOL[currency],
  }), [convertFromUSD, currency, rates, formatFromUSD]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}


