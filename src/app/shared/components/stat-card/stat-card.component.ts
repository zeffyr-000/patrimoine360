import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Reusable stat card component for displaying key metrics
// Private Banking design with clean data cards
@Component({
  selector: 'app-stat-card',
  imports: [DecimalPipe, MatCardModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  // Card content
  readonly icon = input.required<string>();
  readonly iconColor = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly percent = input<number>();

  // Optional progress bar
  readonly showProgress = input<boolean>(false);
}
