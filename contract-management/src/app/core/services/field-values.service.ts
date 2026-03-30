import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EdoclinkApiService } from './edoclink-api.service';

export interface FieldValueOption {
  id: string;
  code: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class FieldValuesService {
  private api = inject(EdoclinkApiService);

  // Cache: fieldId → Map<code, label>
  private cache = new Map<string, Map<string, string>>();
  private loading = new Map<string, Promise<void>>();

  async preload(fieldIds: (string | number)[]): Promise<void> {
    await Promise.all(fieldIds.map(id => this.load(String(id))));
  }

  async load(fieldId: string): Promise<void> {
    if (this.cache.has(fieldId)) return;
    if (this.loading.has(fieldId)) return this.loading.get(fieldId);

    const promise = firstValueFrom(this.api.getFieldValues(fieldId))
      .then(res => {
        const map = new Map<string, string>();
        for (const item of res?.Result ?? []) {
          const code = item.Key?.Code ?? item.Key?.ID ?? '';
          const label = item.Description ?? item.Value ?? code;
          if (code) map.set(code, label);
        }
        this.cache.set(fieldId, map);
      })
      .catch(() => {
        this.cache.set(fieldId, new Map()); // empty on error — use code as fallback
      });

    this.loading.set(fieldId, promise);
    return promise;
  }

  /** Resolve a code to its label for a given field. Falls back to code itself. */
  resolve(fieldId: string | number, code: string): string {
    return this.cache.get(String(fieldId))?.get(code) ?? code;
  }

  hasLoaded(fieldId: string | number): boolean {
    return this.cache.has(String(fieldId));
  }
}
