import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let httpMock: HttpTestingController;
  let appRef: ApplicationRef;

  const mockDocumentsData = {
    documents: [
      { id: '1', title: 'Relevé Janvier', type: 'statement', date: '2026-01-31', icon: 'description' },
      { id: '2', title: 'Bilan fiscal', type: 'tax', date: '2025-12-31', icon: 'receipt' },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DocumentsService);
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
    httpMock.expectNone('data/documents.json');
  });

  it('should load documents via httpResource', async () => {
    service.load();
    TestBed.tick();

    const req = httpMock.expectOne('data/documents.json');
    req.flush(mockDocumentsData);

    await appRef.whenStable();

    expect(service.documents().length).toBe(2);
    expect(service.documents()[0].title).toBe('Relevé Janvier');
    expect(service.loading()).toBe(false);
  });

  it('should return empty array before load', () => {
    expect(service.documents()).toEqual([]);
  });
});
