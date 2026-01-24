# Testing Guide - Patrimoine360

This document provides comprehensive testing guidelines for the Patrimoine360 project.

## Framework: Vitest

**CRITICAL**: This project uses **Vitest**, NOT Jasmine/Karma.

### Why Vitest?

- **Modern**: Built for Vite, faster test execution
- **Compatible**: Jest-like API, easier to learn
- **Performance**: Faster than Karma with hot module replacement
- **Developer Experience**: Better error messages and debugging

## Common Patterns

### ❌ Jasmine Patterns to AVOID

```typescript
// DON'T: Jasmine spy creation
const spy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);

// DON'T: Jasmine timer API
fakeAsync(() => {
  tick(1000);
  // assertions
});

// DON'T: Jasmine mock call inspection
spy.calls.allArgs();
spy.calls.reset();
spy.and.returnValue(42);
```

### ✅ Vitest Patterns to USE

```typescript
import { vi } from 'vitest';

// DO: Vitest mock creation
const mockMethod1 = vi.fn();
const mockMethod2 = vi.fn();
const spy = { method1: mockMethod1, method2: mockMethod2 };

// DO: Vitest timer API
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
// assertions
vi.restoreAllMocks();

// DO: Vitest mock call inspection
spy.method1.mock.calls;
spy.method1.mockClear();
spy.method1.mockReturnValue(42);
spy.method1.mockImplementation(() => {
  throw new Error('fail');
});
```

## Testing Services

### Basic Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { vi, expect } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PatrimoineService } from './patrimoine.service';
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

describe('PatrimoineService', () => {
  let service: PatrimoineService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [PatrimoineService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PatrimoineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Testing HTTP Services

```typescript
describe('PatrimoineService', () => {
  it('should load assets', () => {
    const mockAssets = [
      { id: 1, name: 'Asset 1', value: 100000 },
      { id: 2, name: 'Asset 2', value: 50000 },
    ];

    service.loadPatrimoine().subscribe();

    const req = httpMock.expectOne('data/patrimoine.json');
    expect(req.request.method).toBe('GET');
    req.flush({ assets: mockAssets, history: [] });
  });

  it('should handle errors', () => {
    service.loadPatrimoine().subscribe();

    const req = httpMock.expectOne('data/patrimoine.json');
    req.error(new ProgressEvent('error'));

    expect(service.error()).toBe('Error loading patrimoine');
    expect(service.assets()).toEqual([]);
  });
});
```

### Testing with Timers

```typescript
import { vi } from 'vitest';

describe('Timer-dependent tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle timeout', () => {
    service.startTimer(3000);

    expect(service.isActive()).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(service.isActive()).toBe(false);
  });
});
```

## Transloco Testing

### Setup

Always use the shared testing module for consistency:

```typescript
import { getTranslocoTestingModule } from '../testing/transloco-testing.module';

TestBed.configureTestingModule({
  imports: [getTranslocoTestingModule()],
  // ...
});
```

### Assertion Strategy

**❌ INCORRECT**: Asserting against translated strings

```typescript
// DON'T: Fragile, breaks when translations change
expect(element.textContent).toBe('Mon Patrimoine');
```

**✅ CORRECT**: Asserting against translation keys

```typescript
// DO: Stable, tests the right contract
expect(element.textContent).toContain('home.title');
```

## Testing Signals

### Testing Signal Updates

```typescript
it('should update signal', () => {
  const initialValue = service.assets();
  expect(initialValue).toEqual([]);

  service.loadPatrimoine().subscribe();
  httpMock.expectOne('data/patrimoine.json').flush({ assets: mockAssets, history: [] });

  expect(service.assets()).toEqual(mockAssets);
});
```

### Testing Computed Signals

```typescript
it('should compute total value', () => {
  const mockAssets = [
    { id: 1, value: 100000 },
    { id: 2, value: 50000 },
  ];

  service.loadPatrimoine().subscribe();
  httpMock.expectOne('data/patrimoine.json').flush({ assets: mockAssets, history: [] });

  expect(service.totalValue()).toBe(150000);
});
```

## Code Style in Tests

### Comments

Use simple comments `//`, NOT JSDoc `/** */`:

```typescript
// ✅ CORRECT
// Test that the service initializes correctly
it('should initialize', () => { ... });

// ❌ INCORRECT
/**
 * Test that the service initializes correctly
 */
it('should initialize', () => { ... });
```

### Error Handling

Use `console.error()`, NOT empty functions:

```typescript
// ✅ CORRECT
service.doSomething().catch(err => console.error('Operation failed:', err));

// ❌ INCORRECT - violates @typescript-eslint/no-empty-function
service.doSomething().catch(() => {});
```

## Type Safety

Avoid `any`, use `unknown` with type assertions:

```typescript
// ❌ AVOID
const result: any = mockFn();

// ✅ PREFER
const result: unknown = mockFn();
const typedResult = result as ExpectedType;
```

## Coverage Goals

### Target Metrics

- **Overall**: 80% minimum
- **Services**: 70%+ (critical business logic)
- **Models**: 100% (simple interfaces, easy to test)
- **Components**: Focus on logic over templates

### Excluded from Coverage

- `src/environments/*.ts` - Configuration files
- `src/app/i18n/*.ts` - Translation files
- `*.html` files - Templates (E2E testing is not currently implemented in this POC; focus on component logic/unit tests)

### Running Coverage

```bash
# Full coverage report
npm run test:ci

# View detailed HTML report
open coverage/index.html
```

## Debugging Tests

### Vitest UI

```bash
npm run test -- --ui
```

Opens an interactive UI for debugging tests.

### Isolate Single Test

```typescript
// Run only this test
it.only('should do something', () => {
  // ...
});

// Skip this test
it.skip('should do something', () => {
  // ...
});
```

## Best Practices Summary

1. ✅ **Use Vitest API** (`vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()`)
2. ✅ **Use simple comments** (`//`), not JSDoc (`/** */`)
3. ✅ **Use translation keys** in assertions, not translated strings
4. ✅ **Use shared Transloco testing module** (`getTranslocoTestingModule()`)
5. ✅ **Clean up mocks** with `vi.restoreAllMocks()` in `afterEach()`
6. ✅ **Use `console.error()`** in error handlers, not empty functions
7. ✅ **Prefer `unknown`** over `any` for type safety
8. ✅ **Test business logic** thoroughly, templates optionally
9. ✅ **Aim for 80% coverage** overall, 70%+ for services
