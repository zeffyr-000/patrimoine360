import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { ClientProfile } from '../../../../models/patrimoine.model';

// Client header component showing profile information
// Displays name, profession, client since, and banker
@Component({
  selector: 'app-client-header',
  imports: [MatIconModule, TranslocoModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientHeaderComponent {
  readonly client = input.required<ClientProfile>();
}
