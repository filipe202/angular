import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { ContractService } from '../../../core/services/contract.service';
import { WorkflowService } from '../../../core/services/workflow.service';
import { SignatureService } from '../../../core/services/signature.service';
import { AuthService } from '../../../core/auth/auth.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { WorkflowTimelineComponent } from '../../../shared/components/workflow-timeline/workflow-timeline.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-signer-contract-view',
  imports: [RouterLink, DatePipe, MatIconModule, MatButtonModule, MatTabsModule, MatChipsModule, StatusBadgeComponent, WorkflowTimelineComponent, CurrencyPtPipe, RelativeDatePipe],
  template: `
    <div class="view">
      <a routerLink="/signer/dashboard" class="back animate-in">
        <mat-icon>arrow_back</mat-icon> Voltar ao Painel
      </a>

      @if (contract(); as c) {
        <!-- Header -->
        <div class="header animate-in animate-delay-1">
          <div class="header-left">
            <span class="type-tag">{{ getTypeLabel(c.type) }}</span>
            <h1>{{ c.title }}</h1>
            <p class="desc">{{ c.description }}</p>
          </div>
          <div class="header-right">
            <app-status-badge [status]="c.status" />
            @if (pendingSignature()) {
              <a mat-raised-button color="primary" [routerLink]="'/signer/sign/' + pendingSignature()!.id" class="sign-cta">
                <mat-icon>draw</mat-icon> Assinar Contrato
              </a>
            }
          </div>
        </div>

        <!-- Quick info -->
        <div class="info-bar animate-in animate-delay-2">
          <div class="info-item">
            <mat-icon>payments</mat-icon>
            <div><span class="info-label">Valor</span><span class="info-val">{{ c.value | currencyPt }}</span></div>
          </div>
          <div class="info-sep"></div>
          <div class="info-item">
            <mat-icon>date_range</mat-icon>
            <div><span class="info-label">Período</span><span class="info-val">{{ c.startDate | date:'dd/MM/yyyy' }} — {{ c.endDate | date:'dd/MM/yyyy' }}</span></div>
          </div>
          <div class="info-sep"></div>
          <div class="info-item">
            <mat-icon>autorenew</mat-icon>
            <div><span class="info-label">Renovação</span><span class="info-val">{{ c.autoRenew ? 'Automática' : 'Manual' }}</span></div>
          </div>
          @if (c.paymentTerms) {
            <div class="info-sep"></div>
            <div class="info-item">
              <mat-icon>receipt_long</mat-icon>
              <div><span class="info-label">Pagamento</span><span class="info-val">{{ c.paymentTerms }}</span></div>
            </div>
          }
        </div>

        <!-- Tabs -->
        <mat-tab-group class="tabs animate-in animate-delay-3" animationDuration="200ms">
          <!-- Documents -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>description</mat-icon> Documentos ({{ c.documents.length }})</ng-template>
            <div class="tab-body">
              @if (c.documents.length > 0) {
                @for (doc of c.documents; track doc.id) {
                  <div class="doc-row">
                    <div class="doc-thumb">
                      <mat-icon>{{ getDocIcon(doc.type) }}</mat-icon>
                    </div>
                    <div class="doc-info">
                      <span class="doc-name">{{ doc.name }}</span>
                      <span class="doc-meta">{{ formatFileSize(doc.size) }} &middot; {{ doc.uploadedAt | relativeDate }}</span>
                    </div>
                    <button mat-icon-button title="Pré-visualizar"><mat-icon>visibility</mat-icon></button>
                    <button mat-icon-button title="Download"><mat-icon>download</mat-icon></button>
                  </div>
                }
              } @else {
                <div class="tab-empty"><mat-icon>folder_open</mat-icon><p>Sem documentos.</p></div>
              }
            </div>
          </mat-tab>

          <!-- Parties -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>groups</mat-icon> Partes ({{ c.parties.length }})</ng-template>
            <div class="tab-body">
              <div class="party-grid">
                @for (party of c.parties; track party.id) {
                  <div class="party-card">
                    <div class="party-avatar">{{ party.name[0] }}</div>
                    <div class="party-info">
                      <span class="party-name">{{ party.name }}</span>
                      <span class="party-role">{{ party.role }}</span>
                      <div class="party-details">
                        <span><mat-icon>email</mat-icon> {{ party.email }}</span>
                        @if (party.taxId) { <span><mat-icon>badge</mat-icon> NIF {{ party.taxId }}</span> }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </mat-tab>

          <!-- Details -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>info</mat-icon> Detalhes</ng-template>
            <div class="tab-body">
              <div class="detail-grid">
                <div class="d-item"><span class="d-label">Tipo</span><span class="d-val">{{ getTypeLabel(c.type) }}</span></div>
                <div class="d-item"><span class="d-label">Departamento</span><span class="d-val">{{ c.department }}</span></div>
                <div class="d-item"><span class="d-label">Criado por</span><span class="d-val">{{ c.createdBy.name }}</span></div>
                <div class="d-item"><span class="d-label">Data Criação</span><span class="d-val">{{ c.createdAt | date:'dd/MM/yyyy HH:mm' }}</span></div>
                <div class="d-item"><span class="d-label">Última Atualização</span><span class="d-val">{{ c.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span></div>
                <div class="d-item"><span class="d-label">Ref. edoclink</span><span class="d-val mono">{{ c.edoclinkRef }}</span></div>
              </div>
              @if (c.tags && c.tags.length > 0) {
                <div class="tags-area">
                  <span class="d-label">Tags</span>
                  <mat-chip-set>
                    @for (tag of c.tags; track tag) { <mat-chip>{{ tag }}</mat-chip> }
                  </mat-chip-set>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Workflow -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>account_tree</mat-icon> Workflow</ng-template>
            <div class="tab-body">
              @if (workflow(); as wf) {
                <div class="wf-wrap">
                  <div class="wf-progress">
                    <span class="wf-pct">{{ progress() }}% completo</span>
                    <div class="wf-track"><div class="wf-fill" [style.width.%]="progress()"></div></div>
                  </div>
                  <app-workflow-timeline [steps]="wf.steps" />
                </div>
              } @else {
                <div class="tab-empty"><mat-icon>account_tree</mat-icon><p>Workflow não disponível.</p></div>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <div class="not-found animate-in">
          <mat-icon>search_off</mat-icon>
          <h2>Contrato não encontrado</h2>
          <a mat-stroked-button routerLink="/signer/dashboard">Voltar ao Painel</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .view { max-width: 1060px; margin: 0 auto; }
    .back {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--text-tertiary); text-decoration: none; font-size: 13px; font-weight: 500;
      margin-bottom: 18px; transition: color 200ms;
    }
    .back:hover { color: var(--ch-teal); }
    .back mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; gap: 20px; }
    .header-left { flex: 1; }
    .type-tag {
      display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 3px 10px; border-radius: var(--radius-full);
      margin-bottom: 8px;
    }
    h1 { margin: 0 0 6px; font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1.2; }
    .desc { margin: 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
    .sign-cta { height: 44px !important; font-size: 14px !important; padding: 0 20px !important; border-radius: var(--radius-md) !important; }

    .info-bar {
      display: flex; align-items: center; gap: 18px; padding: 14px 20px;
      background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
      margin-bottom: 20px;
    }
    .info-item { display: flex; align-items: center; gap: 8px; }
    .info-item mat-icon { color: var(--text-tertiary); font-size: 18px; width: 18px; height: 18px; }
    .info-label { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; display: block; }
    .info-val { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .info-sep { width: 1px; height: 28px; background: var(--border-light); }

    .tabs { margin-bottom: 24px; }
    ::ng-deep .tabs .mat-mdc-tab .mdc-tab__text-label { display: flex; align-items: center; gap: 5px; }
    ::ng-deep .tabs .mat-mdc-tab .mdc-tab__text-label mat-icon { font-size: 17px; width: 17px; height: 17px; }

    .tab-body { padding: 20px 0; }

    /* Documents */
    .doc-row {
      display: flex; align-items: center; gap: 14px;
      padding: 12px 16px; margin-bottom: 6px;
      background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
      transition: all var(--t-fast);
    }
    .doc-row:hover { box-shadow: var(--shadow-sm); border-color: var(--ch-teal); }
    .doc-thumb {
      width: 40px; height: 40px; border-radius: 8px; background: var(--ch-teal-subtle);
      display: flex; align-items: center; justify-content: center;
    }
    .doc-thumb mat-icon { color: var(--ch-teal); font-size: 18px; }
    .doc-info { flex: 1; }
    .doc-name { font-size: 13px; font-weight: 600; color: var(--text-primary); display: block; }
    .doc-meta { font-size: 11px; color: var(--text-tertiary); }
    .doc-row button { color: var(--text-tertiary); }
    .doc-row button:hover { color: var(--ch-teal); }

    /* Parties */
    .party-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
    .party-card {
      display: flex; gap: 14px; padding: 16px;
      background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
    }
    .party-avatar {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--ch-navy); color: var(--ch-teal-light);
      font-size: 16px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .party-info { display: flex; flex-direction: column; }
    .party-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
    .party-role { font-size: 11px; color: var(--ch-teal); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 1px; }
    .party-details { margin-top: 6px; display: flex; flex-direction: column; gap: 3px; }
    .party-details span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-tertiary); }
    .party-details mat-icon { font-size: 13px; width: 13px; height: 13px; }

    /* Details */
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .d-item { display: flex; flex-direction: column; gap: 3px; }
    .d-label { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
    .d-val { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .d-val.mono { font-family: var(--font-mono); font-size: 12px; color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 3px 8px; border-radius: var(--radius-sm); display: inline-block; }
    .tags-area { margin-top: 20px; display: flex; flex-direction: column; gap: 6px; }

    /* Workflow */
    .wf-wrap { max-width: 400px; }
    .wf-progress { margin-bottom: 18px; }
    .wf-pct { font-size: 12px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 6px; }
    .wf-track { height: 5px; background: var(--surface-muted); border-radius: 3px; overflow: hidden; }
    .wf-fill { height: 100%; background: var(--ch-teal); border-radius: 3px; transition: width 0.6s var(--ease-out); }

    .tab-empty { text-align: center; padding: 40px; color: var(--text-tertiary); }
    .tab-empty mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--border-light); display: block; margin: 0 auto 10px; }

    .not-found { text-align: center; padding: 80px 24px; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--border-light); }
    .not-found h2 { color: var(--text-secondary); font-weight: 500; }
  `]
})
export class SignerContractViewComponent {
  contract;
  workflow;
  progress;
  private contractId: string;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private workflowService: WorkflowService,
    private signatureService: SignatureService,
    private authService: AuthService
  ) {
    this.contractId = this.route.snapshot.paramMap.get('id') ?? '';
    this.contract = this.contractService.getContractById(this.contractId);
    this.workflow = this.workflowService.getWorkflow(this.contractId);
    this.progress = this.workflowService.getWorkflowProgress(this.contractId);
    if (this.contractService.allContracts().length === 0) {
      this.contractService.loadAll();
    }
    if (this.signatureService.allSignatures().length === 0) {
      this.signatureService.loadForCurrentUser();
    }
  }

  private userId = computed(() => this.authService.user()?.id ?? '');

  pendingSignature = computed(() => {
    const pending = this.signatureService.getPendingByUser(this.userId())();
    return pending.find(s => s.contractId === this.contractId) ?? null;
  });

  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }

  getDocIcon(type: string): string {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('sheet') || type.includes('xlsx') || type.includes('csv')) return 'table_chart';
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) return 'image';
    return 'description';
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }
}
