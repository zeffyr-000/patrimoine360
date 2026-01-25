import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// Reusable performance badge showing gain/loss
// Displays amount and percentage with appropriate styling
@Component({
  selector: 'app-performance-badge',
  imports: [DecimalPipe, MatIconModule],
  templateUrl: './performance-badge.component.html',
  styleUrl: './performance-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceBadgeComponent {
  // Performance data
  readonly amount = input.required<string>();
  readonly percent = input.required<number>();

  // Computed: determine if positive or negative
  readonly isPositive = computed(() => this.percent() >= 0);

  // Computed: icon based on performance
  readonly icon = computed(() => (this.isPositive() ? 'arrow_upward' : 'arrow_downward'));
}
