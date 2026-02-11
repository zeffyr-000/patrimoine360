import { AssetType } from './asset.model';

export interface ManagerAction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'rebalance' | 'advice' | 'tax_optimization';
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'planned';
  impact?: string;
  impactValue?: number;
  category: AssetType;
}

export interface ActionsData {
  actions: ManagerAction[];
}
