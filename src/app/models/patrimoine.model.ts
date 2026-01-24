/**
 * Modèles de données pour le patrimoine
 */

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  currency: string;
  acquisitionDate: string;
  description?: string;
}

export type AssetType =
  | 'real_estate'
  | 'stocks'
  | 'bonds'
  | 'cash'
  | 'crypto'
  | 'life_insurance'
  | 'retirement'
  | 'other';

export interface AssetCategory {
  type: AssetType;
  label: string;
  icon: string;
  color: string;
}

export interface PatrimoineSnapshot {
  date: string;
  totalValue: number;
  assets: Asset[];
}

export interface PatrimoineSummary {
  totalValue: number;
  evolution: number;
  evolutionPercent: number;
  breakdown: AssetBreakdown[];
}

export interface AssetBreakdown {
  type: AssetType;
  label: string;
  value: number;
  percent: number;
  color: string;
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  { type: 'real_estate', label: 'Immobilier', icon: 'home', color: '#4CAF50' },
  { type: 'stocks', label: 'Actions', icon: 'trending_up', color: '#2196F3' },
  { type: 'bonds', label: 'Obligations', icon: 'account_balance', color: '#9C27B0' },
  { type: 'cash', label: 'Liquidités', icon: 'payments', color: '#FF9800' },
  { type: 'crypto', label: 'Crypto-monnaies', icon: 'currency_bitcoin', color: '#F44336' },
  { type: 'life_insurance', label: 'Assurance-vie', icon: 'security', color: '#00BCD4' },
  { type: 'retirement', label: 'Épargne retraite', icon: 'elderly', color: '#795548' },
  { type: 'other', label: 'Autres', icon: 'category', color: '#607D8B' },
];

export function getAssetCategory(type: AssetType): AssetCategory {
  return ASSET_CATEGORIES.find(c => c.type === type) ?? ASSET_CATEGORIES[ASSET_CATEGORIES.length - 1];
}

export function formatCurrency(value: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}
