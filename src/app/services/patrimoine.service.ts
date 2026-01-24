import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import {
  Asset,
  PatrimoineSummary,
  AssetBreakdown,
  ASSET_CATEGORIES,
} from '../models/patrimoine.model';

interface PatrimoineData {
  assets: Asset[];
  history: { date: string; totalValue: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class PatrimoineService {
  private readonly http = inject(HttpClient);

  // State avec signals
  private readonly _assets = signal<Asset[]>([]);
  private readonly _history = signal<{ date: string; totalValue: number }[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly assets = this._assets.asReadonly();
  readonly history = this._history.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed values
  readonly totalValue = computed(() => {
    return this._assets().reduce((sum, asset) => sum + asset.value, 0);
  });

  readonly summary = computed<PatrimoineSummary>(() => {
    const assets = this._assets();
    const history = this._history();
    const total = this.totalValue();

    // Calcul de l'évolution
    const previousValue = history.length > 1 ? history[history.length - 2].totalValue : total;
    const evolution = total - previousValue;
    const evolutionPercent = previousValue > 0 ? (evolution / previousValue) * 100 : 0;

    // Calcul de la répartition
    const breakdown: AssetBreakdown[] = ASSET_CATEGORIES.map(category => {
      const categoryAssets = assets.filter(a => a.type === category.type);
      const value = categoryAssets.reduce((sum, a) => sum + a.value, 0);
      const percent = total > 0 ? (value / total) * 100 : 0;

      return {
        type: category.type,
        label: category.label,
        value,
        percent,
        color: category.color,
      };
    }).filter(b => b.value > 0);

    return {
      totalValue: total,
      evolution,
      evolutionPercent,
      breakdown,
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

  /**
   * Charge les données depuis le fichier JSON statique
   */
  loadPatrimoine(): Observable<PatrimoineData> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<PatrimoineData>('/data/patrimoine.json').pipe(
      tap(data => {
        this._assets.set(data.assets);
        this._history.set(data.history);
        this._loading.set(false);
      }),
      catchError(err => {
        console.error('Erreur chargement patrimoine:', err);
        this._error.set('Impossible de charger les données du patrimoine');
        this._loading.set(false);
        return of({ assets: [], history: [] });
      })
    );
  }

  /**
   * Récupère un actif par son ID
   */
  getAssetById(id: string): Asset | undefined {
    return this._assets().find(a => a.id === id);
  }

  /**
   * Calcule le total pour un type d'actif
   */
  getTotalByType(type: string): number {
    return this._assets()
      .filter(a => a.type === type)
      .reduce((sum, a) => sum + a.value, 0);
  }
}
