import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, formatDate } from './format.utils';

describe('format.utils', () => {
  describe('formatCurrency', () => {
    it('should format number as EUR currency without decimals', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('1');
      expect(result).toContain('000');
      expect(result).toContain('€');
    });

    it('should format large numbers with separators', () => {
      const result = formatCurrency(1500000);
      expect(result).toContain('1');
      expect(result).toContain('500');
      expect(result).toContain('000');
      expect(result).toContain('€');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
      expect(result).toContain('€');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-5000);
      expect(result).toContain('-');
      expect(result).toContain('5');
      expect(result).toContain('000');
      expect(result).toContain('€');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with 2 decimals by default', () => {
      expect(formatPercent(5.14)).toBe('5.14%');
    });

    it('should format percentage with custom decimals', () => {
      expect(formatPercent(5.14789, 3)).toBe('5.148%');
    });

    it('should handle negative percentages', () => {
      expect(formatPercent(-2.5)).toBe('-2.50%');
    });
  });

  describe('formatDate', () => {
    it('should format Date object', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('janvier');
      expect(formatted).toContain('2024');
    });

    it('should format date string', () => {
      const formatted = formatDate('2024-06-20');
      expect(formatted).toContain('juin');
      expect(formatted).toContain('2024');
    });
  });
});
