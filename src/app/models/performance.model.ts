import { AssetType } from './asset.model';

export interface PerformanceData {
  period: string;
  startDate: string;
  endDate: string;
  startValue: number;
  endValue: number;
  gain: number;
  gainPercent: number;
  byCategory: CategoryPerformance[];
}

export interface CategoryPerformance {
  type: AssetType;
  label: string;
  startValue: number;
  endValue: number;
  gain: number;
  gainPercent: number;
}
