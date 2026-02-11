import { signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';

// Factory that creates a lazy httpResource with activate/reload semantics
// - First call to load() activates the resource (idle → fetching)
// - Subsequent calls use the native ResourceRef.reload() API
export interface LazyHttpResource<T> {
  readonly resource: HttpResourceRef<T | undefined>;
  load(): void;
}

export function lazyHttpResource<T>(url: string): LazyHttpResource<T> {
  const active = signal(false);

  const resource = httpResource<T>(() => (active() ? url : undefined));

  return {
    resource,
    load(): void {
      if (active()) {
        resource.reload();
      } else {
        active.set(true);
      }
    },
  };
}
