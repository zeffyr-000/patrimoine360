/**
 * Modèles de données pour le patrimoine
 */

// Profil client
export interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  profession: string;
  riskProfile: 'prudent' | 'équilibré' | 'dynamique';
  bankerName: string;
  bankerEmail: string;
  clientSince: string;
}

// Actifs
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  acquisitionCost?: number;
  currency: string;
  acquisitionDate: string;
  description?: string;
  location?: string; // Pour immobilier
  rentalYield?: number; // Pour bien locatif (rendement annuel en %)
  shares?: number; // Pour société non cotée (% de parts)
}

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

export interface AssetCategory {
  type: AssetType;
  label: string;
  icon: string;
  color: string;
}

// Performance du patrimoine
export interface PerformanceData {
  period: string; // 'month' | 'quarter' | 'year' | 'ytd'
  startDate: string;
  endDate: string;
  startValue: number;
  endValue: number;
  gain: number;
  gainPercent: number;
  byCategory: CategoryPerformance[];
}

// Performance simplifiée pour le header
export interface HeaderPerformance {
  period: string;
  startDate: string;
  endDate: string;
  gain: number;
  gainPercent: number;
}

export interface CategoryPerformance {
  type: AssetType;
  label: string;
  startValue: number;
  endValue: number;
  gain: number;
  gainPercent: number;
}

// Actions des gestionnaires
export interface ManagerAction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'rebalance' | 'advice' | 'tax_optimization';
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'planned';
  impact?: string; // Impact financier ou commentaire
  impactValue?: number; // Gain/perte en euros
  category: AssetType;
}

export interface PatrimoineSnapshot {
  date: string;
  totalValue: number;
  assets: Asset[];
  performance?: PerformanceData;
  recentActions?: ManagerAction[];
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

// Analyse IA
export interface AiAnalysis {
  title: string;
  generatedAt: string;
  content: string;
}
