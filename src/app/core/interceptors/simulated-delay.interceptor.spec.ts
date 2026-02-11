import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { simulatedDelayInterceptor } from './simulated-delay.interceptor';

describe('simulatedDelayInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([simulatedDelayInterceptor])), provideHttpClientTesting()],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should delay matching requests', async () => {
    let completed = false;
    http.get('data/client.json').subscribe(() => (completed = true));

    const req = httpMock.expectOne('data/client.json');
    req.flush({ client: {} });

    // Not yet resolved due to delay(300)
    expect(completed).toBe(false);

    await vi.advanceTimersByTimeAsync(300);
    expect(completed).toBe(true);
  });

  it('should not delay non-matching requests', () => {
    let completed = false;
    http.get('api/other-endpoint').subscribe(() => (completed = true));

    const req = httpMock.expectOne('api/other-endpoint');
    req.flush({});

    expect(completed).toBe(true);
  });
});
