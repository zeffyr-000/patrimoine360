// Formatting utilities for display
import { PATRIMOINE_CONFIG } from '../constants/patrimoine.constants';

// Format number as currency with premium spacing (€)
export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat(PATRIMOINE_CONFIG.currency.locale, {
    style: 'currency',
    currency: PATRIMOINE_CONFIG.currency.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  // Remplace les espaces fines insécables par des espaces insécables normales pour meilleure lisibilité
  return formatted.replace(/\s/g, '\u00A0');
}

// Format number with French locale (without currency symbol)
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(PATRIMOINE_CONFIG.currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format currency avec style compact pour petits montants
export function formatCurrencyCompact(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2).replace('.', ',')}M€`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k€`;
  }
  return formatCurrency(value);
}

// Format percentage with specified decimals
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

// Format date with French locale
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(PATRIMOINE_CONFIG.date.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}
