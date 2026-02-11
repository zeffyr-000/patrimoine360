import { ChangeDetectionStrategy, Component, computed, inject, Injector } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PatrimoineService } from '../../../../services/patrimoine.service';
import { getAssetCategory } from '../../../../models';
import { formatCurrency, getActionStatusIcon, getActionTypeIcon } from '../../../../core';
import { ResourceErrorHandler } from '../../../../core/resource-error-handler';

@Component({
  selector: 'app-actions',
  imports: [
    DatePipe,
    NgTemplateOutlet,
    TranslocoModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent {
  protected readonly patrimoineService = inject(PatrimoineService);
  private readonly errorHandler = inject(ResourceErrorHandler);
  private readonly injector = inject(Injector);

  constructor() {
    this.patrimoineService.loadActions();
    this.errorHandler.watchResource(this.patrimoineService.actionsResource, 'errors.load_actions', this.injector);
  }

  protected readonly recentActions = this.patrimoineService.recentActions;
  protected readonly loading = this.patrimoineService.actionsResource.isLoading;
  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;
  protected readonly getActionStatusIcon = getActionStatusIcon;
  protected readonly getActionTypeIcon = getActionTypeIcon;

  protected readonly completedCount = computed(() => {
    return this.recentActions().filter(a => a.status === 'completed').length;
  });

  protected readonly totalImpact = computed(() => {
    return this.recentActions()
      .filter(a => a.impactValue && a.impactValue > 0)
      .reduce((sum, a) => sum + (a.impactValue ?? 0), 0);
  });

  // Filter 2025 actions for header stats
  protected readonly actions2025 = computed(() => {
    return this.recentActions().filter(a => a.date.startsWith('2025'));
  });

  protected readonly taxSavings = computed(() => {
    return this.actions2025()
      .filter(a => a.type === 'tax_optimization' && a.impactValue)
      .reduce((sum, a) => sum + (a.impactValue ?? 0), 0);
  });

  protected readonly realizedGains = computed(() => {
    return this.actions2025()
      .filter(a => (a.type === 'sell' || a.type === 'rebalance') && a.impactValue)
      .reduce((sum, a) => sum + (a.impactValue ?? 0), 0);
  });

  protected readonly transmissionSavings = computed(() => {
    return this.actions2025()
      .filter(a => a.type === 'advice' && a.impactValue)
      .reduce((sum, a) => sum + (a.impactValue ?? 0), 0);
  });
}
