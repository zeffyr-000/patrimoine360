export const ACTION_STATUS_ICONS: Record<string, string> = {
  completed: 'check_circle',
  in_progress: 'schedule',
  planned: 'event',
} as const;

export const ACTION_TYPE_ICONS: Record<string, string> = {
  buy: 'add_shopping_cart',
  sell: 'sell',
  rebalance: 'balance',
  advice: 'lightbulb',
  tax_optimization: 'savings',
} as const;

export const DEFAULT_ICON = 'help';
