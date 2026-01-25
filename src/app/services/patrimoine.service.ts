import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, tap, catchError, of, delay } from 'rxjs';
import {
  Asset,
  PatrimoineSummary,
  AssetBreakdown,
  ClientProfile,
  PerformanceData,
  ManagerAction,
  AiAnalysis,
} from '../models/patrimoine.model';
import { environment } from '../../environments/environment';

// Simulated network delay (ms)
const SIMULATED_DELAY = {
  client: 300,
  overview: 500,
  performance: 600,
  actions: 450,
  assets: 550,
  aiAnalysis: 800,
  contact: 350,
  documents: 400,
};

interface OverviewData {
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

interface ActionsData {
  actions: ManagerAction[];
}

interface AssetsData {
  assets: Asset[];
}

export interface Advisor {
  name: string;
  title: string;
  phone: string;
  email: string;
  availability: string;
}

export interface Agency {
  name: string;
  address: string;
  hours: string;
}

export interface ContactData {
  advisor: Advisor;
  agency: Agency;
}

export interface Document {
  id: string;
  title: string;
  type: 'report' | 'statement' | 'tax' | 'contract';
  date: string;
  icon: string;
}

interface DocumentsData {
  documents: Document[];
}

@Injectable({
  providedIn: 'root',
})
export class PatrimoineService {
  private readonly http = inject(HttpClient);
  private readonly transloco = inject(TranslocoService);

  // State with signals - separate loading states for each view
  private readonly _client = signal<ClientProfile | null>(null);
  private readonly _overview = signal<OverviewData | null>(null);
  private readonly _performance = signal<PerformanceData | null>(null);
  private readonly _recentActions = signal<ManagerAction[]>([]);
  private readonly _assets = signal<Asset[]>([]);

  // Loading states per view
  private readonly _loadingClient = signal(false);
  private readonly _loadingOverview = signal(false);
  private readonly _loadingPerformance = signal(false);
  private readonly _loadingActions = signal(false);
  private readonly _loadingAssets = signal(false);

  // Error states per view
  private readonly _errorClient = signal<string | null>(null);
  private readonly _errorOverview = signal<string | null>(null);
  private readonly _errorPerformance = signal<string | null>(null);
  private readonly _errorActions = signal<string | null>(null);
  private readonly _errorAssets = signal<string | null>(null);

  // Public readonly signals
  readonly client = this._client.asReadonly();
  readonly overview = this._overview.asReadonly();
  readonly performance = this._performance.asReadonly();
  readonly recentActions = this._recentActions.asReadonly();
  readonly assets = this._assets.asReadonly();

  // Loading states
  readonly loadingClient = this._loadingClient.asReadonly();
  readonly loadingOverview = this._loadingOverview.asReadonly();
  readonly loadingPerformance = this._loadingPerformance.asReadonly();
  readonly loadingActions = this._loadingActions.asReadonly();
  readonly loadingAssets = this._loadingAssets.asReadonly();

  // Legacy loading for backward compatibility (any view loading)
  readonly loading = computed(
    () =>
      this._loadingClient() ||
      this._loadingOverview() ||
      this._loadingPerformance() ||
      this._loadingActions() ||
      this._loadingAssets()
  );

  // Error states
  readonly errorClient = this._errorClient.asReadonly();
  readonly errorOverview = this._errorOverview.asReadonly();
  readonly errorPerformance = this._errorPerformance.asReadonly();
  readonly errorActions = this._errorActions.asReadonly();
  readonly errorAssets = this._errorAssets.asReadonly();

  // Legacy error for backward compatibility
  readonly error = computed(
    () =>
      this._errorClient() ||
      this._errorOverview() ||
      this._errorPerformance() ||
      this._errorActions() ||
      this._errorAssets()
  );

  // Computed values - from overview data (previously header)
  readonly grossValue = computed(() => this._overview()?.grossValue ?? 0);
  readonly liabilities = computed(() => this._overview()?.liabilities ?? 0);
  readonly netValue = computed(() => this._overview()?.netValue ?? 0);
  readonly diversificationScore = computed(() => this._overview()?.diversificationScore ?? 0);
  readonly riskLevel = computed(() => this._overview()?.riskLevel ?? 3);
  readonly valuationDate = computed(() => this._overview()?.valuationDate ?? '');
  readonly headerPerformance = computed(() => this._overview()?.performance ?? null);

  // Legacy - pour compatibilité
  readonly totalValue = computed(() => this._overview()?.netValue ?? 0);

  readonly summary = computed<PatrimoineSummary>(() => {
    const overviewData = this._overview();
    if (!overviewData) {
      return {
        totalValue: 0,
        evolution: 0,
        evolutionPercent: 0,
        breakdown: [],
      };
    }

    return {
      totalValue: overviewData.totalValue,
      evolution: overviewData.evolution,
      evolutionPercent: overviewData.evolutionPercent,
      breakdown: overviewData.breakdown,
    };
  });

  readonly assetsByType = computed(() => {
    const assets = this._assets();
    const grouped = new Map<string, Asset[]>();

    for (const asset of assets) {
      const existing = grouped.get(asset.type) ?? [];
      grouped.set(asset.type, [...existing, asset]);
    }

    return grouped;
  });

  // Load client data
  loadClient(): Observable<{ client: ClientProfile }> {
    this._loadingClient.set(true);
    this._errorClient.set(null);

    return this.http.get<{ client: ClientProfile }>(`${environment.dataPath}/client.json`).pipe(
      delay(SIMULATED_DELAY.client),
      tap(data => {
        this._client.set(data.client);
        this._loadingClient.set(false);
      }),
      catchError(err => {
        console.error('Error loading client:', err);
        this._errorClient.set(this.transloco.translate('errors.load_client'));
        this._loadingClient.set(false);
        return of({ client: null as unknown as ClientProfile });
      })
    );
  }

  // Load overview data (includes header + breakdown)
  loadOverview(): Observable<OverviewData> {
    this._loadingOverview.set(true);
    this._errorOverview.set(null);

    return this.http.get<OverviewData>(`${environment.dataPath}/overview.json`).pipe(
      delay(SIMULATED_DELAY.overview),
      tap(data => {
        this._overview.set(data);
        this._loadingOverview.set(false);
      }),
      catchError(err => {
        console.error('Error loading overview:', err);
        this._errorOverview.set(this.transloco.translate('errors.load_overview'));
        this._loadingOverview.set(false);
        return of({
          grossValue: 0,
          liabilities: 0,
          netValue: 0,
          diversificationScore: 0,
          riskLevel: 3,
          valuationDate: '',
          performance: { period: '', startDate: '', endDate: '', gain: 0, gainPercent: 0 },
          totalValue: 0,
          evolution: 0,
          evolutionPercent: 0,
          breakdown: [],
        });
      })
    );
  }

  // Load performance data
  loadPerformance(): Observable<PerformanceData> {
    this._loadingPerformance.set(true);
    this._errorPerformance.set(null);

    return this.http.get<PerformanceData>(`${environment.dataPath}/performance.json`).pipe(
      delay(SIMULATED_DELAY.performance),
      tap(data => {
        this._performance.set(data);
        this._loadingPerformance.set(false);
      }),
      catchError(err => {
        console.error('Error loading performance:', err);
        this._errorPerformance.set(this.transloco.translate('errors.load_performance'));
        this._loadingPerformance.set(false);
        return of({
          period: '',
          startDate: '',
          endDate: '',
          startValue: 0,
          endValue: 0,
          gain: 0,
          gainPercent: 0,
          byCategory: [],
        });
      })
    );
  }

  // Load actions data
  loadActions(): Observable<ActionsData> {
    this._loadingActions.set(true);
    this._errorActions.set(null);

    return this.http.get<ActionsData>(`${environment.dataPath}/actions.json`).pipe(
      delay(SIMULATED_DELAY.actions),
      tap(data => {
        this._recentActions.set(data.actions);
        this._loadingActions.set(false);
      }),
      catchError(err => {
        console.error('Error loading actions:', err);
        this._errorActions.set(this.transloco.translate('errors.load_actions'));
        this._loadingActions.set(false);
        return of({ actions: [] });
      })
    );
  }

  // Load assets data
  loadAssets(): Observable<AssetsData> {
    this._loadingAssets.set(true);
    this._errorAssets.set(null);

    return this.http.get<AssetsData>(`${environment.dataPath}/assets.json`).pipe(
      delay(SIMULATED_DELAY.assets),
      tap(data => {
        this._assets.set(data.assets);
        this._loadingAssets.set(false);
      }),
      catchError(err => {
        console.error('Error loading assets:', err);
        this._errorAssets.set(this.transloco.translate('errors.load_assets'));
        this._loadingAssets.set(false);
        return of({ assets: [] });
      })
    );
  }

  // Gets an asset by ID
  getAssetById(id: string): Asset | undefined {
    return this._assets().find(a => a.id === id);
  }

  // Calculates total for an asset type
  getTotalByType(type: string): number {
    return this._assets()
      .filter(a => a.type === type)
      .reduce((sum, a) => sum + a.value, 0);
  }

  // Load AI analysis
  loadAiAnalysis(): Observable<AiAnalysis> {
    return this.http.get<AiAnalysis>(`${environment.dataPath}/ai-analysis.json`).pipe(
      delay(SIMULATED_DELAY.aiAnalysis),
      catchError(err => {
        console.error('Error loading AI analysis:', err);
        return of({
          title: this.transloco.translate('errors.ai_unavailable_title'),
          generatedAt: new Date().toISOString(),
          content: this.transloco.translate('errors.ai_unavailable_content'),
        });
      })
    );
  }

  // Load contact data
  loadContact(): Observable<ContactData> {
    return this.http.get<ContactData>(`${environment.dataPath}/contact.json`).pipe(
      delay(SIMULATED_DELAY.contact),
      catchError(err => {
        console.error('Error loading contact:', err);
        return of({
          advisor: { name: '', title: '', phone: '', email: '', availability: '' },
          agency: { name: '', address: '', hours: '' },
        });
      })
    );
  }

  // Load documents data
  loadDocuments(): Observable<DocumentsData> {
    return this.http.get<DocumentsData>(`${environment.dataPath}/documents.json`).pipe(
      delay(SIMULATED_DELAY.documents),
      catchError(err => {
        console.error('Error loading documents:', err);
        return of({ documents: [] });
      })
    );
  }
}
