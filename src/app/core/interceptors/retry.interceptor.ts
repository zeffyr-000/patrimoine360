import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

// Retries failed GET requests up to 2 times with a 1 s delay between attempts.
// Only transient errors (5xx, 408, 429) are retried — client errors fail fast.
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: unknown) => {
        const status = error instanceof HttpErrorResponse ? error.status : 0;
        // Status 0 = network error (offline, DNS, CORS) — always retry
        if (status === 0 || RETRYABLE_STATUSES.has(status)) {
          return timer(1000);
        }
        throw error;
      },
    })
  );
};
