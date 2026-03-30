import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractService } from '../../../core/services/contract.service';
import { WorkflowService } from '../../../core/services/workflow.service';
import { SignatureService } from '../../../core/services/signature.service';
import { EdoclinkApiService } from '../../../core/services/edoclink-api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { WorkflowTimelineComponent } from '../../../shared/components/workflow-timeline/workflow-timeline.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { ContractStatus } from '../../../core/models/contract.model';
import { EdocFileDTO } from '../../../core/models/edoclink.types';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-contract-detail',
  imports: [
    RouterLink, DatePipe, FormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSnackBarModule, MatProgressSpinnerModule,
    StatusBadgeComponent, WorkflowTimelineComponent, CurrencyPtPipe,
  ],
  template: `
    <div class="detail">
      <a routerLink="/app/contracts" class="back animate-in">
        <mat-icon>arrow_back</mat-icon> Back to Contracts
      </a>

      @if (loading()) {
        <div class="loading-wrap animate-in">
          <mat-spinner diameter="40"></mat-spinner>
          <span>Loading contract...</span>
        </div>
      } @else if (contract(); as c) {

        <!-- ── HEADER ── -->
        <div class="detail-header animate-in animate-delay-1">
          <div class="header-left">
            <div class="header-meta">
              @if (c.edoclinkCode) {
                <span class="code-badge">{{ c.edoclinkCode }}</span>
              }
              <span class="type-tag">{{ c.flowTypeName || c.type }}</span>
            </div>
            <h1>{{ c.title }}</h1>
            @if (c.description) {
              <p class="desc">{{ c.description }}</p>
            }
          </div>
          <div class="header-right">
            <app-status-badge [status]="c.status" />
            @if (c.currentStageName) {
              <span class="stage-pill">
                <mat-icon>pending_actions</mat-icon>
                {{ c.currentStageName }}
              </span>
            }
            @if (pendingSignatureId()) {
              <a mat-raised-button color="primary" [routerLink]="'/app/sign/' + pendingSignatureId()" class="sign-cta">
                <mat-icon>draw</mat-icon> Assinar
              </a>
            }
          </div>
        </div>

        @if (c.rejectionReason) {
          <div class="rejection-banner animate-in animate-delay-1">
            <mat-icon>warning</mat-icon>
            <div>
              <strong>Contract returned: </strong>{{ c.rejectionReason }}
              <a mat-stroked-button routerLink="/app/contracts/new" style="margin-left:12px">Resubmit</a>
            </div>
          </div>
        }

        <!-- ── LAYOUT ── -->
        <div class="layout animate-in animate-delay-2">

          <!-- ── MAIN COLUMN ── -->
          <div class="main-col">

            <!-- Summary -->
            <div class="section">
              <h3 class="section-title">Summary</h3>
              <div class="info-grid">
                <div class="i-item">
                  <span class="i-label">Created by</span>
                  <span class="i-val">{{ c.createdBy.name }}</span>
                </div>
                @if (c.department) {
                  <div class="i-item">
                    <span class="i-label">Department</span>
                    <span class="i-val">{{ c.department }}</span>
                  </div>
                }
                @if (c.value) {
                  <div class="i-item">
                    <span class="i-label">Value</span>
                    <span class="i-val strong">{{ c.value | currencyPt }}</span>
                  </div>
                  <div class="i-item">
                    <span class="i-label">Currency</span>
                    <span class="i-val">{{ c.currency }}</span>
                  </div>
                }
                <div class="i-item">
                  <span class="i-label">Created</span>
                  <span class="i-val">{{ c.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div class="i-item">
                  <span class="i-label">Last updated</span>
                  <span class="i-val">{{ c.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                @if (c.paymentTerms) {
                  <div class="i-item">
                    <span class="i-label">Payment terms</span>
                    <span class="i-val">{{ c.paymentTerms }}</span>
                  </div>
                }
                <div class="i-item">
                  <span class="i-label">Auto-renew</span>
                  <span class="i-val">{{ c.autoRenew ? 'Yes' : 'No' }}</span>
                </div>
              </div>
            </div>

            <!-- Flow fields -->
            @if (extraFields().length) {
              <div class="section">
                <h3 class="section-title">Flow Fields</h3>
                <div class="info-grid">
                  @for (f of extraFields(); track f.Name) {
                    <div class="i-item">
                      <span class="i-label">{{ f.Label || f.Name }}</span>
                      <span class="i-val">{{ f.FormattedValue || f.Value || '—' }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Parties -->
            @if (c.parties.length) {
              <div class="section">
                <h3 class="section-title">Parties</h3>
                @for (party of c.parties; track party.id) {
                  <div class="party-row">
                    <div class="party-dot">{{ party.name[0] }}</div>
                    <div class="party-info">
                      <span class="party-name">{{ party.name }}</span>
                      <span class="party-role">{{ party.role }}</span>
                    </div>
                    <div class="party-contact">
                      <span>{{ party.email }}</span>
                      @if (party.taxId) { <span>NIF {{ party.taxId }}</span> }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Files -->
            <div class="section">
              <h3 class="section-title">
                Files
                @if (filesLoading()) {
                  <mat-spinner diameter="14" style="display:inline-block;margin-left:8px;vertical-align:middle"></mat-spinner>
                }
              </h3>
              @if (files().length) {
                @for (file of files(); track file.ID) {
                  <div class="file-row">
                    <div class="file-thumb">
                      <mat-icon>{{ fileIcon(file) }}</mat-icon>
                    </div>
                    <div class="file-info">
                      <span class="file-name">{{ file.Name }}</span>
                      <span class="file-meta">
                        {{ file.Extension?.toUpperCase() }}
                        @if (file.Size) { · {{ (file.Size / 1024 / 1024).toFixed(1) }} MB }
                        @if (file.CreatedOn) { · {{ file.CreatedOn | date:'dd/MM/yyyy' }} }
                      </span>
                    </div>
                    <div class="file-actions">
                      <button mat-icon-button (click)="viewFile(file)" title="View">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button (click)="downloadFile(file)" title="Download">
                        <mat-icon>download</mat-icon>
                      </button>
                    </div>
                  </div>
                }
              } @else if (!filesLoading()) {
                <p class="empty-section">No files attached.</p>
              }
            </div>

          </div>

          <!-- ── SIDE COLUMN ── -->
          <div class="side-col">

            <!-- Workflow timeline -->
            @if (workflow(); as wf) {
              <div class="side-panel">
                <h3 class="side-title">Workflow Steps</h3>
                <div class="wf-progress">
                  <div class="wf-bar">
                    <div class="wf-fill" [style.width.%]="workflowProgress()"></div>
                  </div>
                  <span class="wf-pct">{{ workflowProgress() }}%</span>
                </div>
                <app-workflow-timeline [steps]="wf.steps" />
              </div>
            }

            <!-- Approval actions -->
            @if (canApprove()) {
              <div class="side-panel actions-panel">
                <h3 class="side-title">Actions</h3>
                <mat-form-field appearance="outline" class="full-w">
                  <mat-label>Comment</mat-label>
                  <textarea matInput [(ngModel)]="comment" rows="3" placeholder="Optional..."></textarea>
                </mat-form-field>
                <div class="action-btns">
                  <button mat-raised-button color="primary" class="approve-btn" (click)="approve()" [disabled]="actionLoading()">
                    @if (actionLoading()) { <mat-spinner diameter="16" style="display:inline-block;margin-right:6px"></mat-spinner> }
                    <mat-icon>check</mat-icon> Approve
                  </button>
                  <button mat-stroked-button class="reject-btn" (click)="reject()" [disabled]="actionLoading()">
                    <mat-icon>close</mat-icon> Reject
                  </button>
                </div>
              </div>
            }

          </div>
        </div>

        <!-- ── FILE VIEWER MODAL ── -->
        @if (viewerFileName()) {
          <div class="viewer-overlay" (click)="closeViewer()">
            <div class="viewer-modal" (click)="$event.stopPropagation()">
              <div class="viewer-toolbar">
                <span class="viewer-name">{{ viewerFileName() }}</span>
                <button mat-icon-button (click)="closeViewer()"><mat-icon>close</mat-icon></button>
              </div>
              @if (viewerUrl()) {
                <iframe [src]="viewerUrl()!" class="viewer-frame" allow="fullscreen"></iframe>
              } @else {
                <div class="viewer-loading">
                  <mat-spinner diameter="36"></mat-spinner>
                  <span>Loading file...</span>
                </div>
              }
            </div>
          </div>
        }

      } @else {
        <div class="not-found animate-in">
          <mat-icon>search_off</mat-icon>
          <h2>Contract not found</h2>
          <a mat-stroked-button routerLink="/app/contracts">Back</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail { max-width: 1100px; margin: 0 auto; }

    .back {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--text-tertiary); text-decoration: none;
      font-size: 13px; font-weight: 500; margin-bottom: 18px;
      transition: color 200ms;
    }
    .back:hover { color: var(--ch-teal); }
    .back mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .loading-wrap {
      display: flex; align-items: center; gap: 14px;
      padding: 60px 0; color: var(--text-tertiary); font-size: 14px;
    }

    /* ── HEADER ── */
    .detail-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 20px; gap: 16px;
    }
    .header-left { flex: 1; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }

    .header-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }

    .code-badge {
      font-size: 11px; font-weight: 800; font-family: monospace;
      color: var(--text-secondary);
      background: var(--surface-muted); border: 1px solid var(--border-subtle);
      padding: 2px 10px; border-radius: var(--radius-full);
      letter-spacing: 0.04em;
    }
    .type-tag {
      display: inline-block; font-size: 10px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-teal); background: var(--ch-teal-subtle);
      padding: 3px 10px; border-radius: var(--radius-full);
    }
    .stage-pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; color: var(--ch-amber);
      background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
      padding: 4px 10px; border-radius: var(--radius-full);
    }
    .stage-pill mat-icon { font-size: 14px; width: 14px; height: 14px; }

    h1 { margin: 0 0 4px; font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
    .desc { margin: 0; font-size: 14px; color: var(--text-secondary); }

    .rejection-banner {
      display: flex; align-items: flex-start; gap: 10px; padding: 14px 18px;
      margin-bottom: 16px; background: rgba(232,93,74,0.06);
      border: 1px solid rgba(232,93,74,0.15); border-radius: var(--radius-md);
      color: var(--ch-coral); font-size: 13px;
    }
    .rejection-banner mat-icon { flex-shrink: 0; }

    /* ── LAYOUT ── */
    .layout { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
    .main-col { display: flex; flex-direction: column; gap: 0; }
    .side-col { display: flex; flex-direction: column; gap: 14px; }

    .section {
      padding: 18px 20px;
      background: var(--surface-card); border: 1px solid var(--border-subtle);
      border-bottom: none;
    }
    .section:first-child { border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
    .section:last-child { border-bottom: 1px solid var(--border-subtle); border-radius: 0 0 var(--radius-lg) var(--radius-lg); }
    .section:only-child { border-bottom: 1px solid var(--border-subtle); border-radius: var(--radius-lg); }

    .section-title {
      margin: 0 0 14px; font-size: 12px; font-weight: 800;
      color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em;
      display: flex; align-items: center;
    }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .i-item { display: flex; flex-direction: column; gap: 2px; }
    .i-label { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
    .i-val { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .i-val.strong { font-weight: 800; }

    /* Partes */
    .party-row {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 10px; padding: 10px 14px;
      background: var(--surface-bg); border-radius: var(--radius-sm);
    }
    .party-dot {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--ch-navy); color: var(--ch-teal-light);
      font-size: 12px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .party-info { flex: 1; }
    .party-name { font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; }
    .party-role { font-size: 11px; color: var(--ch-teal); font-weight: 600; }
    .party-contact { font-size: 11px; color: var(--text-tertiary); display: flex; flex-direction: column; text-align: right; }

    /* Ficheiros */
    .file-row {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 8px; padding: 10px 14px;
      background: var(--surface-bg); border-radius: var(--radius-sm);
      transition: background 150ms;
    }
    .file-row:hover { background: var(--surface-tinted); }
    .file-row:last-child { margin-bottom: 0; }
    .file-thumb {
      width: 36px; height: 36px; border-radius: 8px;
      background: var(--ch-teal-subtle); display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
    }
    .file-thumb mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ch-teal); }
    .file-info { flex: 1; min-width: 0; }
    .file-name { font-size: 13px; font-weight: 600; color: var(--text-primary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .file-meta { font-size: 11px; color: var(--text-tertiary); }
    .file-actions { display: flex; gap: 2px; flex-shrink: 0; }

    .empty-section { font-size: 13px; color: var(--text-tertiary); margin: 0; padding: 8px 0; }

    /* ── SIDE PANEL ── */
    .side-panel {
      padding: 18px; background: var(--surface-card);
      border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
    }
    .side-title {
      margin: 0 0 14px; font-size: 12px; font-weight: 800;
      color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em;
    }

    .wf-progress { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .wf-bar { flex: 1; height: 4px; background: var(--border-light); border-radius: 2px; overflow: hidden; }
    .wf-fill { height: 100%; background: var(--ch-teal); border-radius: 2px; transition: width 600ms var(--ease-out); }
    .wf-pct { font-size: 11px; font-weight: 700; color: var(--ch-teal); min-width: 30px; text-align: right; }

    .full-w { width: 100%; }
    .action-btns { display: flex; gap: 8px; }
    .approve-btn { flex: 1; }
    .reject-btn { flex: 1; border-color: rgba(232,93,74,0.2) !important; color: var(--ch-coral) !important; }
    .reject-btn:hover { background: rgba(232,93,74,0.04) !important; }
    .sign-cta { width: 100%; }

    /* ── FILE VIEWER ── */
    .viewer-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 200ms ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .viewer-modal {
      width: 90vw; height: 90vh; max-width: 1200px;
      background: var(--surface-card); border-radius: var(--radius-lg);
      display: flex; flex-direction: column;
      box-shadow: 0 24px 60px rgba(0,0,0,0.4);
      overflow: hidden;
      animation: slideUp 250ms var(--ease-out);
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
    .viewer-toolbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px; border-bottom: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }
    .viewer-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .viewer-loading {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 14px; color: var(--text-tertiary); font-size: 14px;
    }
    .viewer-frame { flex: 1; border: none; width: 100%; }

    /* ── NOT FOUND ── */
    .not-found { text-align: center; padding: 80px 24px; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--border-light); }
    .not-found h2 { color: var(--text-secondary); font-weight: 500; }
  `]
})
export class ContractDetailComponent implements OnInit {
  comment = '';
  private contractId: string;
  contract;
  workflow;

  loading = signal(true);
  filesLoading = signal(false);
  actionLoading = signal(false);
  files = signal<EdocFileDTO[]>([]);
  viewerUrl = signal<SafeResourceUrl | null>(null);
  viewerFileName = signal('');
  private viewerBlobUrl: string | null = null;

  private sanitizer = inject(DomSanitizer);
  private api = inject(EdoclinkApiService);

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private workflowService: WorkflowService,
    private signatureService: SignatureService,
    private snackBar: MatSnackBar,
  ) {
    this.contractId = this.route.snapshot.paramMap.get('id') ?? '';
    this.contract = this.contractService.getContractById(this.contractId);
    this.workflow = this.workflowService.getWorkflow(this.contractId);
  }

  async ngOnInit() {
    // If not in cache yet, trigger a full load
    if (!this.contract()) {
      await this.contractService.loadAll();
    }
    this.loading.set(false);

    // Load files for this flow
    const ref = this.contract()?.edoclinkRef;
    if (ref) {
      this.filesLoading.set(true);
      try {
        const result = await firstValueFrom(this.api.getFlowFiles(ref));
        this.files.set(result.Result ?? []);
      } catch {
        // no files or not a flow — files stay empty
      } finally {
        this.filesLoading.set(false);
      }
    } else if (this.contract()?.documents?.length) {
      // Map pre-loaded documents as files
      this.files.set(
        this.contract()!.documents.map(d => ({
          ID: d.edoclinkDocId ?? d.id,
          Name: d.name,
          Extension: d.type.split('/')[1],
          Size: d.size,
          CreatedOn: d.uploadedAt.toISOString(),
          MimeType: d.type,
        }))
      );
    }
  }

  // Extra fields (skip internal/empty values)
  extraFields = computed(() => {
    const fields = this.contract()?.fields ?? [];
    return fields.filter(f => (f.Value || f.FormattedValue) && f.Name);
  });

  workflowProgress = computed(() => {
    const wf = this.workflow();
    if (!wf || !wf.steps.length) return 0;
    const done = wf.steps.filter(s => s.status === 'approved').length;
    return Math.round((done / wf.steps.length) * 100);
  });

  canApprove = computed(() => {
    const s = this.contract()?.status;
    return s === ContractStatus.PENDING_APPROVAL || s === ContractStatus.IN_REVIEW;
  });

  pendingSignatureId = computed(() =>
    this.signatureService.allSignatures()
      .find(s => s.contractId === this.contractId && s.status === 'pending')?.id ?? null
  );

  fileIcon(file: EdocFileDTO): string {
    const ext = (file.Extension ?? '').toLowerCase();
    if (['pdf'].includes(ext)) return 'picture_as_pdf';
    if (['doc', 'docx'].includes(ext)) return 'description';
    if (['xls', 'xlsx'].includes(ext)) return 'table_chart';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    return 'insert_drive_file';
  }

  viewFile(file: EdocFileDTO) {
    if (!file.ID) return;
    this.viewerFileName.set(file.Name ?? 'File');
    this.viewerUrl.set(null); // show spinner while loading
    firstValueFrom(this.api.getFileContent(file.ID)).then(blob => {
      const url = URL.createObjectURL(blob);
      this.viewerBlobUrl = url;
      this.viewerUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    }).catch(() => {
      this.snackBar.open('Could not load file', 'OK', { duration: 3000 });
      this.viewerFileName.set('');
    });
  }

  downloadFile(file: EdocFileDTO) {
    if (!file.ID) return;
    firstValueFrom(this.api.getFileContent(file.ID)).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.Name ?? 'file';
      a.click();
      URL.revokeObjectURL(url);
    }).catch(() => {
      this.snackBar.open('Download failed', 'OK', { duration: 3000 });
    });
  }

  closeViewer() {
    this.viewerUrl.set(null);
    this.viewerFileName.set('');
    if (this.viewerBlobUrl) { URL.revokeObjectURL(this.viewerBlobUrl); this.viewerBlobUrl = null; }
  }

  async approve() {
    this.actionLoading.set(true);
    try {
      await this.contractService.approveContract(this.contractId, this.comment);
      this.snackBar.open('Contrato aprovado', 'OK', { duration: 3000 });
      this.comment = '';
    } catch {
      this.snackBar.open('Erro ao aprovar contrato', 'OK', { duration: 3000 });
    } finally {
      this.actionLoading.set(false);
    }
  }

  async reject() {
    this.actionLoading.set(true);
    try {
      await this.contractService.rejectContract(this.contractId, this.comment || 'Rejeitado');
      this.snackBar.open('Contrato rejeitado', 'OK', { duration: 3000 });
      this.comment = '';
    } finally {
      this.actionLoading.set(false);
    }
  }
}
