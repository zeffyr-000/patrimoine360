import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppComponent } from './app';
import { getTranslocoTestingModule } from './testing/transloco-testing.module';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent, getTranslocoTestingModule()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        provideNoopAnimations(),
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have app title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app['appTitle']).toBe('Patrimoine360');
  });

  it('should toggle menu', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app['menuOpen']()).toBe(false);
    app.toggleMenu();
    expect(app['menuOpen']()).toBe(true);
    app.toggleMenu();
    expect(app['menuOpen']()).toBe(false);
  });
});
