import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-performance-badge',
  imports: [DecimalPipe, MatIconModule],
  templateUrl: './performance-badge.component.html',
  styleUrl: './performance-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceBadgeComponent {
  readonly amount = input.required<string>();
  readonly percent = input.required<number>();

  readonly isPositive = computed(() => this.percent() >= 0);

  readonly icon = computed(() => (this.isPositive() ? 'arrow_upward' : 'arrow_downward'));
}
