import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PatrimoineService, Document } from '../../services/patrimoine.service';

@Component({
  selector: 'app-documents',
  imports: [DatePipe, TranslocoModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent implements OnInit {
  private readonly patrimoineService = inject(PatrimoineService);

  protected readonly loading = signal(true);
  protected readonly documents = signal<Document[]>([]);

  ngOnInit(): void {
    this.patrimoineService.loadDocuments().subscribe({
      next: data => {
        this.documents.set(data.documents);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  protected getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      report: 'Rapport',
      statement: 'Relevé',
      tax: 'Fiscal',
      contract: 'Contrat',
    };
    return labels[type] ?? type;
  }
}
