# Testing Guide - Patrimoine360

This project uses **Vitest 4.0** with native Angular support via `@angular/build:unit-test`.

## 🔧 Commands

```bash
ng test                     # Watch mode
ng test --no-watch          # Single run
ng test --code-coverage     # With coverage
```

## ⚡ Framework: Vitest

**CRITICAL**: This project uses **Vitest**, NOT Jasmine/Karma.

### Why Vitest?

- **Native Angular**: Official support via `@angular/build:unit-test`
- **Fast**: Faster than Karma
- **Modern**: Jest-compatible API

## ✅ Vitest API Reference

```typescript
import { vi, expect } from 'vitest';

// Mocks
const mockMethod = vi.fn();
mockMethod.mockReturnValue(42);
mockMethod.mockImplementation(() => of(data));

// Timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
await vi.advanceTimersByTimeAsync(1000); // For timers with promises

// Inspection
mockMethod.mock.calls;
mockMethod.mockClear();

// Cleanup (always in afterEach)
vi.restoreAllMocks();
vi.useRealTimers(); // If useFakeTimers() was used
```

### ❌ Jasmine Patterns to AVOID

```typescript
// DON'T use these
jasmine.createSpyObj(...)
fakeAsync(() => { tick(1000); })
spy.calls.allArgs()
spy.and.returnValue(42)
```

## 🧪 Testing Services with httpResource

Services use `httpResource` / `lazyHttpResource`. The Angular 21 test pattern requires `TestBed.tick()` and `ApplicationRef.whenStable()`:

```typescript
import { TestBed, ApplicationRef } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi, expect } from 'vitest';
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

describe('PatrimoineService', () => {
  let service: PatrimoineService;
  let httpMock: HttpTestingController;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PatrimoineService);
    httpMock = TestBed.inject(HttpTestingController);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    httpMock.verify();
  });

  // Helper to flush pending requests
  function flushAllPending(): void {
    try {
      httpMock.verify();
    } catch {
      /* pending requests still exist */
    }
  }

  it('should load client data', async () => {
    const mockClient = { client: { name: 'Test', age: 50 } };

    // 1. Activate the resource
    service.loadClient();
    TestBed.tick();

    // 2. Flush the HTTP request
    httpMock.expectOne('data/client.json').flush(mockClient);

    // 3. Flush pending + wait for stabilization
    flushAllPending();
    await appRef.whenStable();

    // 4. Assert signal value
    expect(service.clientResource.value()).toEqual(mockClient);
  });

  it('should reload on subsequent load() calls', async () => {
    service.loadClient();
    TestBed.tick();
    httpMock.expectOne('data/client.json').flush({ client: { name: 'V1' } });
    flushAllPending();
    await appRef.whenStable();

    // Second call → reload
    service.loadClient();
    TestBed.tick();
    httpMock.expectOne('data/client.json').flush({ client: { name: 'V2' } });
    flushAllPending();
    await appRef.whenStable();

    expect(service.clientResource.value()?.client?.name).toBe('V2');
  });

  it('should set error on HTTP 500', async () => {
    service.loadClient();
    TestBed.tick();
    httpMock.expectOne('data/client.json').flush('Error', { status: 500, statusText: 'Error' });
    flushAllPending();
    await appRef.whenStable();

    expect(service.clientResource.error()).toBeTruthy();
  });
});
```

## 📡 Testing HTTP Interceptors

```typescript
describe('retryInterceptor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([retryInterceptor])), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should retry GET requests on failure', async () => {
    http.get('data/client.json').subscribe(data => (result = data));

    // Attempt 1 fails
    httpMock.expectOne('data/client.json').flush('Error', { status: 500, statusText: 'Error' });
    await vi.advanceTimersByTimeAsync(1000);

    // Attempt 2 fails
    httpMock.expectOne('data/client.json').flush('Error', { status: 500, statusText: 'Error' });
    await vi.advanceTimersByTimeAsync(1000);

    // Attempt 3 succeeds
    httpMock.expectOne('data/client.json').flush({ client: {} });
    expect(result).toEqual({ client: {} });
  });
});
```

## 🌐 Transloco Testing

Always use the shared testing module:

```typescript
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

TestBed.configureTestingModule({
  imports: [getTranslocoTestingModule()],
});
```

### Assertion Strategy

Assert against translation **keys**, NOT translated strings:

```typescript
// ✅ CORRECT — Stable, tests the right contract
expect(element.textContent).toContain('home.title');

// ❌ INCORRECT — Fragile, breaks when translations change
expect(element.textContent).toBe('Mon Patrimoine');
```

## 📊 Coverage

### Configured Thresholds

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 60%       |
| Functions  | 60%       |
| Branches   | 50%       |
| Statements | 60%       |

### Exclusions

- `src/environments/*.ts` — Configuration files
- `src/app/i18n/*.ts` — Translation files
- `src/app/**/*.model.ts` — Interfaces without logic
- `src/app/**/index.ts` — Barrel exports

### Report

```bash
npm run test:ci
open coverage/index.html
```

## ✅ Best Practices Summary

1. ✅ **Use Vitest API** (`vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()`)
2. ✅ **Use simple comments** (`//`), not JSDoc (`/** */`)
3. ✅ **Assert translation keys**, NOT translated strings
4. ✅ **Use shared Transloco module** (`getTranslocoTestingModule()`)
5. ✅ **Clean up mocks** with `vi.restoreAllMocks()` in `afterEach()`
6. ✅ **Use `console.error()`** in error handlers, not empty functions
7. ✅ **Prefer `unknown`** over `any` for type safety
8. ✅ **Test business logic** thoroughly, templates optionally
