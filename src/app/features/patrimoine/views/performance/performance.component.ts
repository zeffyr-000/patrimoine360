import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PatrimoineService } from '../../../../services/patrimoine.service';
import { getAssetCategory, CategoryPerformance } from '../../../../models/patrimoine.model';
import { formatCurrency } from '../../../../core';

@Component({
  selector: 'app-performance',
  imports: [DecimalPipe, TranslocoModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceComponent implements OnInit {
  protected readonly patrimoineService = inject(PatrimoineService);
  protected readonly performance = this.patrimoineService.performance;
  protected readonly loading = this.patrimoineService.loadingPerformance;
  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;

  // Formater les dates en français (mois année)
  protected formatPeriod(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  // Référence de marché pour comparaison
  protected readonly marketBenchmark = 4.5; // CAC 40 / Euro Stoxx approximatif

  // Top et flop performers
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

  // Calcul de la barre de progression (normalisation)
  protected getProgressWidth(gainPercent: number): number {
    const maxGain = 15; // Normalisation sur 15%
    return Math.min((Math.abs(gainPercent) / maxGain) * 100, 100);
  }

  // Emoji selon la performance
  protected getPerformanceEmoji(gainPercent: number): string {
    if (gainPercent >= 10) return '🚀';
    if (gainPercent >= 5) return '📈';
    if (gainPercent >= 0) return '✅';
    if (gainPercent >= -10) return '📉';
    return '⚠️';
  }

  // Message explicatif selon la performance
  protected getPerformanceMessage(category: CategoryPerformance): string {
    const diff = category.gainPercent - this.marketBenchmark;
    if (diff >= 5) return 'Excellent ! Bien au-dessus du marché';
    if (diff >= 0) return 'Bonne performance, supérieure au marché';
    if (diff >= -3) return 'Performance proche du marché';
    return 'En dessous du marché, à surveiller';
  }

  ngOnInit(): void {
    this.patrimoineService.loadPerformance().subscribe();
  }
}
