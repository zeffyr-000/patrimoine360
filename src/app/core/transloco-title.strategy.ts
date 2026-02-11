import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

// Translates route title keys via Transloco before setting document title
@Injectable({ providedIn: 'root' })
export class TranslocoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly transloco = inject(TranslocoService);

  private readonly appTitle = 'Patrimoine360';

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);

    if (titleKey) {
      const translatedTitle = this.transloco.translate(titleKey);
      this.title.setTitle(`${translatedTitle} | ${this.appTitle}`);
    } else {
      this.title.setTitle(this.appTitle);
    }
  }
}
