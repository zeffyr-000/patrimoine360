import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HomeComponent } from './home.component';
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;

  const mockData = {
    assets: [{ id: '1', name: 'Test', type: 'cash', value: 10000, currency: 'EUR', acquisitionDate: '2024-01-01' }],
    history: [{ date: '2024-01-01', totalValue: 10000 }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, getTranslocoTestingModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patrimoine on init', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('/data/patrimoine.json');
    req.flush(mockData);

    expect(component['patrimoineService'].assets().length).toBe(1);
  });
});
