import { Injectable, computed } from '@angular/core';
import { lazyHttpResource } from '../core/lazy-http-resource';
import { DATA_URLS } from '../core/data-urls';
import { DocumentsData } from '../models/document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private readonly _documents = lazyHttpResource<DocumentsData>(DATA_URLS.documents);
  readonly documentsResource = this._documents.resource;

  load(): void {
    this._documents.load();
  }

  readonly documents = computed(() => this.documentsResource.value()?.documents ?? []);
  readonly loading = computed(() => this.documentsResource.isLoading());
  readonly error = computed(() => this.documentsResource.error());
}
