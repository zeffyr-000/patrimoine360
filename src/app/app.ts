import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    TranslocoModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly menuOpen = signal(false);
  protected readonly appTitle = 'Patrimoine360';

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }
}
