import { ChangeDetectionStrategy, Component, computed, inject, Injector } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PatrimoineService } from '../../../../services/patrimoine.service';
import { getAssetCategory, CategoryPerformance } from '../../../../models';
import { formatCurrency } from '../../../../core';
import { ResourceErrorHandler } from '../../../../core/resource-error-handler';

@Component({
  selector: 'app-performance',
  imports: [DecimalPipe, TranslocoModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceComponent {
  protected readonly patrimoineService = inject(PatrimoineService);
  private readonly errorHandler = inject(ResourceErrorHandler);
  private readonly injector = inject(Injector);

  constructor() {
    this.patrimoineService.loadPerformance();
    this.errorHandler.watchResource(
      this.patrimoineService.performanceResource,
      'errors.load_performance',
      this.injector
    );
  }

  protected readonly performance = this.patrimoineService.performance;
  protected readonly loading = this.patrimoineService.performanceResource.isLoading;
  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;

  protected formatPeriod(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  protected readonly marketBenchmark = 4.5; // CAC 40 / Euro Stoxx approximate

  protected readonly topPerformers = computed(() => {
    const perf = this.performance();
    if (!perf) return [];
    return [...perf.byCategory].sort((a, b) => b.gainPercent - a.gainPercent).slice(0, 3);
  });

  protected readonly flopPerformers = computed(() => {
    const perf = this.performance();
    if (!perf) return [];
    return [...perf.byCategory].filter(c => c.gainPercent < 0).sort((a, b) => a.gainPercent - b.gainPercent);
  });

  protected getProgressWidth(gainPercent: number): number {
    const maxGain = 15; // Normalization cap at 15%
    return Math.min((Math.abs(gainPercent) / maxGain) * 100, 100);
  }

  protected getPerformanceEmoji(gainPercent: number): string {
    if (gainPercent >= 10) return '🚀';
    if (gainPercent >= 5) return '📈';
    if (gainPercent >= 0) return '✅';
    if (gainPercent >= -10) return '📉';
    return '⚠️';
  }

  protected getPerformanceMessageKey(category: CategoryPerformance): string {
    const diff = category.gainPercent - this.marketBenchmark;
    if (diff >= 5) return 'performance.msg_excellent';
    if (diff >= 0) return 'performance.msg_good';
    if (diff >= -3) return 'performance.msg_close';
    return 'performance.msg_below';
  }
}
