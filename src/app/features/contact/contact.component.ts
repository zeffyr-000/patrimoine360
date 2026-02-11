import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ContactService } from '../../services/contact.service';
import { ResourceErrorHandler } from '../../core/resource-error-handler';

@Component({
  selector: 'app-contact',
  imports: [TranslocoModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  private readonly errorHandler = inject(ResourceErrorHandler);
  private readonly injector = inject(Injector);

  constructor() {
    this.contactService.load();
    this.errorHandler.watchResource(this.contactService.contactResource, 'errors.load_contact', this.injector);
  }

  protected readonly loading = this.contactService.loading;
  protected readonly advisor = this.contactService.advisor;
  protected readonly agency = this.contactService.agency;
}
