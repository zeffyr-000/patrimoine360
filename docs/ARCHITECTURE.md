# Technical Architecture - Patrimoine360

## 🏗️ Overview

Patrimoine360 is a modern Angular 21 POC application for patrimony visualization in the **Private Banking** sector. Built with current best practices and a zoneless architecture using signals.

### Project Specifications

| Criteria           | Value                                                   |
| ------------------ | ------------------------------------------------------- |
| **Domain**         | Private Banking / Wealth Management                     |
| **Target**         | Desktop only (1280px+)                                  |
| **Language**       | French only (single locale)                             |
| **UX Inspiration** | [Google Flights](https://www.google.com/travel/flights) |

## 📱 Technology Stack

### Frontend

- **Angular 21** - Main framework with standalone components
- **TypeScript 5.9** - Strict typing and modern features
- **Angular Material 21** - UI components with Material Design 3
- **RxJS 7** - Reactive programming
- **Signals** - Angular's new reactivity API for state management
- **Transloco** - French translations with MessageFormat

### Development Tools

- **Angular CLI 21** - Scaffolding and build system (with esbuild)
- **ESLint** - Linting with strict Angular configuration
- **Prettier** - Consistent code formatting
- **Vitest** - Unit testing

## 🏛️ Component Architecture

### Project Structure

```
Application (app.component)
├── Layout Components
│   ├── Navigation (Angular Material toolbar)
│   └── Theme Provider (Angular Material 3)
└── Feature Modules (Lazy Loaded)
    └── Home Module
        └── HomeComponent (patrimoine overview)
```

### File Organization

```
src/app/
├── home/                 # Home page feature
│   ├── home.component.ts
│   ├── home.component.html
│   ├── home.component.scss
│   └── home.component.spec.ts
├── services/             # Application services
│   └── patrimoine.service.ts
├── models/               # TypeScript interfaces
│   └── patrimoine.model.ts
├── i18n/                 # Translations
│   └── fr.ts
├── testing/              # Test helpers
│   └── transloco-testing.module.ts
├── app.ts                # Root component
├── app.config.ts         # Application providers
└── app.routes.ts         # Route configuration
```

### Component Pattern

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslocoModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly patrimoineService = inject(PatrimoineService);

  protected readonly assets = this.patrimoineService.assets;
  protected readonly loading = this.patrimoineService.loading;

  protected readonly totalValue = computed(() => this.assets().reduce((sum, asset) => sum + asset.value, 0));
}
```

### Modern Control Flow

```typescript
// Template with new control flow syntax
@if (loading()) {
  <mat-spinner />
} @else {
  <div class="assets-grid">
    @for (asset of assets(); track asset.id) {
      <app-asset-card [asset]="asset" />
    }
  </div>
}
```

## 🔄 State Management

### Reactive Architecture with Signals

#### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class PatrimoineService {
  private readonly http = inject(HttpClient);

  // Private state with _underscore naming convention
  private readonly _assets = signal<Asset[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly state
  readonly assets = this._assets.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed values
  readonly totalValue = computed(() => this._assets().reduce((sum, asset) => sum + asset.value, 0));

  loadPatrimoine(): Observable<PatrimoineData> {
    this._loading.set(true);
    return this.http.get<PatrimoineData>(`${environment.dataPath}/patrimoine.json`).pipe(
      tap(assets => {
        this._assets.set(assets);
        this._loading.set(false);
      }),
      catchError(err => {
        console.error('Error loading assets:', err);
        this._error.set('Error loading assets');
        this._loading.set(false);
        return of([]);
      })
    );
  }
}
```

### Data Flow

```
Static JSON files → PatrimoineService → Signals → Components
```

## 🛣️ Routing System

### Route Configuration

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  // Future routes can be added here
];
```

### Lazy Loading

All feature components are lazy-loaded for optimal performance:

```typescript
loadComponent: () => import('./feature/feature.component');
```

## 📡 HTTP Communication

### Mock Data Pattern (POC)

Instead of a real API, this POC loads static JSON files:

```typescript
import { environment } from '../environments/environment';

// Service method
loadData(): Observable<Data[]> {
  return this.http.get<Data[]>(`${environment.dataPath}/file.json`).pipe(
    tap((data) => this._state.set(data)),
    catchError((err) => {
      console.error('Error loading data:', err);
      this._error.set('Error message');
      return of([]);
    })
  );
}
```

### Error Handling

All HTTP calls follow a consistent pattern:

- Return empty/default value on error
- Log error to console
- Set error signal to notify user

## 🎨 Theming and Styles

### Angular Material 3 Configuration

```scss
@use '@angular/material' as mat;

// M3 Theme Configuration
html {
  @include mat.theme(
    (
      color: (
        primary: mat.$rose-palette,
        tertiary: mat.$red-palette,
      ),
      typography: (
        brand-family: 'Roboto',
        bold-weight: 700,
      ),
    )
  );
}
```

### Design Tokens - Private Banking 2026

Design inspired by [Google Flights](https://www.google.com/travel/flights):

- **Color Palette**: Elegant, muted tones (navy, gold accents, white space)
- **Typography**: Roboto (local via @fontsource) with clear hierarchy
- **Layout**: Card-based design, data visualization focus, generous whitespace
- **Target Resolution**: 1280px+ screens only (no mobile breakpoints)
- **Components**: Large data cards, interactive charts, clear CTAs

## 🧪 Testing Strategy

### Unit Testing with Vitest

```typescript
import { vi, expect } from 'vitest';

describe('PatrimoineService', () => {
  let service: PatrimoineService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PatrimoineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    httpMock.verify();
  });

  it('should load assets', () => {
    const mockAssets = [{ id: 1, name: 'Asset 1' }];

    service.loadPatrimoine().subscribe();

    // In tests we hardcode the expected path; the actual service resolves it via environment variable
    const req = httpMock.expectOne('data/patrimoine.json');
    req.flush(mockAssets);

    expect(service.assets()).toEqual(mockAssets);
  });
});
```

## 🚀 Performance Optimizations

### Bundle Optimization

- **Lazy Loading**: On-demand route loading
- **Tree Shaking**: Dead code elimination
- **Local Fonts**: @fontsource/roboto for better performance

### Runtime Performance

- **Zoneless**: No Zone.js for optimal change detection
- **OnPush Strategy**: Explicit change detection
- **Signals**: Fine-grained reactivity without subscriptions
- **Computed Values**: Automatic memoization

## 📱 Responsive Design

### Material Breakpoints

```scss
.assets-grid {
  display: grid;
  gap: 16px;

  // Mobile
  grid-template-columns: 1fr;

  // Tablet
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🔐 Security Best Practices

### Data Sanitization

- **XSS Protection**: Angular's automatic sanitization
- **Type Safety**: Strict TypeScript to prevent runtime errors

### Build Security

- **Source maps**: Disabled in production
- **Content Security Policy**: CSP configuration ready

---

This architecture ensures a **scalable**, **maintainable**, and **performant** POC following modern Angular best practices.
