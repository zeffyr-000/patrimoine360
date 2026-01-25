import { describe, it, expect } from 'vitest';
import { getActionStatusIcon, getActionTypeIcon, isGain, calculatePercentChange } from './patrimoine.utils';

describe('patrimoine.utils', () => {
  describe('getActionStatusIcon', () => {
    it('should return correct icon for completed status', () => {
      expect(getActionStatusIcon('completed')).toBe('check_circle');
    });

    it('should return correct icon for in_progress status', () => {
      expect(getActionStatusIcon('in_progress')).toBe('schedule');
    });

    it('should return correct icon for planned status', () => {
      expect(getActionStatusIcon('planned')).toBe('event');
    });

    it('should return default icon for unknown status', () => {
      expect(getActionStatusIcon('unknown')).toBe('help');
    });
  });

  describe('getActionTypeIcon', () => {
    it('should return correct icon for buy type', () => {
      expect(getActionTypeIcon('buy')).toBe('add_shopping_cart');
    });

    it('should return correct icon for rebalance type', () => {
      expect(getActionTypeIcon('rebalance')).toBe('balance');
    });

    it('should return correct icon for tax_optimization type', () => {
      expect(getActionTypeIcon('tax_optimization')).toBe('savings');
    });

    it('should return default icon for unknown type', () => {
      expect(getActionTypeIcon('unknown')).toBe('help');
    });
  });

  describe('isGain', () => {
    it('should return true for positive value', () => {
      expect(isGain(100)).toBe(true);
    });

    it('should return true for zero', () => {
      expect(isGain(0)).toBe(true);
    });

    it('should return false for negative value', () => {
      expect(isGain(-50)).toBe(false);
    });
  });

  describe('calculatePercentChange', () => {
    it('should calculate percent increase', () => {
      expect(calculatePercentChange(110, 100)).toBe(10);
    });

    it('should calculate percent decrease', () => {
      expect(calculatePercentChange(90, 100)).toBe(-10);
    });

    it('should return 0 when previous is 0', () => {
      expect(calculatePercentChange(100, 0)).toBe(0);
    });

    it('should handle no change', () => {
      expect(calculatePercentChange(100, 100)).toBe(0);
    });
  });
});
