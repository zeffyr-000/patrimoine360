import { Injectable, computed } from '@angular/core';
import { lazyHttpResource } from '../core/lazy-http-resource';
import { DATA_URLS } from '../core/data-urls';
import { ContactData } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly _contact = lazyHttpResource<ContactData>(DATA_URLS.contact);
  readonly contactResource = this._contact.resource;

  load(): void {
    this._contact.load();
  }

  readonly advisor = computed(() => this.contactResource.value()?.advisor ?? null);
  readonly agency = computed(() => this.contactResource.value()?.agency ?? null);
  readonly loading = computed(() => this.contactResource.isLoading());
  readonly error = computed(() => this.contactResource.error());
}
