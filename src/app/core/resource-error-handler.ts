import { effect, inject, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { HttpResourceRef } from '@angular/common/http';
import { ResourceRef } from '@angular/core';

// Watches a resource's error signal and shows a translated snackbar on failure.
// Must be called from a component constructor (injection context) to bind the
// effect lifecycle to the component.
@Injectable({ providedIn: 'root' })
export class ResourceErrorHandler {
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  // Pass the component's Injector so the effect is tied to its lifecycle
  watchResource(resource: HttpResourceRef<unknown> | ResourceRef<unknown>, errorKey: string, injector: Injector): void {
    effect(
      () => {
        const err = resource.error();
        if (err) {
          this.snackBar.open(this.transloco.translate(errorKey), this.transloco.translate('common.close'), {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        }
      },
      { injector }
    );
  }
}
