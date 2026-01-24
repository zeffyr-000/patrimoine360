import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  Injectable,
} from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco, TranslocoLoader, Translation } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { Observable, of } from 'rxjs';

import { routes } from './app.routes';
import { frTranslations } from './i18n/fr';

@Injectable({ providedIn: 'root' })
export class TranslocoInlineLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    if (lang === 'fr') {
      return of(frTranslations);
    }
    return of({});
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    provideAnimations(),
    provideTransloco({
      config: {
        availableLangs: ['fr'],
        defaultLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoInlineLoader,
    }),
    provideTranslocoMessageformat(),
  ],
};
