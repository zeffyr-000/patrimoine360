import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HomeComponent } from './home.component';
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, getTranslocoTestingModule()],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    appRef = TestBed.inject(ApplicationRef);

    // HomeComponent constructor calls loadClient() — flush effects to fire HTTP
    TestBed.tick();
  });

  // Helper: flush all pending resource requests so whenStable() can resolve
  function flushAllPending() {
    for (const url of ['client.json', 'overview.json', 'performance.json', 'actions.json', 'assets.json']) {
      for (const req of httpMock.match(`data/${url}`)) {
        req.flush(null);
      }
    }
  }

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    flushAllPending();
    expect(component).toBeTruthy();
  });

  it('should load client data automatically via httpResource', async () => {
    // httpResource fires automatically — no ngOnInit needed
    const clientReq = httpMock.expectOne('data/client.json');
    clientReq.flush(mockClientData);

    flushAllPending();
    await appRef.whenStable();

    expect(component['patrimoineService'].client()?.firstName).toBe('Jean');
  });
});
