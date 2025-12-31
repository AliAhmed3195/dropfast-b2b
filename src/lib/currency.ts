/**
 * Currency Exchange Utilities
 * All internal calculations in USD, conversions for display only
 */

// Simple exchange rates (can be replaced with API later)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.0,
  PKR: 278.0,
  AED: 3.67,
  SAR: 3.75,
  // Add more as needed
};

/**
 * Detect currency from IP address (simplified - uses browser locale as fallback)
 * In production, use a geolocation API
 */
export function detectCurrencyFromIP(): string {
  if (typeof window !== 'undefined') {
    // Use browser locale as fallback
    const locale = navigator.language || 'en-US';
    const currencyMap: Record<string, string> = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-IN': 'INR',
      'en-PK': 'PKR',
      'en-AE': 'AED',
      'en-SA': 'SAR',
      'de-DE': 'EUR',
      'fr-FR': 'EUR',
      'es-ES': 'EUR',
    };
    
    const currency = currencyMap[locale] || 'USD';
    return currency;
  }
  return 'USD'; // Default to USD
}

/**
 * Get exchange rate from one currency to another
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();
  
  if (from === to) return 1.0;
  
  // Convert via USD
  const fromRate = EXCHANGE_RATES[from] || 1.0;
  const toRate = EXCHANGE_RATES[to] || 1.0;
  
  return toRate / fromRate;
}

/**
 * Convert amount from any currency to USD
 */
export function convertToUSD(amount: number, fromCurrency: string): number {
  if (fromCurrency.toUpperCase() === 'USD') return amount;
  
  const rate = getExchangeRate(fromCurrency, 'USD');
  return amount * rate;
}

/**
 * Convert amount from USD to any currency (for display only)
 */
export function convertFromUSD(amount: number, toCurrency: string): number {
  if (toCurrency.toUpperCase() === 'USD') return amount;
  
  const rate = getExchangeRate('USD', toCurrency);
  return amount * rate;
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    PKR: '₨',
    AED: 'د.إ',
    SAR: '﷼',
  };
  
  const symbol = currencySymbols[currency.toUpperCase()] || currency.toUpperCase();
  return `${symbol}${amount.toFixed(2)}`;
}

