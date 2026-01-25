import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PatrimoineService, Advisor, Agency } from '../../services/patrimoine.service';

@Component({
  selector: 'app-contact',
  imports: [TranslocoModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly patrimoineService = inject(PatrimoineService);

  protected readonly loading = signal(true);
  protected readonly advisor = signal<Advisor | null>(null);
  protected readonly agency = signal<Agency | null>(null);

  ngOnInit(): void {
    this.patrimoineService.loadContact().subscribe({
      next: data => {
        this.advisor.set(data.advisor);
        this.agency.set(data.agency);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
