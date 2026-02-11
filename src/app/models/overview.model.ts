import { AssetBreakdown } from './asset.model';

export interface OverviewData {
  grossValue: number;
  liabilities: number;
  netValue: number;
  diversificationScore: number;
  riskLevel: number;
  valuationDate: string;
  performance: {
    period: string;
    startDate: string;
    endDate: string;
    gain: number;
    gainPercent: number;
  };
  totalValue: number;
  evolution: number;
  evolutionPercent: number;
  breakdown: AssetBreakdown[];
}

export interface PatrimoineSummary {
  totalValue: number;
  evolution: number;
  evolutionPercent: number;
  breakdown: AssetBreakdown[];
}
