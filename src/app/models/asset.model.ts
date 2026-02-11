export type AssetType =
  | 'real_estate'
  | 'real_estate_rental'
  | 'private_company'
  | 'stocks'
  | 'bonds'
  | 'cash'
  | 'crypto'
  | 'life_insurance'
  | 'retirement'
  | 'art'
  | 'wine'
  | 'other';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  acquisitionCost?: number;
  currency: string;
  acquisitionDate: string;
  description?: string;
  location?: string;
  rentalYield?: number;
  shares?: number;
}

export interface AssetCategory {
  type: AssetType;
  label: string;
  icon: string;
  color: string;
}

export interface AssetBreakdown {
  type: AssetType;
  label: string;
  value: number;
  percent: number;
  color: string;
}

export interface AssetsData {
  assets: Asset[];
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  { type: 'real_estate', label: 'Résidence principale', icon: 'home', color: '#4CAF50' },
  { type: 'real_estate_rental', label: 'Immobilier locatif', icon: 'apartment', color: '#66BB6A' },
  { type: 'private_company', label: 'Société non cotée', icon: 'business', color: '#1976D2' },
  { type: 'stocks', label: 'Actions cotées', icon: 'trending_up', color: '#2196F3' },
  { type: 'bonds', label: 'Obligations', icon: 'account_balance', color: '#9C27B0' },
  { type: 'cash', label: 'Liquidités', icon: 'payments', color: '#FF9800' },
  { type: 'crypto', label: 'Crypto-monnaies', icon: 'currency_bitcoin', color: '#F44336' },
  { type: 'life_insurance', label: 'Assurance-vie', icon: 'security', color: '#00BCD4' },
  { type: 'retirement', label: 'Épargne retraite', icon: 'elderly', color: '#795548' },
  { type: 'art', label: "Œuvres d'art", icon: 'palette', color: '#E91E63' },
  { type: 'wine', label: "Vin d'investissement", icon: 'wine_bar', color: '#8E24AA' },
  { type: 'other', label: 'Autres', icon: 'category', color: '#607D8B' },
];

export function getAssetCategory(type: AssetType): AssetCategory {
  return ASSET_CATEGORIES.find(c => c.type === type) ?? ASSET_CATEGORIES[ASSET_CATEGORIES.length - 1];
}
