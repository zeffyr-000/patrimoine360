import { PATRIMOINE_CONFIG } from '../constants/patrimoine.constants';

export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat(PATRIMOINE_CONFIG.currency.locale, {
    style: 'currency',
    currency: PATRIMOINE_CONFIG.currency.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  // Replace thin non-breaking spaces with regular non-breaking spaces for better readability
  return formatted.replace(/\s/g, '\u00A0');
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(PATRIMOINE_CONFIG.currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2).replace('.', ',')}M€`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k€`;
  }
  return formatCurrency(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(PATRIMOINE_CONFIG.date.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}
