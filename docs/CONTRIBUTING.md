# Contributing Guide - Patrimoine360

## 📋 Prerequisites

- Node.js 18.19+ or 20.9+
- npm 9+

## 🚀 Development Workflow

```bash
# Install and start
npm install
npm start

# Before committing
npm run lint
ng test --no-watch
```

## 📝 Code Standards

### Components

```typescript
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

### Services

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private readonly _state = signal<State>({ items: [] }); // _private naming
  readonly state = this._state.asReadonly();
  readonly itemCount = computed(() => this._state().items.length);
}
```

### Templates

Use `@if`, `@for`, `@switch` (NOT `*ngIf`, `*ngFor`):

```html
@if (loading()) {
<mat-spinner />
} @else { @for (item of items(); track item.id) {
<app-item [item]="item" />
} }
```

### TypeScript

- Avoid `any`, use `unknown` when type is uncertain
- Use simple `//` comments in English, NOT JSDoc `/** */`
- Use `console.error()` in error handlers, NOT empty functions

### Translations

All user-facing text MUST use translation keys:

```html
<h1>{{ 'home.title' | transloco }}</h1>
```

## 🧪 Testing (Vitest)

```bash
ng test --no-watch          # Avant commit
```

```typescript
import { vi, expect } from 'vitest';

const mock = vi.fn().mockReturnValue(of(data));

afterEach(() => vi.restoreAllMocks());
```

Assert against translation **keys**, NOT translated strings.

## ✅ Commit Convention

```bash
feat(home): add asset category filter
fix(service): handle empty response
docs(readme): update installation guide
```
