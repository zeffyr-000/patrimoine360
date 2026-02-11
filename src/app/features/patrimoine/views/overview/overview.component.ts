import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { Subject, concatMap, delay, of, range, scan, takeUntil, tap } from 'rxjs';

// Required for Chart.js tree-shaking
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

import { PatrimoineService } from '../../../../services/patrimoine.service';
import { getAssetCategory, AssetBreakdown } from '../../../../models';
import { formatCurrency, MarkdownPipe } from '../../../../core';
import { ResourceErrorHandler } from '../../../../core/resource-error-handler';

interface StrategicAlert {
  type: 'warning' | 'info' | 'success';
  icon: string;
  titleKey: string;
  descriptionKey: string;
  value?: string;
}

@Component({
  selector: 'app-overview',
  imports: [
    DecimalPipe,
    TranslocoModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    BaseChartDirective,
    MarkdownPipe,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly transloco = inject(TranslocoService);
  protected readonly patrimoineService = inject(PatrimoineService);
  private readonly errorHandler = inject(ResourceErrorHandler);
  private readonly injector = inject(Injector);

  private readonly cancelStream$ = new Subject<void>();

  constructor() {
    this.patrimoineService.loadOverview();
    this.errorHandler.watchResource(this.patrimoineService.overviewResource, 'errors.load_overview', this.injector);

    // Stream AI content when resource delivers a value
    effect(() => {
      const analysis = this.patrimoineService.aiAnalysisResource.value();
      if (analysis) {
        this.cancelStreaming();
        this.streamText(analysis.content);
      }
    });
  }

  protected readonly summary = this.patrimoineService.summary;
  protected readonly overview = this.patrimoineService.overview;
  protected readonly loading = this.patrimoineService.overviewResource.isLoading;
  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;

  protected readonly selectedCategory = signal<AssetBreakdown | null>(null);

  protected readonly aiPanelOpen = signal(false);
  protected readonly aiAnalyzing = signal(false);
  protected readonly aiContent = signal('');
  protected readonly aiComplete = signal(false);

  protected readonly chartData = computed<ChartData<'doughnut'>>(() => {
    const breakdown = this.summary().breakdown;
    return {
      labels: breakdown.map(b => b.label),
      datasets: [
        {
          data: breakdown.map(b => b.value),
          backgroundColor: breakdown.map(b => b.color),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverBorderWidth: 4,
          hoverOffset: 8,
        },
      ],
    };
  });

  protected readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(26, 54, 93, 0.95)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: context => {
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return ` ${this.formatCurrency(value)} (${percent}%)`;
          },
        },
      },
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        this.selectedCategory.set(this.summary().breakdown[index]);
      } else {
        this.selectedCategory.set(null);
      }
    },
  };

  protected readonly calculatedDiversificationScore = computed(() => {
    const breakdown = this.summary().breakdown;
    if (breakdown.length === 0) return 0;
    // HHI inverted: higher = more diversified
    const hhi = breakdown.reduce((sum, b) => sum + Math.pow(b.percent / 100, 2), 0);
    // 0 = fully concentrated, 100 = fully diversified
    return Math.round((1 - hhi) * 100);
  });

  protected readonly maxConcentration = computed(() => {
    const breakdown = this.summary().breakdown;
    if (breakdown.length === 0) return { category: '', percent: 0 };
    const max = breakdown.reduce((a, b) => (a.percent > b.percent ? a : b));
    return { category: max.label, percent: max.percent };
  });

  protected readonly liquidityRatio = computed(() => {
    const breakdown = this.summary().breakdown;
    const total = this.summary().totalValue;
    if (total === 0) return 0;
    // Liquid assets: cash, stocks, bonds
    const liquidTypes = ['cash', 'stocks', 'bonds'];
    const liquidValue = breakdown.filter(b => liquidTypes.includes(b.type)).reduce((sum, b) => sum + b.value, 0);
    return (liquidValue / total) * 100;
  });

  protected readonly realEstateRatio = computed(() => {
    const breakdown = this.summary().breakdown;
    const total = this.summary().totalValue;
    if (total === 0) return 0;
    const realEstateTypes = ['real_estate', 'real_estate_rental'];
    const realEstateValue = breakdown
      .filter(b => realEstateTypes.includes(b.type))
      .reduce((sum, b) => sum + b.value, 0);
    return (realEstateValue / total) * 100;
  });

  protected readonly alerts = computed<StrategicAlert[]>(() => {
    const alerts: StrategicAlert[] = [];
    const maxConc = this.maxConcentration();
    const liquidity = this.liquidityRatio();
    const diversification = this.calculatedDiversificationScore();

    if (maxConc.percent > 40) {
      alerts.push({
        type: 'warning',
        icon: 'pie_chart',
        titleKey: 'overview.alert_concentration_title',
        descriptionKey: 'overview.alert_concentration_desc',
        value: `${maxConc.percent.toFixed(0)}%`,
      });
    }

    if (liquidity < 15) {
      alerts.push({
        type: 'warning',
        icon: 'water_drop',
        titleKey: 'overview.alert_liquidity_title',
        descriptionKey: 'overview.alert_liquidity_desc',
        value: `${liquidity.toFixed(0)}%`,
      });
    }

    if (diversification >= 70 && maxConc.percent <= 30) {
      alerts.push({
        type: 'success',
        icon: 'verified',
        titleKey: 'overview.alert_diversified_title',
        descriptionKey: 'overview.alert_diversified_desc',
      });
    }

    const realEstate = this.realEstateRatio();
    if (realEstate > 35) {
      alerts.push({
        type: 'info',
        icon: 'home',
        titleKey: 'overview.alert_real_estate_title',
        descriptionKey: 'overview.alert_real_estate_desc',
        value: `${realEstate.toFixed(0)}%`,
      });
    }

    return alerts;
  });

  protected onLegendClick(item: AssetBreakdown): void {
    if (this.selectedCategory()?.type === item.type) {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(item);
    }
  }

  protected getRiskLabel(level: number): string {
    const keys = ['very_conservative', 'conservative', 'balanced', 'dynamic', 'aggressive'];
    const key = keys[level - 1] || 'balanced';
    return this.transloco.translate(`overview.risk_labels.${key}`);
  }

  protected getRiskClass(level: number): string {
    if (level <= 2) return 'risk-low';
    if (level === 3) return 'risk-medium';
    return 'risk-high';
  }

  protected getDiversificationClass(score: number): string {
    if (score >= 70) return 'score-good';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  }

  protected launchAiAnalysis(): void {
    this.cancelStreaming();

    this.aiPanelOpen.set(true);
    this.aiAnalyzing.set(true);
    this.aiContent.set('');
    this.aiComplete.set(false);

    this.patrimoineService.triggerAiAnalysis();
  }

  protected closeAiPanel(): void {
    this.cancelStreaming();
    this.aiPanelOpen.set(false);
    this.aiAnalyzing.set(false);
    this.aiContent.set('');
    this.aiComplete.set(false);
  }

  private cancelStreaming(): void {
    this.cancelStream$.next();
  }

  private streamText(fullText: string): void {
    const baseDelay = 35;
    const chars = fullText.split('');

    // Emit characters one-by-one with variable delay
    range(0, chars.length)
      .pipe(
        concatMap(i => {
          let ms = baseDelay + Math.random() * 25;
          const ch = chars[i];
          if (ch === '.' || ch === ':') ms += 150;
          else if (ch === ',') ms += 60;
          else if (ch === '\n') ms += 100;
          else if (ch === '#') ms += 200;
          return of(i).pipe(delay(ms));
        }),
        scan((acc, i) => acc + chars[i], ''),
        tap(text => this.aiContent.set(text)),
        takeUntil(this.cancelStream$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        complete: () => {
          // Only mark complete if the full text was streamed (not cancelled)
          if (this.aiContent() === fullText) {
            this.aiAnalyzing.set(false);
            this.aiComplete.set(true);
          }
        },
      });
  }
}
