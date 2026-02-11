import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { retryInterceptor } from './retry.interceptor';

describe('retryInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([retryInterceptor])), provideHttpClientTesting()],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should retry GET requests on failure', async () => {
    let result: unknown = null;
    http.get('data/client.json').subscribe(data => (result = data));

    // First attempt fails
    httpMock.expectOne('data/client.json').flush('Server Error', { status: 500, statusText: 'Error' });
    await vi.advanceTimersByTimeAsync(1000);

    // Second attempt (retry 1) also fails
    httpMock.expectOne('data/client.json').flush('Server Error', { status: 500, statusText: 'Error' });
    await vi.advanceTimersByTimeAsync(1000);

    // Third attempt (retry 2) succeeds
    httpMock.expectOne('data/client.json').flush({ client: {} });

    expect(result).toEqual({ client: {} });
  });

  it('should not retry non-GET requests', () => {
    let errorCaught = false;
    http.post('api/submit', {}).subscribe({ error: () => (errorCaught = true) });

    httpMock.expectOne('api/submit').flush('Error', { status: 500, statusText: 'Error' });

    // No retry — error propagated immediately
    expect(errorCaught).toBe(true);
  });

  it('should not retry GET requests on client errors (404)', () => {
    let errorCaught = false;
    http.get('data/missing.json').subscribe({ error: () => (errorCaught = true) });

    httpMock.expectOne('data/missing.json').flush('Not Found', { status: 404, statusText: 'Not Found' });

    // No retry — 404 is not transient
    expect(errorCaught).toBe(true);
  });

  it('should succeed on first try without retry', () => {
    let result: unknown = null;
    http.get('data/overview.json').subscribe(data => (result = data));

    httpMock.expectOne('data/overview.json').flush({ value: 42 });

    expect(result).toEqual({ value: 42 });
  });
});
