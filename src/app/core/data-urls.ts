import { environment } from '../../environments/environment';

// Single source of truth for all data endpoint URLs
export const DATA_URLS = {
  client: `${environment.dataPath}/client.json`,
  overview: `${environment.dataPath}/overview.json`,
  performance: `${environment.dataPath}/performance.json`,
  actions: `${environment.dataPath}/actions.json`,
  assets: `${environment.dataPath}/assets.json`,
  contact: `${environment.dataPath}/contact.json`,
  documents: `${environment.dataPath}/documents.json`,
  aiAnalysis: `${environment.dataPath}/ai-analysis.json`,
} as const;
