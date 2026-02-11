import { ACTION_STATUS_ICONS, ACTION_TYPE_ICONS, DEFAULT_ICON } from '../constants/icons.constants';

export function getActionStatusIcon(status: string): string {
  return ACTION_STATUS_ICONS[status] ?? DEFAULT_ICON;
}

export function getActionTypeIcon(type: string): string {
  return ACTION_TYPE_ICONS[type] ?? DEFAULT_ICON;
}

export function isGain(value: number): boolean {
  return value >= 0;
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
