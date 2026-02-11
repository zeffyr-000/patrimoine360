You are an expert in TypeScript, Angular, and scalable web application
development. You write functional, maintainable, performant, and accessible code
following Angular and TypeScript best practices.

## Project Specifications

**Domain**: Private Banking / Wealth Management (Banque Privée)
**Target**: Desktop only (no mobile/responsive)
**Language**: French only (single locale: fr)
**UX Inspiration**: Private Banking 2026 - clean, data-rich, card-based layouts with elegant navy-gold palette

### Design Guidelines (Private Banking 2026)

- **Color palette**: Elegant, muted tones (navy, gold accents, white space)
- **Typography**: Clean, professional fonts with clear hierarchy
- **Layout**: Card-based design, data visualization focus, generous whitespace
- **Components**: Large data cards, interactive charts, clear CTAs
- **NO mobile breakpoints** - design for 1280px+ screens only

## Architecture Overview

Patrimoine360 is an Angular 21 POC for patrimony visualization. The app uses a
zoneless architecture with signals.

### Key Patterns

- **lazyHttpResource**: Factory wrapping `httpResource` with lazy activation and `reload()` support
- **rxResource**: For complex/parameterized streams (e.g., AI analysis with trigger signal)
- **ResourceErrorHandler**: Centralized error handling via MatSnackBar + Transloco
- **DATA_URLS**: Single source of truth for all data endpoint URLs
- **retryInterceptor**: Retries failed GET requests (2 retries, 1s delay)

### Data Flow

```
Static JSON files → httpResource/rxResource → Services → Signals → Components
```

### Service Pattern — lazyHttpResource

Services use `lazyHttpResource` factory from `core/lazy-http-resource.ts`. NO `.subscribe()` calls:

```typescript
import { lazyHttpResource } from '../core/lazy-http-resource';
import { DATA_URLS } from '../core/data-urls';

@Injectable({ providedIn: 'root' })
export class ExampleService {
  private readonly _data = lazyHttpResource<DataType>(DATA_URLS.endpoint);
  readonly dataResource = this._data.resource;

  load(): void {
    this._data.load();
  }

  readonly items = computed(() => this.dataResource.value()?.items ?? []);
  readonly loading = computed(() => this.dataResource.isLoading());
}
```

### Error Handling in Components

Components wire resources to `ResourceErrorHandler` in constructor:

```typescript
constructor() {
  this.service.load();
  this.errorHandler.watchResource(this.service.dataResource, 'errors.load_data', this.injector);
}
```

## Developer Commands

```
npm start          # Dev server (http://localhost:4200)
ng test            # Vitest unit tests (watch mode)
ng test --no-watch # Vitest unit tests (single run)
npm run lint       # ESLint
```

## Testing Framework: Vitest 4.0 (Angular 21 Native)

CRITICAL: Ce projet utilise Vitest 4.0 avec le support natif Angular via `@angular/build:unit-test`.

### Vitest Patterns

```typescript
import { vi, expect } from 'vitest';

// Mock: vi.fn().mockReturnValue(of(data))
// Timers: vi.useFakeTimers(), vi.advanceTimersByTime(1000)
// Inspect: mockMethod.mock.calls, mockMethod.mockClear()
// Cleanup: vi.restoreAllMocks() in afterEach()
```

### httpResource Test Pattern

```typescript
// 1. Activate the resource
service.loadClient();
TestBed.tick();

// 2. Flush the HTTP request
httpMock.expectOne('data/client.json').flush(mockData);

// 3. Wait for stabilization
flushAllPending();
await appRef.whenStable();

// 4. Assert signal value
expect(service.clientResource.value()).toEqual(mockData);
```

### Test Setup with Mocks

Use factory functions from `testing/` - NEVER inline TranslocoTestingModule.forRoot():

```typescript
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HomeComponent, getTranslocoTestingModule()],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
});

afterEach(() => vi.restoreAllMocks());
```

### Translation Keys in Tests

Test against translation keys, NOT translated strings:

```typescript
expect(element.textContent).toContain('home.total_patrimoine');
```

## Code Style

- Comments: Simple `//` in English only, NOT JSDoc `/** */`
- Error handlers: Use `console.error()`, NOT empty functions

## TypeScript Best Practices

- Use strict type checking; prefer type inference when obvious
- Avoid `any`; use `unknown` when type is uncertain
- Use `(value as Type)` instead of casting with `any`

## Angular Patterns

### Component Structure

```typescript
@Component({
  selector: 'app-example',
  imports: [TranslocoModule, MatButtonModule], // Standalone by default in v21
  templateUrl: './example.component.html', // ALWAYS separate files
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  readonly data = input.required<Data>(); // input() not @Input()
  protected readonly derived = computed(() => this.data().value);
}
```

### Component Rules

- Must NOT set `standalone: true` - it's the default in Angular v21+
- Use `input()`, `output()` functions instead of decorators; `computed()` for derived state
- ALWAYS separate files for templates/styles - never inline
- Use `host` object in decorator instead of `@HostBinding`/`@HostListener`

### Services

- Use `providedIn: 'root'` for singletons, `inject()` instead of constructor injection
- Use `lazyHttpResource` factory + `DATA_URLS` for data loading
- Use `computed()` for derived state from resource values
- Use `set()` or `update()` on signals, NOT `mutate()`

## Material Design Integration

- Use `MatSnackBar` for notifications with translation keys
- MatMenu max-width 280px - use `MatSidenav` with `position="end"` for wider panels
- For sidenav: use `mode="over"` and sync state with `(openedChange)` event

## Transloco i18n

French only - translations in `i18n/fr.ts` with MessageFormat:

```typescript
"items": "{count, plural, =0 {Aucun élément} one {# élément} other {# éléments}}"
```

All user-facing text MUST use translation keys via `TranslocoModule`.

### Template usage: ALWAYS use the `| transloco` pipe

```html
<!-- GOOD: pipe syntax -->
<h1>{{ 'home.title' | transloco }}</h1>
<p>{{ 'home.items' | transloco: { count: items().length } }}</p>

<!-- BAD: structural directive *transloco="let t" + t() -->
<div *transloco="let t">
  <h1>{{ t('home.title') }}</h1>
</div>
```

The `*transloco="let t"` directive wraps the entire block in an `<ng-container>`,
adds an unnecessary template variable, and is harder to tree-shake. Prefer the
pipe which is simpler, composable, and works directly in any binding.

## Templates

- Use `@if`, `@for`, `@switch` (NOT `*ngIf`, `*ngFor`)
- Use `class` bindings (NOT `ngClass`), `style` bindings (NOT `ngStyle`)
- No arrow functions in templates; no globals like `new Date()`
- Use `| async` pipe for observables

## Accessibility

- MUST pass AXE checks and WCAG AA
- Leverage Material's built-in ARIA and keyboard navigation
- Desktop keyboard navigation is essential

## Styling

- Desktop only: min-width 1280px, no mobile media queries
- Use CSS Grid and Flexbox for layouts
- Follow Private Banking UX patterns: clean cards, data tables, elegant whitespace

## Key Files

- `core/lazy-http-resource.ts`: Factory for lazy httpResource with activate/reload
- `core/data-urls.ts`: Centralized data endpoint URLs
- `core/resource-error-handler.ts`: Snackbar error handler for resources
- `core/interceptors/retry.interceptor.ts`: HTTP retry for GET requests
- `core/interceptors/simulated-delay.interceptor.ts`: Simulated network latency
- `app.config.ts`: Providers (zoneless, router, HTTP interceptors, Transloco)
- `app.routes.ts`: Lazy-loaded routes
- `testing/transloco-testing.module.ts`: Transloco test helper
- `models/`: TypeScript interfaces (8 domain model files)
- `public/data/`: Static JSON mock data (8 files)
