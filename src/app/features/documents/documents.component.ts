import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DocumentsService } from '../../services/documents.service';
import { ResourceErrorHandler } from '../../core/resource-error-handler';

@Component({
  selector: 'app-documents',
  imports: [DatePipe, TranslocoModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {
  private readonly documentsService = inject(DocumentsService);
  private readonly errorHandler = inject(ResourceErrorHandler);
  private readonly injector = inject(Injector);

  constructor() {
    this.documentsService.load();
    this.errorHandler.watchResource(this.documentsService.documentsResource, 'errors.load_documents', this.injector);
  }

  protected readonly loading = this.documentsService.loading;
  protected readonly documents = this.documentsService.documents;
}
