import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  const mockClientData = {
    client: {
      id: 'client-001',
      firstName: 'Jean',
      lastName: 'Dupont',
      age: 52,
      profession: "Chef d'entreprise",
      riskProfile: 'equilibre',
      bankerName: 'Marie Laurent',
      clientSince: '2020-01-15',
    },
  };

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [HomeComponent, getTranslocoTestingModule()],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load client data on init', async () => {
    fixture.detectChanges();

    // Expect client call from ngOnInit
    const clientReq = httpMock.expectOne('data/client.json');
    clientReq.flush(mockClientData);

    await vi.advanceTimersByTimeAsync(500);

    expect(component['patrimoineService'].client()?.firstName).toBe('Jean');

    httpMock.verify();
  });
});
