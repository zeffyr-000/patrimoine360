import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { PatrimoineService } from '../services/patrimoine.service';
import { ClientHeaderComponent } from '../features/patrimoine';

@Component({
  selector: 'app-home',
  imports: [
    TranslocoModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ClientHeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  protected readonly patrimoineService = inject(PatrimoineService);

  // Expose les computed du service
  protected readonly loadingClient = this.patrimoineService.loadingClient;
  protected readonly error = this.patrimoineService.error;
  protected readonly client = this.patrimoineService.client;

  ngOnInit(): void {
    // Load client data for the home page
    this.patrimoineService.loadClient().subscribe();
  }
}
