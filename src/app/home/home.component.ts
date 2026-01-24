import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { PatrimoineService } from '../services/patrimoine.service';
import { formatCurrency, getAssetCategory } from '../models/patrimoine.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslocoModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  protected readonly patrimoineService = inject(PatrimoineService);

  // Expose les computed du service
  protected readonly loading = this.patrimoineService.loading;
  protected readonly error = this.patrimoineService.error;
  protected readonly summary = this.patrimoineService.summary;
  protected readonly assets = this.patrimoineService.assets;

  protected readonly formatCurrency = formatCurrency;
  protected readonly getAssetCategory = getAssetCategory;

  ngOnInit(): void {
    this.patrimoineService.loadPatrimoine().subscribe();
  }
}
