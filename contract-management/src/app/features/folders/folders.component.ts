import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Pastas</h1>
        <span class="folder-count">{{ subfolders().length }} pastas</span>
      </div>
      <button class="btn-new-folder" (click)="onNewFolder()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nova Pasta
      </button>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb-bar">
      <nav class="breadcrumb-pill">
        <span class="breadcrumb-item clickable" (click)="navigateTo(null)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Raiz
        </span>
        @for (crumb of breadcrumb(); track crumb.id) {
          <span class="breadcrumb-sep">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
          @if ($last) {
            <span class="breadcrumb-item current">{{ crumb.name }}</span>
          } @else {
            <span class="breadcrumb-item clickable" (click)="navigateTo(crumb.id)">{{ crumb.name }}</span>
          }
        }
      </nav>
    </div>

    <!-- Subfolders Section -->
    @if (subfolders().length > 0) {
      <section class="section">
        <h2 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          Subpastas
          <span class="section-count">{{ subfolders().length }}</span>
        </h2>
        <div class="folders-grid">
          @for (folder of subfolders(); track folder.id) {
            <div class="folder-card" [class.terminated]="folder.status === 'terminated'" (click)="navigateTo(folder.id)">
              <div class="folder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                    [attr.fill]="folder.status === 'terminated' ? '#CBD5E1' : '#FB923C'"
                    [attr.stroke]="folder.status === 'terminated' ? '#94A3B8' : '#EA580C'"
                    fill-opacity="0.25"/>
                </svg>
              </div>
              <span class="folder-name">{{ folder.name }}</span>
              <div class="folder-meta">
                @if (folder.documentCount > 0) {
                  <span class="meta-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {{ folder.documentCount }} doc{{ folder.documentCount !== 1 ? 's' : '' }}
                  </span>
                }
                @if (folder.subfolderCount > 0) {
                  <span class="meta-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    {{ folder.subfolderCount }} pasta{{ folder.subfolderCount !== 1 ? 's' : '' }}
                  </span>
                }
                @if (folder.status) {
                  <span class="meta-status" [class.active]="folder.status === 'active'" [class.terminated]="folder.status === 'terminated'">
                    {{ folder.status === 'active' ? 'Ativo' : 'Terminado' }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- Documents Section -->
    @if (documentsInFolder().length > 0) {
      <section class="section">
        <h2 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Documentos nesta pasta
          <span class="section-count">{{ documentsInFolder().length }}</span>
        </h2>
        <div class="document-list">
          @for (doc of documentsInFolder(); track doc.id) {
            <div class="document-row">
              <div class="doc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div class="doc-info">
                <span class="doc-name">{{ doc.name }}</span>
                <span class="doc-code">{{ doc.code }}</span>
              </div>
              <span class="doc-status" [class]="'status-' + (doc.status || 'unknown')">{{ doc.statusLabel }}</span>
              <span class="doc-date">{{ doc.date }}</span>
            </div>
          }
        </div>
      </section>
    }

    <!-- Flows Section -->
    @if (flowsInFolder().length > 0) {
      <section class="section">
        <h2 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 3 21 3 21 8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
            <line x1="4" y1="4" x2="9" y2="9"/>
          </svg>
          Fluxos nesta pasta
          <span class="section-count">{{ flowsInFolder().length }}</span>
        </h2>
        <div class="document-list">
          @for (flow of flowsInFolder(); track flow.id) {
            <div class="document-row">
              <div class="doc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 3 21 3 21 8"/>
                  <line x1="4" y1="20" x2="21" y2="3"/>
                </svg>
              </div>
              <div class="doc-info">
                <span class="doc-name">{{ flow.subject }}</span>
                <span class="doc-code">{{ flow.code }}</span>
              </div>
              <span class="doc-status" [class]="'status-' + (flow.status || 'unknown')">{{ flow.statusLabel }}</span>
              <span class="doc-date">{{ flow.date }}</span>
            </div>
          }
        </div>
      </section>
    }

    <!-- Empty state -->
    @if (subfolders().length === 0 && documentsInFolder().length === 0 && flowsInFolder().length === 0) {
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <p class="empty-title">Esta pasta está vazia</p>
        <p class="empty-subtitle">Crie uma nova pasta ou adicione documentos para começar.</p>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      padding: 32px;
      max-width: 1280px;
      margin: 0 auto;
    }

    /* ── Page Header ──────────────────────────────────────────── */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .header-left {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #1E293B;
      margin: 0;
    }

    .folder-count {
      font-size: 14px;
      color: #94A3B8;
      font-weight: 500;
    }

    .btn-new-folder {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #F97316, #EA580C);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
    }

    .btn-new-folder:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
    }

    /* ── Breadcrumb ───────────────────────────────────────────── */
    .breadcrumb-bar {
      margin-bottom: 28px;
    }

    .breadcrumb-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.6);
      border-radius: 999px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    .breadcrumb-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
      color: #64748B;
      white-space: nowrap;
    }

    .breadcrumb-item.clickable {
      color: #0D9488;
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .breadcrumb-item.clickable:hover {
      color: #0F766E;
      text-decoration: underline;
    }

    .breadcrumb-item.current {
      color: #1E293B;
      font-weight: 700;
    }

    .breadcrumb-sep {
      display: inline-flex;
      align-items: center;
      color: #CBD5E1;
    }

    /* ── Sections ─────────────────────────────────────────────── */
    .section {
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 16px 0;
    }

    .section-count {
      font-size: 12px;
      font-weight: 600;
      color: #94A3B8;
      background: #F1F5F9;
      padding: 2px 8px;
      border-radius: 999px;
    }

    /* ── Folder Grid ──────────────────────────────────────────── */
    .folders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .folder-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.6);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    .folder-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(249, 115, 22, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06);
      border-color: rgba(249, 115, 22, 0.3);
    }

    .folder-card.terminated {
      opacity: 0.7;
    }

    .folder-card.terminated:hover {
      box-shadow: 0 8px 32px rgba(148, 163, 184, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06);
      border-color: rgba(148, 163, 184, 0.3);
    }

    .folder-icon {
      margin-bottom: 12px;
    }

    .folder-name {
      font-size: 14px;
      font-weight: 700;
      color: #1E293B;
      text-align: center;
      margin-bottom: 8px;
      word-break: break-word;
    }

    .folder-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }

    .meta-tag {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: #64748B;
      background: #F1F5F9;
      padding: 2px 8px;
      border-radius: 999px;
    }

    .meta-status {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 999px;
    }

    .meta-status.active {
      color: #059669;
      background: #D1FAE5;
    }

    .meta-status.terminated {
      color: #64748B;
      background: #E2E8F0;
    }

    /* ── Document / Flow List ─────────────────────────────────── */
    .document-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.6);
      border-radius: 12px;
      overflow: hidden;
    }

    .document-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.5);
      transition: background 0.15s ease;
    }

    .document-row:hover {
      background: rgba(241, 245, 249, 0.8);
    }

    .doc-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #F1F5F9;
      border-radius: 8px;
    }

    .doc-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .doc-name {
      font-size: 14px;
      font-weight: 600;
      color: #1E293B;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .doc-code {
      font-size: 12px;
      color: #94A3B8;
    }

    .doc-status {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }

    .status-Ready, .status-Dispatched {
      color: #059669;
      background: #D1FAE5;
    }

    .status-Pending, .status-Edition {
      color: #D97706;
      background: #FEF3C7;
    }

    .status-Canceled, .status-Closed {
      color: #64748B;
      background: #E2E8F0;
    }

    .status-unknown {
      color: #64748B;
      background: #F1F5F9;
    }

    .doc-date {
      font-size: 12px;
      color: #94A3B8;
      white-space: nowrap;
    }

    /* ── Empty State ──────────────────────────────────────────── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 32px;
      text-align: center;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 600;
      color: #64748B;
      margin: 16px 0 4px 0;
    }

    .empty-subtitle {
      font-size: 14px;
      color: #94A3B8;
      margin: 0;
    }
  `]
})
export class FoldersComponent {
  private store = inject(EdoclinkStoreService);

  currentFolderId = signal<number | null>(null);

  breadcrumb = computed(() => this.buildBreadcrumb(this.currentFolderId()));

  subfolders = computed(() => {
    const parentId = this.currentFolderId();
    const allFolders = this.store.folders;
    return allFolders
      .filter(f => f.parentId === parentId)
      .map(f => ({
        ...f,
        subfolderCount: allFolders.filter(sf => sf.parentId === f.id).length,
        documentCount: this.store.documents.filter(d => d.folderId === f.id).length,
      }));
  });

  documentsInFolder = computed(() => {
    const folderId = this.currentFolderId();
    return this.store.documents
      .filter((d: any) => d.folderId === folderId)
      .map((d: any) => ({
        id: d.id,
        name: d.title,
        code: d.ref ?? '',
        status: d.status ?? 'unknown',
        statusLabel: d.status ?? '—',
        date: d.date ? new Date(d.date).toLocaleDateString('pt-PT') : '',
      }));
  });

  flowsInFolder = computed(() => {
    const folderId = this.currentFolderId();
    return this.store.flows
      .filter((f: any) => f.folderId === folderId)
      .map((f: any) => ({
        id: f.id,
        subject: f.title,
        code: f.ref ?? '',
        status: f.status ?? 'unknown',
        statusLabel: f.status ?? '—',
        date: f.date ? new Date(f.date).toLocaleDateString('pt-PT') : '',
      }));
  });

  navigateTo(folderId: number | null): void {
    this.currentFolderId.set(folderId);
  }

  onNewFolder(): void {
    // Placeholder for new folder creation
    console.log('Create new folder in parent:', this.currentFolderId());
  }

  buildBreadcrumb(folderId: number | null): { id: number | null; name: string }[] {
    const crumbs: { id: number | null; name: string }[] = [];
    let current = folderId ? this.store.getFolder(folderId) : null;
    while (current) {
      crumbs.unshift({ id: current.id, name: current.name });
      current = current.parentId ? this.store.getFolder(current.parentId) : undefined;
    }
    return crumbs;
  }
}
