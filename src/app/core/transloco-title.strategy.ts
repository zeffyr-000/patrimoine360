import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

// Custom TitleStrategy that translates route titles via Transloco
@Injectable({ providedIn: 'root' })
export class TranslocoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly transloco = inject(TranslocoService);

  private readonly appTitle = 'Patrimoine360';

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);

    if (titleKey) {
      // Translate the key and set the title
      const translatedTitle = this.transloco.translate(titleKey);
      this.title.setTitle(`${translatedTitle} | ${this.appTitle}`);
    } else {
      this.title.setTitle(this.appTitle);
    }
  }
}
