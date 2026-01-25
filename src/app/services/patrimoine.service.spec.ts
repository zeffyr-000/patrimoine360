import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PatrimoineService } from './patrimoine.service';
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

describe('PatrimoineService', () => {
  let service: PatrimoineService;
  let httpMock: HttpTestingController;

  const mockClientData = {
    client: {
      id: 'client-001',
      firstName: 'Jean',
      lastName: 'Dupont',
      age: 52,
      profession: "Chef d'entreprise",
      riskProfile: 'equilibre',
      banker: {
        name: 'Marie Laurent',
        email: 'marie.laurent@bank.com',
        phone: '+33 1 23 45 67 89',
      },
    },
  };

  const mockOverviewData = {
    grossValue: 6150000,
    liabilities: 397000,
    netValue: 5753000,
    diversificationScore: 72,
    riskLevel: 3,
    valuationDate: '2026-01-25',
    performance: {
      period: 'year',
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      gain: 333000,
      gainPercent: 6.14,
    },
    totalValue: 5753000,
    evolution: 333000,
    evolutionPercent: 6.14,
    breakdown: [
      { category: 'Immobilier', value: 2600000, percent: 45.2, color: '#1a3e5c' },
      { category: 'Assurance vie', value: 1450000, percent: 25.2, color: '#c9a55c' },
    ],
  };

  const mockAssetsData = {
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
  };

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [PatrimoineService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PatrimoineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load client data', async () => {
    service.loadClient().subscribe();

    const req = httpMock.expectOne('data/client.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockClientData);

    // Advance timer to account for simulated delay
    await vi.advanceTimersByTimeAsync(300);

    expect(service.client()).toBeTruthy();
    expect(service.client()?.firstName).toBe('Jean');
  });

  it('should load overview data and compute summary and header values', async () => {
    service.loadOverview().subscribe();

    const req = httpMock.expectOne('data/overview.json');
    req.flush(mockOverviewData);

    // Advance timer to account for simulated delay
    await vi.advanceTimersByTimeAsync(500);

    const summary = service.summary();
    expect(summary.totalValue).toBe(5753000);
    expect(summary.breakdown.length).toBe(2);

    // Check header values from merged data
    expect(service.totalValue()).toBe(5753000);
    expect(service.netValue()).toBe(5753000);
    expect(service.grossValue()).toBe(6150000);
    expect(service.headerPerformance()?.gain).toBe(333000);
    expect(service.headerPerformance()?.gainPercent).toBe(6.14);
    expect(service.valuationDate()).toBe('2026-01-25');
  });

  it('should load assets data', async () => {
    service.loadAssets().subscribe();

    const req = httpMock.expectOne('data/assets.json');
    req.flush(mockAssetsData);

    // Advance timer to account for simulated delay
    await vi.advanceTimersByTimeAsync(550);

    expect(service.assets().length).toBe(2);
    expect(service.getAssetById('1')?.name).toBe('Test Asset');
  });

  it('should handle error gracefully for overview', async () => {
    service.loadOverview().subscribe();

    const req = httpMock.expectOne('data/overview.json');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    // Advance timer to account for simulated delay
    await vi.advanceTimersByTimeAsync(500);

    expect(service.errorOverview()).toBeTruthy();
    expect(service.totalValue()).toBe(0);
  });

  it('should reload data on each call (no cache)', async () => {
    // First call
    service.loadOverview().subscribe();
    const req1 = httpMock.expectOne('data/overview.json');
    req1.flush(mockOverviewData);
    await vi.advanceTimersByTimeAsync(500);

    // Second call should make a new HTTP request (no cache)
    service.loadOverview().subscribe();
    const req2 = httpMock.expectOne('data/overview.json');
    req2.flush(mockOverviewData);
    await vi.advanceTimersByTimeAsync(500);

    expect(service.netValue()).toBe(5753000);
  });
});
