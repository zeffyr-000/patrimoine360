import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;
  let appRef: ApplicationRef;

  const mockContactData = {
    advisor: {
      name: 'Marie Laurent',
      title: 'Conseillère en gestion de patrimoine',
      phone: '+33 1 23 45 67 89',
      email: 'marie.laurent@bank.com',
      availability: 'Lundi - Vendredi, 9h - 18h',
    },
    agency: {
      name: 'Agence Paris Haussmann',
      address: '123 Boulevard Haussmann, 75008 Paris',
      hours: 'Lundi - Vendredi, 9h - 18h',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not fire HTTP until load() is called', () => {
    httpMock.expectNone('data/contact.json');
  });

  it('should load contact data via httpResource', async () => {
    service.load();
    TestBed.tick();

    const req = httpMock.expectOne('data/contact.json');
    req.flush(mockContactData);

    await appRef.whenStable();

    expect(service.advisor()?.name).toBe('Marie Laurent');
    expect(service.agency()?.name).toBe('Agence Paris Haussmann');
    expect(service.loading()).toBe(false);
  });

  it('should expose loading state', async () => {
    service.load();
    TestBed.tick();

    expect(service.loading()).toBe(true);
    httpMock.expectOne('data/contact.json').flush(mockContactData);

    await appRef.whenStable();

    expect(service.loading()).toBe(false);
  });
});
