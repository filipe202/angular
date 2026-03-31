import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-page-container">
      <!-- Search Input -->
      <div class="search-full">
        <svg class="search-full-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          class="search-full-input"
          type="text"
          placeholder="Pesquisar documentos, pastas, fluxos..."
          [ngModel]="query()"
          (ngModelChange)="query.set($event)"
        />
      </div>

      <!-- Type Tabs -->
      <div class="search-type-tabs">
        @for (tab of searchTabs; track tab.value) {
          <button
            class="search-type-tab"
            [class.active]="searchType() === tab.value"
            (click)="searchType.set(tab.value)"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Empty State -->
      @if (!query()) {
        <div class="search-empty-state">
          <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p class="search-empty-text">Pesquise documentos, pastas e fluxos</p>
        </div>

        <!-- Saved Searches -->
        <div class="saved-searches">
          <h3 class="saved-searches-title">Pesquisas guardadas</h3>
          <div class="saved-searches-list">
            @for (search of savedSearches; track search) {
              <button class="saved-search-chip" (click)="query.set(search)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                {{ search }}
              </button>
            }
          </div>
        </div>
      }

      <!-- Search Results -->
      @if (query()) {
        <div class="search-results">
          @if (!hasResults()) {
            <div class="search-empty-state">
              <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p class="search-empty-text">Sem resultados para "{{ query() }}"</p>
            </div>
          } @else {
            @for (group of groupedResults(); track group.type) {
              <div class="search-result-group">
                <h3 class="search-result-group-title">{{ group.label }}</h3>
                @for (item of group.items; track item.id) {
                  <div class="search-result-card">
                    <div class="search-result-icon">
                      @switch (group.type) {
                        @case ('documents') {
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        }
                        @case ('folders') {
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                          </svg>
                        }
                        @case ('flows') {
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <polyline points="16 18 22 12 16 6"/>
                            <polyline points="8 6 2 12 8 18"/>
                          </svg>
                        }
                        @default {
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                        }
                      }
                    </div>
                    <div class="search-result-info">
                      <span class="search-result-name">{{ item.name }}</span>
                      @if (item.description) {
                        <span class="search-result-desc">{{ item.description }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search-page-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px 20px;
    }

    .search-full {
      position: relative;
      margin: 28px 0;
    }

    .search-full-icon {
      width: 22px;
      height: 22px;
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--teal-500);
      pointer-events: none;
    }

    .search-full-input {
      width: 100%;
      padding: 18px 18px 18px 56px;
      border: 2px solid rgba(10, 186, 181, 0.2);
      border-radius: var(--radius-xl, 16px);
      font-size: 17px;
      font-family: inherit;
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: var(--glass-blur, blur(12px));
      -webkit-backdrop-filter: var(--glass-blur, blur(12px));
      transition: all 0.25s;
      outline: none;
      box-sizing: border-box;
    }

    .search-full-input:focus {
      border-color: var(--teal-400);
      background: white;
      box-shadow: 0 0 0 4px rgba(10, 186, 181, 0.08);
    }

    .search-full-input::placeholder {
      color: var(--gray-400, #9ca3af);
    }

    /* Type Tabs */
    .search-type-tabs {
      display: inline-flex;
      background: rgba(10, 186, 181, 0.06);
      border-radius: var(--radius-pill, 50px);
      padding: 4px;
      gap: 2px;
      margin-bottom: 24px;
    }

    .search-type-tab {
      padding: 8px 18px;
      border: none;
      border-radius: var(--radius-pill, 50px);
      background: transparent;
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-500, #6b7280);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .search-type-tab:hover {
      color: var(--teal-600, #0d9488);
    }

    .search-type-tab.active {
      background: white;
      color: var(--teal-600, #0d9488);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      font-weight: 600;
    }

    /* Empty State */
    .search-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .search-empty-icon {
      width: 64px;
      height: 64px;
      color: var(--gray-300, #d1d5db);
      margin-bottom: 16px;
    }

    .search-empty-text {
      font-size: 16px;
      color: var(--gray-400, #9ca3af);
      margin: 0;
    }

    /* Saved Searches */
    .saved-searches {
      margin-top: 8px;
    }

    .saved-searches-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--gray-500, #6b7280);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 12px;
    }

    .saved-searches-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .saved-search-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid var(--glass-border, rgba(10, 186, 181, 0.12));
      border-radius: var(--radius-pill, 50px);
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: var(--glass-blur, blur(12px));
      -webkit-backdrop-filter: var(--glass-blur, blur(12px));
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-600, #4b5563);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .saved-search-chip:hover {
      border-color: var(--teal-400, #2dd4bf);
      color: var(--teal-600, #0d9488);
      background: rgba(10, 186, 181, 0.06);
    }

    .saved-search-chip svg {
      color: var(--teal-500, #14b8a6);
    }

    /* Search Results */
    .search-results {
      margin-top: 8px;
    }

    .search-result-group {
      margin-bottom: 24px;
    }

    .search-result-group-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--gray-400, #9ca3af);
      margin: 0 0 10px;
    }

    .search-result-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      margin-bottom: 6px;
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: var(--glass-blur, blur(12px));
      -webkit-backdrop-filter: var(--glass-blur, blur(12px));
      border: 1px solid var(--glass-border, rgba(10, 186, 181, 0.08));
      border-radius: var(--radius-md, 12px);
      cursor: pointer;
      transition: all 0.2s;
    }

    .search-result-card:hover {
      transform: translateY(-2px);
      border-color: var(--teal-400, #2dd4bf);
      box-shadow: 0 4px 16px rgba(10, 186, 181, 0.1);
    }

    .search-result-icon {
      color: var(--teal-500, #14b8a6);
      flex-shrink: 0;
    }

    .search-result-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .search-result-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-800, #1f2937);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .search-result-desc {
      font-size: 12px;
      color: var(--gray-500, #6b7280);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class SearchComponent {
  private store = inject(EdoclinkStoreService);

  query = signal('');
  searchType = signal('all');

  searchTabs = [
    { label: 'Todos', value: 'all' },
    { label: 'Documentos', value: 'documents' },
    { label: 'Pastas', value: 'folders' },
    { label: 'Fluxos', value: 'flows' },
  ];

  savedSearches = [
    'Contratos ativos 2024',
    'Pendentes há mais de 5 dias',
    'Documentos por classificar',
  ];

  results = computed(() => this.store.searchAll(this.query()));

  hasResults = computed(() => {
    const r = this.results();
    return r.documents.length > 0 || r.folders.length > 0 || r.flows.length > 0;
  });

  groupedResults = computed(() => {
    const r = this.results();
    const type = this.searchType();
    const groups: { type: string; label: string; items: any[] }[] = [];
    if ((type === 'all' || type === 'documents') && r.documents.length > 0) {
      groups.push({ type: 'documents', label: 'Documentos', items: r.documents.map(d => ({ id: d.id, title: d.title, subtitle: d.ref + ' · ' + d.type, kind: 'doc' })) });
    }
    if ((type === 'all' || type === 'folders') && r.folders.length > 0) {
      groups.push({ type: 'folders', label: 'Pastas', items: r.folders.map(f => ({ id: f.id, title: f.name, subtitle: f.status, kind: 'folder' })) });
    }
    if ((type === 'all' || type === 'flows') && r.flows.length > 0) {
      groups.push({ type: 'flows', label: 'Fluxos', items: r.flows.map(f => ({ id: f.id, title: f.title, subtitle: f.ref + ' · ' + f.type, kind: 'flow' })) });
    }
    return groups;
  });
}
