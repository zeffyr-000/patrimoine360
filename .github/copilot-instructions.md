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

### Key Service Patterns

- PatrimoineService (`services/patrimoine.service.ts`): Loads mock data from static JSON files, provides reactive state via signals

### Data Flow

```
Static JSON files → PatrimoineService → Signals → Components
```

### HTTP Error Handling Pattern

All HTTP calls follow this pattern - return empty/default value on error, notify user:

```typescript
return this.http.get<Response>(`${environment.dataPath}/file.json`).pipe(
  tap(data => this._state.set(data)),
  catchError(err => {
    console.error('Error loading data:', err);
    this._error.set('Error message');
    return of(defaultValue);
  })
);
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
- Use signals with `_private` pattern: `private readonly _state = signal<T>()` / `readonly state = this._state.asReadonly()`
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

- `app.config.ts`: Providers (zoneless, router, HTTP, Transloco)
- `app.routes.ts`: Lazy-loaded routes
- `testing/transloco-testing.module.ts`: Transloco test helper
- `models/`: TypeScript interfaces
- `public/data/`: Static JSON mock data
