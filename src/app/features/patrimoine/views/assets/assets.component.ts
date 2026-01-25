import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PatrimoineService } from '../../../../services/patrimoine.service';
import { getAssetCategory } from '../../../../models/patrimoine.model';
import { formatCurrency } from '../../../../core';

@Component({
  selector: 'app-assets',
  imports: [DecimalPipe, TranslocoModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsComponent implements OnInit {
  protected readonly patrimoineService = inject(PatrimoineService);
  protected readonly assets = this.patrimoineService.assets;
  protected readonly loading = this.patrimoineService.loadingAssets;
  protected readonly valuationDate = this.patrimoineService.valuationDate;
  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;

  // Computed signals for totals
  protected readonly totalValue = computed(() => this.assets().reduce((sum, a) => sum + a.value, 0));

  protected readonly totalAcquisition = computed(() =>
    this.assets().reduce((sum, a) => sum + (a.acquisitionCost ?? a.value), 0)
  );

  protected readonly totalGain = computed(() => this.totalValue() - this.totalAcquisition());

  // Formatted valuation date
  protected readonly formattedValuationDate = computed(() => {
    const dateStr = this.valuationDate();
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  ngOnInit(): void {
    this.patrimoineService.loadAssets().subscribe();
    // Load overview if not already loaded (needed for valuation date)
    if (!this.valuationDate()) {
      this.patrimoineService.loadOverview().subscribe();
    }
  }

  // Format acquisition date in French
  protected formatAcquisitionDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Calculate gain for an asset
  protected getAssetGain(asset: { value: number; acquisitionCost?: number }): number {
    return asset.value - (asset.acquisitionCost ?? asset.value);
  }

  // Calculate gain percentage
  protected getAssetGainPercent(asset: { value: number; acquisitionCost?: number }): number {
    const cost = asset.acquisitionCost ?? asset.value;
    if (cost === 0) return 0;
    return ((asset.value - cost) / cost) * 100;
  }

  // Calculate weight of asset in portfolio
  protected getAssetWeight(asset: { value: number }): number {
    const total = this.totalValue();
    if (total === 0) return 0;
    return (asset.value / total) * 100;
  }
}
