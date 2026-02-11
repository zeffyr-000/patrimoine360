# Contributing Guide - Patrimoine360

## 📋 Prerequisites

- Node.js 18.19+ or 20.9+
- npm 9+

## 🔄 Development Workflow

```bash
npm install
npm start

# Before each commit
npm run lint
ng test --no-watch
```

## 📝 Code Standards

### Components

```typescript
// ✅ CORRECT — Modern Angular 21 component
@Component({
  selector: 'app-example',
  imports: [TranslocoModule, MatCardModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  readonly data = input.required<Data>();
  protected readonly derived = computed(() => this.data().value);
  private readonly service = inject(MyService);
}
```

**Rules**:

- Do NOT set `standalone: true` (default in Angular 21)
- ALWAYS separate template/styles into external files
- Use `input()`, `output()`, `computed()` (not decorators)
- `ChangeDetectionStrategy.OnPush` is mandatory

### Services — httpResource / lazyHttpResource

```typescript
// ✅ CORRECT — lazyHttpResource pattern
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private readonly _data = lazyHttpResource<DataType>(DATA_URLS.data);
  readonly dataResource = this._data.resource;

  load(): void {
    this._data.load();
  }

  readonly items = computed(() => this.dataResource.value()?.items ?? []);
  readonly loading = computed(() => this.dataResource.isLoading());
}
```

### Error Handling — ResourceErrorHandler

Each component wires its resources to the handler in the constructor:

```typescript
constructor() {
  this.service.load();
  this.errorHandler.watchResource(this.service.dataResource, 'errors.load_data', this.injector);
}
```

### Templates — Modern Control Flow

```html
<!-- ✅ CORRECT — New Angular 21 syntax -->
@if (loading()) {
<mat-spinner />
} @else { @for (item of items(); track item.id) {
<app-item [item]="item" />
} }

<!-- ❌ INCORRECT — Old syntax -->
<div *ngIf="loading">
  <div *ngFor="let item of items">...</div>
</div>
```

Use `@if`, `@for`, `@switch` — never `*ngIf`, `*ngFor`.

### Translations

All user-facing text uses Transloco with the `| transloco` pipe:

```html
<!-- ✅ CORRECT — Pipe syntax -->
<h1>{{ 'home.title' | transloco }}</h1>
<p>{{ 'home.items' | transloco: { count: items().length } }}</p>

<!-- ❌ INCORRECT — Structural directive -->
<div *transloco="let t">{{ t('home.title') }}</div>
```

### TypeScript

- `any` is forbidden — use `unknown` when type is uncertain
- Simple `//` comments in English only, NOT JSDoc `/** */`
- `console.error()` in error handlers, never empty functions

## 🧪 Testing (Vitest 4.0)

```bash
ng test --no-watch          # Before commit
ng test --code-coverage     # With coverage
```

```typescript
import { vi, expect } from 'vitest';

const mock = vi.fn().mockReturnValue(of(data));

afterEach(() => vi.restoreAllMocks());
```

Always assert against **translation keys**, NOT translated strings:

```typescript
// ✅ CORRECT
expect(element.textContent).toContain('home.title');

// ❌ INCORRECT
expect(element.textContent).toBe('Mon Patrimoine');
```

See [TESTING.md](TESTING.md) for detailed patterns.

## 📦 Commit Convention

```bash
feat(home): add asset category filter
fix(service): handle empty response
docs(readme): update installation guide
refactor(core): extract lazyHttpResource factory
```
