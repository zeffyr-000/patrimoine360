import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

import { PatrimoineService } from '../../../../services/patrimoine.service';
import { getAssetCategory, AssetBreakdown } from '../../../../models/patrimoine.model';
import { formatCurrency, MarkdownPipe } from '../../../../core';

// Strategic alert type
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
export class OverviewComponent implements OnInit {
  protected readonly patrimoineService = inject(PatrimoineService);
  protected readonly summary = this.patrimoineService.summary;
  protected readonly loading = this.patrimoineService.loadingOverview;
  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;

  // Hero summary data
  protected readonly grossValue = this.patrimoineService.grossValue;
  protected readonly liabilities = this.patrimoineService.liabilities;
  protected readonly netValue = this.patrimoineService.netValue;
  protected readonly diversificationScore = this.patrimoineService.diversificationScore;
  protected readonly riskLevel = this.patrimoineService.riskLevel;
  protected readonly headerPerformance = this.patrimoineService.headerPerformance;

  // Selected category for hover/click interaction
  protected readonly selectedCategory = signal<AssetBreakdown | null>(null);

  // AI Analysis state
  protected readonly aiPanelOpen = signal(false);
  protected readonly aiAnalyzing = signal(false);
  protected readonly aiContent = signal('');
  protected readonly aiComplete = signal(false);

  // Chart configuration
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

  // KPIs computed from breakdown
  protected readonly calculatedDiversificationScore = computed(() => {
    const breakdown = this.summary().breakdown;
    if (breakdown.length === 0) return 0;
    // Herfindahl-Hirschman Index inverted (higher = more diversified)
    const hhi = breakdown.reduce((sum, b) => sum + Math.pow(b.percent / 100, 2), 0);
    // Score from 0-100 (1 = fully concentrated, 0 = fully diversified)
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

  // Strategic alerts
  protected readonly alerts = computed<StrategicAlert[]>(() => {
    const alerts: StrategicAlert[] = [];
    const maxConc = this.maxConcentration();
    const liquidity = this.liquidityRatio();
    const diversification = this.calculatedDiversificationScore();

    // Alert: High concentration
    if (maxConc.percent > 40) {
      alerts.push({
        type: 'warning',
        icon: 'pie_chart',
        titleKey: 'overview.alert_concentration_title',
        descriptionKey: 'overview.alert_concentration_desc',
        value: `${maxConc.percent.toFixed(0)}%`,
      });
    }

    // Alert: Low liquidity
    if (liquidity < 15) {
      alerts.push({
        type: 'warning',
        icon: 'water_drop',
        titleKey: 'overview.alert_liquidity_title',
        descriptionKey: 'overview.alert_liquidity_desc',
        value: `${liquidity.toFixed(0)}%`,
      });
    }

    // Success: Good diversification
    if (diversification >= 70 && maxConc.percent <= 30) {
      alerts.push({
        type: 'success',
        icon: 'verified',
        titleKey: 'overview.alert_diversified_title',
        descriptionKey: 'overview.alert_diversified_desc',
      });
    }

    // Info: Real estate heavy
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

  ngOnInit(): void {
    this.patrimoineService.loadOverview().subscribe();
  }

  // Handle legend item click
  protected onLegendClick(item: AssetBreakdown): void {
    if (this.selectedCategory()?.type === item.type) {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(item);
    }
  }

  // Hero summary helpers
  protected getRiskLabel(level: number): string {
    const labels = ['Très prudent', 'Prudent', 'Équilibré', 'Dynamique', 'Offensif'];
    return labels[level - 1] || 'Équilibré';
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

  // AI Analysis methods
  protected launchAiAnalysis(): void {
    this.aiPanelOpen.set(true);
    this.aiAnalyzing.set(true);
    this.aiContent.set('');
    this.aiComplete.set(false);

    this.patrimoineService.loadAiAnalysis().subscribe(analysis => {
      this.streamText(analysis.content);
    });
  }

  protected closeAiPanel(): void {
    this.aiPanelOpen.set(false);
    this.aiAnalyzing.set(false);
  }

  private streamText(fullText: string): void {
    let currentIndex = 0;
    const baseDelay = 35;

    const streamNext = () => {
      if (currentIndex >= fullText.length) {
        this.aiAnalyzing.set(false);
        this.aiComplete.set(true);
        return;
      }

      const chunkSize = Math.random() > 0.7 ? 2 : 1;
      currentIndex += chunkSize;
      this.aiContent.set(fullText.slice(0, currentIndex));

      let delay = baseDelay + Math.random() * 25;
      const lastChar = fullText[currentIndex - 1];
      if (lastChar === '.' || lastChar === ':') delay += 150;
      else if (lastChar === ',') delay += 60;
      else if (lastChar === '\n') delay += 100;
      else if (lastChar === '#') delay += 200;

      setTimeout(streamNext, delay);
    };

    streamNext();
  }
}
