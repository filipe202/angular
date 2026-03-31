import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

interface DocumentItem {
  id: string;
  title: string;
  status: 'Pronto' | 'Em edicao' | 'Encerrado' | 'Anulado';
  reference: string;
  type: 'Correspondencia' | 'Interno' | 'Saida';
  date: string;
  entity: string;
  classification: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'other';
  fileName: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header-bar">
        <div class="page-title-group">
          <h1 class="page-title">
            Documentos
            <span class="count-badge">{{ filteredDocs().length }}</span>
          </h1>
        </div>
        <div class="page-actions">
          <div class="view-toggle">
            <button
              class="toggle-btn"
              [class.active]="viewMode() === 'table'"
              (click)="viewMode.set('table')"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="16" height="3" rx="1" fill="currentColor"/>
                <rect x="1" y="7" width="16" height="3" rx="1" fill="currentColor"/>
                <rect x="1" y="13" width="16" height="3" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <button
              class="toggle-btn"
              [class.active]="viewMode() === 'cards'"
              (click)="viewMode.set('cards')"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor"/>
                <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor"/>
                <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor"/>
                <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <button class="btn-new-doc" (click)="onNewDocument()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Novo Documento
          </button>
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="filter-chips">
        @for (chip of statusChips; track chip) {
          <button
            class="filter-chip"
            [class.active]="activeFilter() === chip"
            (click)="activeFilter.set(chip)"
          >
            {{ chip }}
            @if (activeFilter() === chip) {
              <span class="chip-count">{{ filteredDocs().length }}</span>
            }
          </button>
        }
      </div>

      <!-- Quick Filters Bar -->
      <div class="quick-filters">
        @for (qf of quickFilters; track qf) {
          <button
            class="quick-filter-btn"
            [class.active]="activeQuickFilter() === qf"
            (click)="activeQuickFilter.set(activeQuickFilter() === qf ? '' : qf)"
          >
            {{ qf }}
          </button>
        }
      </div>

      <!-- Results Info -->
      <div class="results-info">
        <span class="results-count">A mostrar {{ filteredDocs().length }} documentos</span>
        <div class="sort-select-wrap">
          <label class="sort-label">Ordenar por:</label>
          <select class="sort-select" [value]="sortBy()" (change)="onSortChange($event)">
            <option value="date-desc">Data (mais recente)</option>
            <option value="date-asc">Data (mais antigo)</option>
            <option value="title-asc">Titulo (A-Z)</option>
            <option value="title-desc">Titulo (Z-A)</option>
          </select>
        </div>
      </div>

      <!-- Document List (Card View) -->
      <div class="doc-grid">
        @for (doc of filteredDocs(); track doc.id) {
          <div class="doc-card">
            <div class="doc-type-indicator" [style.background]="getTypeColor(doc.type)"></div>
            <div class="doc-card-body">
              <div class="doc-card-header">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <span class="doc-status" [ngClass]="getStatusClass(doc.status)">
                  {{ doc.status }}
                </span>
              </div>
              <div class="doc-meta">
                <span class="doc-reference">{{ doc.reference }}</span>
                <span class="doc-meta-sep">&middot;</span>
                <span class="doc-type-label">{{ doc.type }}</span>
                <span class="doc-meta-sep">&middot;</span>
                <span class="doc-date">{{ doc.date }}</span>
              </div>
              <div class="doc-entity">{{ doc.entity }}</div>
              <div class="doc-classification">{{ doc.classification }}</div>
            </div>
            <div class="doc-card-file">
              <div class="file-thumb" [ngClass]="'file-' + doc.fileType">
                {{ doc.fileType | uppercase }}
              </div>
              <span class="file-name">{{ doc.fileName }}</span>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="4" width="32" height="40" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M16 16h16M16 24h12M16 32h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>Nenhum documento encontrado</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }

    .page {
      padding: 28px 32px;
      max-width: 1400px;
    }

    /* ── Page Header ────────────────────────────────────────────────── */

    .page-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 26px;
      font-weight: 800;
      color: #e2e8f0;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .count-badge {
      font-size: 13px;
      font-weight: 600;
      background: rgba(45, 212, 191, 0.15);
      color: #2dd4bf;
      padding: 2px 10px;
      border-radius: 20px;
    }

    .page-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .view-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 3px;
      gap: 2px;
    }

    .toggle-btn {
      border: none;
      background: transparent;
      color: #64748b;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
    }

    .toggle-btn.active {
      background: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
    }

    .toggle-btn:hover:not(.active) {
      color: #94a3b8;
    }

    .btn-new-doc {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
      color: #0f172a;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(45, 212, 191, 0.3);
    }

    .btn-new-doc:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(45, 212, 191, 0.4);
    }

    /* ── Filter Chips ───────────────────────────────────────────────── */

    .filter-chips {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .filter-chip {
      padding: 8px 18px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.04);
      color: #94a3b8;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(12px);
    }

    .filter-chip:hover:not(.active) {
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
    }

    .filter-chip.active {
      background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
      color: #0f172a;
      font-weight: 700;
      border-color: transparent;
      box-shadow: 0 2px 12px rgba(45, 212, 191, 0.3);
    }

    .chip-count {
      font-size: 11px;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.2);
      padding: 1px 7px;
      border-radius: 10px;
    }

    /* ── Quick Filters ──────────────────────────────────────────────── */

    .quick-filters {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .quick-filter-btn {
      padding: 6px 14px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      color: #64748b;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .quick-filter-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #94a3b8;
    }

    .quick-filter-btn.active {
      background: rgba(45, 212, 191, 0.1);
      color: #2dd4bf;
      border-color: rgba(45, 212, 191, 0.2);
    }

    /* ── Results Info ────────────────────────────────────────────────── */

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .results-count {
      font-size: 13px;
      color: #64748b;
    }

    .sort-select-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sort-label {
      font-size: 12px;
      color: #64748b;
    }

    .sort-select {
      padding: 6px 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      color: #cbd5e1;
      font-size: 12px;
      cursor: pointer;
      outline: none;
    }

    .sort-select option {
      background: #1e293b;
      color: #cbd5e1;
    }

    /* ── Document Grid ──────────────────────────────────────────────── */

    .doc-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .doc-card {
      display: flex;
      padding: 18px 22px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      backdrop-filter: blur(16px);
      transition: all 0.2s;
      cursor: pointer;
      overflow: hidden;
    }

    .doc-card:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .doc-type-indicator {
      width: 5px;
      min-height: 100%;
      border-radius: 3px;
      margin-right: 18px;
      flex-shrink: 0;
    }

    .doc-card-body {
      flex: 1;
      min-width: 0;
    }

    .doc-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .doc-title {
      font-size: 15px;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .doc-status {
      flex-shrink: 0;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .doc-status.status-pronto {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .doc-status.status-em-edicao {
      background: rgba(234, 179, 8, 0.15);
      color: #facc15;
    }

    .doc-status.status-encerrado {
      background: rgba(148, 163, 184, 0.15);
      color: #94a3b8;
    }

    .doc-status.status-anulado {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }

    .doc-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #64748b;
      margin-bottom: 6px;
    }

    .doc-meta-sep {
      color: #475569;
    }

    .doc-entity {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 4px;
    }

    .doc-classification {
      font-size: 11px;
      color: #475569;
      font-style: italic;
    }

    /* ── File Thumbnail ─────────────────────────────────────────────── */

    .doc-card-file {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      margin-left: 20px;
      flex-shrink: 0;
    }

    .file-thumb {
      width: 52px;
      height: 52px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.5px;
    }

    .file-thumb.file-pdf {
      background: rgba(239, 68, 68, 0.25);
      color: #f87171;
    }

    .file-thumb.file-docx {
      background: rgba(59, 130, 246, 0.25);
      color: #60a5fa;
    }

    .file-thumb.file-xlsx {
      background: rgba(34, 197, 94, 0.25);
      color: #4ade80;
    }

    .file-thumb.file-other {
      background: rgba(148, 163, 184, 0.2);
      color: #94a3b8;
    }

    .file-name {
      font-size: 10px;
      color: #475569;
      max-width: 72px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }

    /* ── Empty State ────────────────────────────────────────────────── */

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 0;
      color: #475569;
      gap: 16px;
    }

    .empty-state p {
      font-size: 15px;
      margin: 0;
    }
  `]
})
export class DocumentsComponent {
  private store = inject(EdoclinkStoreService);

  readonly statusChips = ['Todos', 'Prontos', 'Em edicao', 'Anulados', 'Encerrados'] as const;
  readonly quickFilters = [
    'Recentes',
    'Os meus',
    'Pendentes de classificacao',
    'Com entidade',
    'Contratos',
    'Correspondencia'
  ] as const;

  activeFilter = signal<string>('Todos');
  activeQuickFilter = signal<string>('');
  viewMode = signal<'table' | 'cards'>('cards');
  sortBy = signal<string>('date-desc');

  filteredDocs = computed<DocumentItem[]>(() => {
    const all: DocumentItem[] = (this.store.documents ?? []).map((doc: any) => this.mapDocument(doc));
    const filter = this.activeFilter();

    let result: DocumentItem[];
    switch (filter) {
      case 'Prontos':
        result = all.filter(d => d.status === 'Pronto');
        break;
      case 'Em edicao':
        result = all.filter(d => d.status === 'Em edicao');
        break;
      case 'Anulados':
        result = all.filter(d => d.status === 'Anulado');
        break;
      case 'Encerrados':
        result = all.filter(d => d.status === 'Encerrado');
        break;
      default:
        result = all;
    }

    const sort = this.sortBy();
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return b.date.localeCompare(a.date);
      }
    });

    return result;
  });

  getTypeColor(type: string): string {
    switch (type) {
      case 'Correspondencia':
        return '#2dd4bf';
      case 'Interno':
        return '#a78bfa';
      case 'Saida':
        return '#fb923c';
      default:
        return '#64748b';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pronto':
        return 'status-pronto';
      case 'Em edicao':
        return 'status-em-edicao';
      case 'Encerrado':
        return 'status-encerrado';
      case 'Anulado':
        return 'status-anulado';
      default:
        return '';
    }
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy.set(value);
  }

  onNewDocument(): void {
    // Placeholder for new document creation
  }

  private mapDocument(doc: any): DocumentItem {
    const statusMap: Record<string, DocumentItem['status']> = {
      Ready: 'Pronto',
      NotReady: 'Em edicao',
      Closed: 'Encerrado',
      Canceled: 'Anulado'
    };

    const typeMap: Record<string, DocumentItem['type']> = {
      Correspondencia: 'Correspondencia',
      Interno: 'Interno',
      Saida: 'Saida'
    };

    const extension = doc.MainFile?.Extension?.toLowerCase()?.replace('.', '') ?? doc.Files?.[0]?.Extension?.toLowerCase()?.replace('.', '') ?? 'other';
    const fileType: DocumentItem['fileType'] =
      extension === 'pdf' ? 'pdf' :
      extension === 'docx' || extension === 'doc' ? 'docx' :
      extension === 'xlsx' || extension === 'xls' ? 'xlsx' :
      'other';

    return {
      id: doc.Key?.ID ?? doc.Key?.Code ?? '',
      title: doc.Subject ?? 'Sem titulo',
      status: statusMap[doc.Status] ?? 'Em edicao',
      reference: doc.Key?.Code ?? `DOC-${doc.Year ?? ''}/${doc.Number ?? ''}`,
      type: typeMap[doc.DocumentTypeKey?.Name] ?? 'Correspondencia',
      date: doc.CreatedOn ? new Date(doc.CreatedOn).toLocaleDateString('pt-PT') : '',
      entity: doc.AuthorDepartment ?? '',
      classification: doc.Fields?.find((f: any) => f.Name === 'Classification')?.FormattedValue ?? '',
      fileType,
      fileName: doc.MainFile?.Name ?? doc.Files?.[0]?.Name ?? ''
    };
  }
}
