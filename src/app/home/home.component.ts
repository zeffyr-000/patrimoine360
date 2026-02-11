import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { PatrimoineService } from '../services/patrimoine.service';
import { ClientHeaderComponent } from '../features/patrimoine';
import { ResourceErrorHandler } from '../core/resource-error-handler';

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
export class HomeComponent {
  protected readonly patrimoineService = inject(PatrimoineService);
  private readonly errorHandler = inject(ResourceErrorHandler);
  private readonly injector = inject(Injector);

  constructor() {
    this.patrimoineService.loadClient();
    this.errorHandler.watchResource(this.patrimoineService.clientResource, 'errors.load_client', this.injector);
  }

  protected readonly loadingClient = this.patrimoineService.clientResource.isLoading;
  protected readonly error = this.patrimoineService.error;
  protected readonly client = this.patrimoineService.client;
}
