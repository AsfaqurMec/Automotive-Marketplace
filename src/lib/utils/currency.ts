export type SupportedCurrency = 'USD' | 'BDT' | 'INR';

// Base currency is USD; rates are relative to USD.
// You can later replace this with a live rates fetcher.
export const USD_BASE_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  BDT: 120, // Bangladeshi Taka (approx placeholder)
  INR: 84,  // Indian Rupee (approx placeholder)
};

export const CURRENCY_SYMBOL: Record<SupportedCurrency, string> = {
  USD: '$',
  BDT: '৳',
  INR: '₹',
};

export const CURRENCY_CODE_TO_LOCALE: Record<SupportedCurrency, string> = {
  USD: 'en-US',
  BDT: 'bn-BD',
  INR: 'en-IN',
};

export function convertFromUsd(amountInUsd: number, to: SupportedCurrency, rates: Record<SupportedCurrency, number> = USD_BASE_RATES): number {
  if (!Number.isFinite(amountInUsd)) return 0;
  const rate = rates[to] ?? 1;
  return amountInUsd * rate;
}

export function formatCurrency(amount: number, currency: SupportedCurrency): string {
  try {
    const locale = CURRENCY_CODE_TO_LOCALE[currency] ?? 'en-US';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    // Fallback simple formatting
    const symbol = CURRENCY_SYMBOL[currency] ?? '$';
    return `${symbol}${amount.toFixed(2)}`;
  }
}

export function roundForDisplay(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  // Round to 0 for very large numbers in BDT/INR if desired; keep simple 2 decimals here
  return Math.round(amount * 100) / 100;
}


