import { HttpInterceptorFn } from '@angular/common/http';
import { delay } from 'rxjs';

// Simulated network delays (ms) to mimic distant API calls
const DELAY_MAP: Record<string, number> = {
  'client.json': 300,
  'overview.json': 500,
  'performance.json': 600,
  'actions.json': 450,
  'assets.json': 550,
  'ai-analysis.json': 800,
  'contact.json': 350,
  'documents.json': 400,
};

// Simulates network latency on static JSON data files
export const simulatedDelayInterceptor: HttpInterceptorFn = (req, next) => {
  const filename = req.url.split('/').pop() ?? '';
  const ms = DELAY_MAP[filename];
  if (ms) {
    return next(req).pipe(delay(ms));
  }
  return next(req);
};
