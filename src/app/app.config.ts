import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  Injectable,
} from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { simulatedDelayInterceptor } from './core/interceptors/simulated-delay.interceptor';
import { retryInterceptor } from './core/interceptors/retry.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco, TranslocoLoader, Translation } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { Observable, of } from 'rxjs';

import { routes } from './app.routes';
import { frTranslations } from './i18n/fr';
import { TranslocoTitleStrategy } from './core/transloco-title.strategy';

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
    provideHttpClient(withInterceptors([retryInterceptor, simulatedDelayInterceptor])),
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
    // Custom title strategy with Transloco translations
    { provide: TitleStrategy, useClass: TranslocoTitleStrategy },
  ],
};
