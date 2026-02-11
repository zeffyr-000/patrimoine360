import { ChangeDetectionStrategy, Component, computed, inject, Injector } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PatrimoineService } from '../../../../services/patrimoine.service';
import { getAssetCategory } from '../../../../models';
import { formatCurrency } from '../../../../core';
import { ResourceErrorHandler } from '../../../../core/resource-error-handler';

@Component({
  selector: 'app-assets',
  imports: [DecimalPipe, TranslocoModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsComponent {
  protected readonly patrimoineService = inject(PatrimoineService);
  private readonly errorHandler = inject(ResourceErrorHandler);
  private readonly injector = inject(Injector);

  constructor() {
    this.patrimoineService.loadAssets();
    this.patrimoineService.loadOverview();
    this.errorHandler.watchResource(this.patrimoineService.assetsResource, 'errors.load_assets', this.injector);
  }

  protected readonly assets = this.patrimoineService.assets;
  protected readonly loading = this.patrimoineService.assetsResource.isLoading;
  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;

  protected readonly valuationDate = computed(() => this.patrimoineService.overview()?.valuationDate ?? '');

  protected readonly totalValue = computed(() => this.assets().reduce((sum, a) => sum + a.value, 0));

  protected readonly totalAcquisition = computed(() =>
    this.assets().reduce((sum, a) => sum + (a.acquisitionCost ?? a.value), 0)
  );

  protected readonly totalGain = computed(() => this.totalValue() - this.totalAcquisition());

  protected readonly formattedValuationDate = computed(() => {
    const dateStr = this.valuationDate();
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  protected formatAcquisitionDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  protected getAssetGain(asset: { value: number; acquisitionCost?: number }): number {
    return asset.value - (asset.acquisitionCost ?? asset.value);
  }

  protected getAssetGainPercent(asset: { value: number; acquisitionCost?: number }): number {
    const cost = asset.acquisitionCost ?? asset.value;
    if (cost === 0) return 0;
    return ((asset.value - cost) / cost) * 100;
  }

  protected getAssetWeight(asset: { value: number }): number {
    const total = this.totalValue();
    if (total === 0) return 0;
    return (asset.value / total) * 100;
  }
}
