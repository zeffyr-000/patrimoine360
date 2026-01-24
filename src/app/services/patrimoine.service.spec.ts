import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach } from 'vitest';
import { PatrimoineService } from './patrimoine.service';

describe('PatrimoineService', () => {
  let service: PatrimoineService;
  let httpMock: HttpTestingController;

  const mockData = {
    assets: [
      {
        id: '1',
        name: 'Test Asset',
        type: 'cash',
        value: 10000,
        currency: 'EUR',
        acquisitionDate: '2024-01-01',
      },
      {
        id: '2',
        name: 'Test Stock',
        type: 'stocks',
        value: 5000,
        currency: 'EUR',
        acquisitionDate: '2024-01-01',
      },
    ],
    history: [
      { date: '2024-01-01', totalValue: 14000 },
      { date: '2024-02-01', totalValue: 15000 },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatrimoineService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PatrimoineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load patrimoine data', () => {
    service.loadPatrimoine().subscribe();

    const req = httpMock.expectOne('/data/patrimoine.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(service.assets().length).toBe(2);
    expect(service.totalValue()).toBe(15000);
  });

  it('should compute summary correctly', () => {
    service.loadPatrimoine().subscribe();

    const req = httpMock.expectOne('/data/patrimoine.json');
    req.flush(mockData);

    const summary = service.summary();
    expect(summary.totalValue).toBe(15000);
    expect(summary.breakdown.length).toBeGreaterThan(0);
  });

  it('should handle error gracefully', () => {
    service.loadPatrimoine().subscribe();

    const req = httpMock.expectOne('/data/patrimoine.json');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    expect(service.error()).toBeTruthy();
    expect(service.assets().length).toBe(0);
  });
});
