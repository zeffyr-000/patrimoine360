# Technical Architecture - Patrimoine360

## 🏗️ Overview

Patrimoine360 is a modern **Angular 21** POC for wealth visualization in **Private Banking**. The application uses a **zoneless** architecture with **signals** and Angular 21's `httpResource` / `rxResource` APIs.

| Criteria   | Value                               |
| ---------- | ----------------------------------- |
| **Domain** | Private Banking / Wealth Management |
| **Target** | Desktop only (1280px+)              |
| **Locale** | French only                         |
| **Design** | Private Banking 2026 — Navy & Gold  |

## 📱 Technology Stack

| Technology            | Version | Role                                  |
| --------------------- | ------- | ------------------------------------- |
| Angular               | 21.1    | Main framework (standalone, zoneless) |
| TypeScript            | 5.9     | Strict mode                           |
| Angular Material      | 21.1    | UI — Material Design 3                |
| Transloco             | —       | i18n (French, MessageFormat)          |
| RxJS                  | 7.8     | Reactive programming                  |
| Vitest                | 4.0     | Unit testing (native Angular support) |
| Chart.js / ng2-charts | —       | Charts (doughnut chart)               |

## 🏛️ Project Structure

```
src/app/
├── core/                            # Shared infrastructure
│   ├── constants/                   # Business constants and icons
│   │   ├── icons.constants.ts
│   │   └── patrimoine.constants.ts
│   ├── interceptors/
│   │   ├── retry.interceptor.ts     # Retry GET (2 retries, 1s delay)
│   │   └── simulated-delay.interceptor.ts
│   ├── pipes/
│   │   └── markdown.pipe.ts
│   ├── utils/
│   │   ├── format.utils.ts          # formatCurrency, etc.
│   │   └── patrimoine.utils.ts      # Business helpers
│   ├── data-urls.ts                 # Centralized URLs
│   ├── lazy-http-resource.ts        # Lazy httpResource factory
│   ├── resource-error-handler.ts    # Snackbar error handler for resources
│   └── index.ts                     # Barrel export
│
├── features/
│   ├── patrimoine/
│   │   ├── components/              # Reusable patrimoine components
│   │   │   ├── client-header/
│   │   │   ├── hero-summary/
│   │   │   └── ...
│   │   └── views/                   # Lazy-loaded pages
│   │       ├── overview/            # Overview + AI analysis
│   │       ├── performance/         # Detailed performance
│   │       ├── assets/              # Asset details
│   │       └── actions/             # Manager timeline
│   ├── contact/                     # Advisor contact page
│   └── documents/                   # Documents page
│
├── home/                            # Shell (toolbar + sidenav + router-outlet)
│   └── home.component.ts
│
├── shared/
│   ├── components/
│   │   ├── stat-card/               # Reusable stat card
│   │   └── performance-badge/       # Performance badge
│   ├── pipes/
│   │   └── asset-category.pipe.ts   # Asset category pipe
│   └── index.ts
│
├── services/
│   ├── patrimoine.service.ts        # Main service (5 httpResource + 1 rxResource)
│   ├── contact.service.ts           # Contact service (lazyHttpResource)
│   └── documents.service.ts         # Documents service (lazyHttpResource)
│
├── models/                          # TypeScript interfaces
│   ├── client.model.ts
│   ├── asset.model.ts
│   ├── overview.model.ts
│   ├── performance.model.ts
│   ├── action.model.ts
│   ├── contact.model.ts
│   ├── document.model.ts
│   ├── ai.model.ts
│   └── index.ts
│
├── i18n/
│   └── fr.ts                       # French translations (MessageFormat)
│
├── testing/
│   └── transloco-testing.module.ts  # Transloco test helper
│
├── app.config.ts                    # Providers (zoneless, router, HTTP, Transloco)
├── app.routes.ts                    # Lazy-loaded routes
└── app.ts                           # Root component
```

## 🔄 Data Flow

```
Static JSON (public/data/)
    ↓
lazyHttpResource / httpResource / rxResource
    ↓
Services (PatrimoineService, ContactService, DocumentsService)
    ↓
Signals (resource.value(), computed())
    ↓
Components (templates with @if, @for)
```

## ⚙️ Key Patterns

### lazyHttpResource — On-Demand Loading

Custom factory that wraps `httpResource` with lazy activation:

```typescript
// core/lazy-http-resource.ts
export function lazyHttpResource<T>(url: string): LazyHttpResource<T> {
  const active = signal(false);
  const resource = httpResource<T>(() => (active() ? url : undefined));

  return {
    resource,
    load(): void {
      if (active()) {
        resource.reload(); // Native Angular reload
      } else {
        active.set(true); // First activation
      }
    },
  };
}
```

- Resource stays **idle** (`undefined`) until `load()` is called
- First `load()` activates the resource, subsequent calls use `reload()`
- Each component calls `load()` in its constructor → loads at the right time

### Service Pattern — httpResource + rxResource

```typescript
@Injectable({ providedIn: 'root' })
export class PatrimoineService {
  // Lazy HTTP resources
  private readonly _client = lazyHttpResource<ClientData>(DATA_URLS.client);
  readonly clientResource = this._client.resource;
  loadClient(): void { this._client.load(); }

  // rxResource for AI analysis (on-demand via trigger signal)
  private readonly _aiTrigger = signal(0);
  readonly aiAnalysisResource = rxResource({
    params: () => {
      const trigger = this._aiTrigger();
      return trigger === 0 ? undefined : trigger;
    },
    stream: () => this.http.get<AiAnalysis>(DATA_URLS.aiAnalysis).pipe(...),
  });

  // Computed accessors
  readonly client = computed(() => this.clientResource.value()?.client ?? null);
  readonly loading = computed(() => this.clientResource.isLoading() || ...);
}
```

### ResourceErrorHandler — Centralized Error Handling

```typescript
@Injectable({ providedIn: 'root' })
export class ResourceErrorHandler {
  watchResource(resource: HttpResourceRef<unknown>, errorKey: string, injector: Injector): void {
    effect(
      () => {
        if (resource.error()) {
          this.snackBar.open(this.transloco.translate(errorKey), this.transloco.translate('common.close'), {
            duration: 5000,
            panelClass: 'error-snackbar',
          });
        }
      },
      { injector }
    );
  }
}
```

Each component wires its resources to the handler in the constructor:

```typescript
constructor() {
  this.patrimoineService.loadOverview();
  this.errorHandler.watchResource(
    this.patrimoineService.overviewResource,
    'errors.load_overview',
    this.injector
  );
}
```

### DATA_URLS — Centralized URLs

```typescript
// core/data-urls.ts
export const DATA_URLS = {
  client: `${environment.dataPath}/client.json`,
  overview: `${environment.dataPath}/overview.json`,
  // ...8 endpoints
} as const;
```

## 🛣️ Routing

Lazy-loaded routes with `HomeComponent` as shell:

```
/               → redirect → /overview
/overview       → OverviewComponent (overview + AI)
/performance    → PerformanceComponent
/assets         → AssetsComponent
/actions        → ActionsComponent
/contact        → ContactComponent (outside Home shell)
/documents      → DocumentsComponent (outside Home shell)
```

## 📡 HTTP Interceptors

| Interceptor                 | Role                                        |
| --------------------------- | ------------------------------------------- |
| `retryInterceptor`          | Retries failed GET requests (2 retries, 1s) |
| `simulatedDelayInterceptor` | Simulates network latency (300-800ms)       |

Registered in `app.config.ts` via `withInterceptors([...])`.

## 🤖 Simulated AI Streaming

The overview page displays an AI analysis with streaming effect:

1. `rxResource` loads JSON data via a trigger signal
2. An Observable splits content into words
3. `concatMap` + `delay(30ms)` simulates word-by-word streaming
4. `takeUntilDestroyed` + `Subject cancel$` manage lifecycle

## 🎨 Design System

### Private Banking 2026

- **Palette**: Navy, gold accents, generous whitespace
- **Typography**: Roboto (local via @fontsource)
- **Layout**: Cards, CSS Grid, data visualization
- **Target**: 1280px+ (desktop only)

### Material Design 3

M3 theme configured in `theme.scss` with custom palette.

## 🚀 Performance

- **Zoneless**: No Zone.js (`provideZonelessChangeDetection()`)
- **OnPush**: Explicit change detection on all components
- **Signals**: Fine-grained reactivity without manual subscriptions
- **Lazy Loading**: Components loaded on demand
- **Preloading**: `PreloadAllModules` for navigation anticipation
- **Local Fonts**: @fontsource/roboto (no CDN)

## 🧪 Tests

52 passing Vitest tests. See [TESTING.md](TESTING.md) for detailed patterns.

- **Framework**: Vitest 4.0 with native Angular support
- **httpResource pattern**: `TestBed.tick()` → `req.flush()` → `await appRef.whenStable()`
- **Coverage thresholds**: 60% (lines, functions, statements), 50% (branches)
