// Utility functions for patrimoine data manipulation and helpers
import { ACTION_STATUS_ICONS, ACTION_TYPE_ICONS, DEFAULT_ICON } from '../constants/icons.constants';

// Get icon for action status
export function getActionStatusIcon(status: string): string {
  return ACTION_STATUS_ICONS[status] ?? DEFAULT_ICON;
}

// Get icon for action type
export function getActionTypeIcon(type: string): string {
  return ACTION_TYPE_ICONS[type] ?? DEFAULT_ICON;
}

// Check if a value represents a gain (positive)
export function isGain(value: number): boolean {
  return value >= 0;
}

// Calculate percentage change between two values
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
