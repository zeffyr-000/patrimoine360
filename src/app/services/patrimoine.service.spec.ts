import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PatrimoineService } from './patrimoine.service';
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

describe('PatrimoineService', () => {
  let service: PatrimoineService;
  let httpMock: HttpTestingController;
  let appRef: ApplicationRef;

  const mockClientData = {
    client: {
      id: 'client-001',
      firstName: 'Jean',
      lastName: 'Dupont',
      age: 52,
      profession: "Chef d'entreprise",
      riskProfile: 'équilibré' as const,
      bankerName: 'Marie Laurent',
      bankerEmail: 'marie.laurent@banqueprivee.fr',
      clientSince: '2020-01-15',
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
      { type: 'real_estate' as const, label: 'Immobilier', value: 2600000, percent: 45.2, color: '#1a3e5c' },
      { type: 'life_insurance' as const, label: 'Assurance vie', value: 1450000, percent: 25.2, color: '#c9a55c' },
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
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [PatrimoineService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PatrimoineService);
    httpMock = TestBed.inject(HttpTestingController);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    flushAllPending();
    httpMock.verify();
    vi.restoreAllMocks();
  });

  // Helper: flush all pending resource requests so whenStable() can resolve
  function flushAllPending() {
    for (const url of ['client.json', 'overview.json', 'performance.json', 'actions.json', 'assets.json']) {
      for (const req of httpMock.match(`data/${url}`)) {
        req.flush(null);
      }
    }
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load client data via httpResource', async () => {
    service.loadClient();
    TestBed.tick();

    const req = httpMock.expectOne('data/client.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockClientData);

    flushAllPending();
    await appRef.whenStable();

    expect(service.client()).toBeTruthy();
    expect(service.client()?.firstName).toBe('Jean');
  });

  it('should load overview data and compute summary and header values', async () => {
    service.loadOverview();
    TestBed.tick();

    const req = httpMock.expectOne('data/overview.json');
    req.flush(mockOverviewData);

    flushAllPending();
    await appRef.whenStable();

    const summary = service.summary();
    expect(summary.totalValue).toBe(5753000);
    expect(summary.breakdown.length).toBe(2);

    const overview = service.overview();
    expect(overview?.netValue).toBe(5753000);
    expect(overview?.grossValue).toBe(6150000);
    expect(overview?.performance?.gain).toBe(333000);
    expect(overview?.performance?.gainPercent).toBe(6.14);
    expect(overview?.valuationDate).toBe('2026-01-25');
  });

  it('should load assets data via httpResource', async () => {
    service.loadAssets();
    TestBed.tick();

    const req = httpMock.expectOne('data/assets.json');
    req.flush(mockAssetsData);

    flushAllPending();
    await appRef.whenStable();

    expect(service.assets().length).toBe(2);
    expect(service.getAssetById('1')?.name).toBe('Test Asset');
  });

  it('should not fire HTTP until loadX() is called', () => {
    // No loadX() called — no requests should be pending
    httpMock.expectNone('data/client.json');
    httpMock.expectNone('data/overview.json');
    httpMock.expectNone('data/assets.json');
  });

  it('should expose loading state from httpResource', async () => {
    service.loadClient();
    TestBed.tick();

    // After trigger, resource is loading
    expect(service.clientResource.isLoading()).toBe(true);

    // Flush client request
    httpMock.expectOne('data/client.json').flush(mockClientData);

    flushAllPending();
    await appRef.whenStable();

    expect(service.clientResource.isLoading()).toBe(false);
  });

  it('should reload on second loadClient() call and send a new HTTP request', async () => {
    // First call activates the resource
    service.loadClient();
    TestBed.tick();
    httpMock.expectOne('data/client.json').flush(mockClientData);
    flushAllPending();
    await appRef.whenStable();
    expect(service.client()?.firstName).toBe('Jean');

    // Second call should trigger reload (new HTTP request)
    service.loadClient();
    TestBed.tick();
    const reloadReq = httpMock.expectOne('data/client.json');
    reloadReq.flush({
      client: { ...mockClientData.client, firstName: 'Pierre' },
    });
    flushAllPending();
    await appRef.whenStable();
    expect(service.client()?.firstName).toBe('Pierre');
  });

  it('should populate error signal on HTTP failure', async () => {
    service.loadClient();
    TestBed.tick();

    httpMock.expectOne('data/client.json').flush('Server Error', { status: 500, statusText: 'Error' });
    flushAllPending();
    await appRef.whenStable();

    expect(service.clientResource.error()).toBeTruthy();
    expect(service.error()).toBeTruthy();
  });
});
