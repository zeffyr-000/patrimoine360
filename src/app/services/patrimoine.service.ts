import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Asset } from '../models/asset.model';
import { ClientData } from '../models/client.model';
import { OverviewData, PatrimoineSummary } from '../models/overview.model';
import { PerformanceData } from '../models/performance.model';
import { ActionsData } from '../models/action.model';
import { AssetsData } from '../models/asset.model';
import { AiAnalysis } from '../models/ai.model';
import { lazyHttpResource } from '../core/lazy-http-resource';
import { DATA_URLS } from '../core/data-urls';

@Injectable({
  providedIn: 'root',
})
export class PatrimoineService {
  private readonly http = inject(HttpClient);
  private readonly transloco = inject(TranslocoService);

  // Lazy HTTP resources — idle until a component calls loadX()
  private readonly _client = lazyHttpResource<ClientData>(DATA_URLS.client);
  private readonly _overview = lazyHttpResource<OverviewData>(DATA_URLS.overview);
  private readonly _performance = lazyHttpResource<PerformanceData>(DATA_URLS.performance);
  private readonly _actions = lazyHttpResource<ActionsData>(DATA_URLS.actions);
  private readonly _assets = lazyHttpResource<AssetsData>(DATA_URLS.assets);

  readonly clientResource = this._client.resource;
  readonly overviewResource = this._overview.resource;
  readonly performanceResource = this._performance.resource;
  readonly actionsResource = this._actions.resource;
  readonly assetsResource = this._assets.resource;

  // Public loading triggers
  loadClient(): void {
    this._client.load();
  }
  loadOverview(): void {
    this._overview.load();
  }
  loadPerformance(): void {
    this._performance.load();
  }
  loadActions(): void {
    this._actions.load();
  }
  loadAssets(): void {
    this._assets.load();
  }

  // AI analysis — on-demand via trigger signal
  private readonly _aiTrigger = signal(0);

  readonly aiAnalysisResource = rxResource({
    params: () => {
      const trigger = this._aiTrigger();
      return trigger === 0 ? undefined : trigger;
    },
    stream: () => {
      return this.http.get<AiAnalysis>(DATA_URLS.aiAnalysis).pipe(
        catchError(err => {
          console.error('Error loading AI analysis:', err);
          return of({
            title: this.transloco.translate('errors.ai_unavailable_title'),
            generatedAt: new Date().toISOString(),
            content: this.transloco.translate('errors.ai_unavailable_content'),
          });
        })
      );
    },
  });

  triggerAiAnalysis(): void {
    this._aiTrigger.update(v => v + 1);
  }

  // Computed accessors — transform resource data into convenient shapes
  readonly client = computed(() => this.clientResource.value()?.client ?? null);
  readonly overview = computed(() => this.overviewResource.value());
  readonly performance = computed(() => this.performanceResource.value());
  readonly recentActions = computed(() => this.actionsResource.value()?.actions ?? []);
  readonly assets = computed(() => this.assetsResource.value()?.assets ?? []);

  // Aggregate loading / error across all resources
  readonly loading = computed(
    () =>
      this.clientResource.isLoading() ||
      this.overviewResource.isLoading() ||
      this.performanceResource.isLoading() ||
      this.actionsResource.isLoading() ||
      this.assetsResource.isLoading()
  );

  readonly error = computed(
    () =>
      this.clientResource.error() ||
      this.overviewResource.error() ||
      this.performanceResource.error() ||
      this.actionsResource.error() ||
      this.assetsResource.error()
  );

  // Derived aggregations (transform, not pass-through)
  readonly summary = computed<PatrimoineSummary>(() => {
    const data = this.overviewResource.value();
    if (!data) {
      return { totalValue: 0, evolution: 0, evolutionPercent: 0, breakdown: [] };
    }
    return {
      totalValue: data.totalValue,
      evolution: data.evolution,
      evolutionPercent: data.evolutionPercent,
      breakdown: data.breakdown,
    };
  });

  readonly assetsByType = computed(() => {
    const assetList = this.assets();
    const grouped = new Map<string, Asset[]>();
    for (const asset of assetList) {
      const existing = grouped.get(asset.type) ?? [];
      grouped.set(asset.type, [...existing, asset]);
    }
    return grouped;
  });

  getAssetById(id: string): Asset | undefined {
    return this.assets().find(a => a.id === id);
  }

  getTotalByType(type: string): number {
    return this.assets()
      .filter(a => a.type === type)
      .reduce((sum, a) => sum + a.value, 0);
  }
}
