import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';
import { ContractService } from '../../../core/services/contract.service';
import { WorkflowService } from '../../../core/services/workflow.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { ContractStatus, CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-creator-dashboard',
  imports: [RouterLink, MatIconModule, MatButtonModule, StatusBadgeComponent, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="dash">
      <!-- Header -->
      <div class="dash-header animate-in">
        <div>
          <h1>Os Meus Contratos</h1>
          <p class="subtitle">Acompanhe o estado dos seus contratos</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/app/contracts/new" class="new-btn">
          <mat-icon>add</mat-icon> Novo Contrato
        </a>
      </div>

      <!-- KPIs -->
      <div class="kpi-row animate-in animate-delay-1">
        <a class="kpi" routerLink="/app/contracts" [queryParams]="{status: 'draft'}">
          <div class="kpi-icon draft"><mat-icon>edit_note</mat-icon></div>
          <div class="kpi-num">{{ drafts().length }}</div>
          <div class="kpi-label">Rascunhos</div>
          @if (drafts().length > 0) { <span class="kpi-link">Retomar &rarr;</span> }
        </a>
        <div class="kpi">
          <div class="kpi-icon review"><mat-icon>hourglass_top</mat-icon></div>
          <div class="kpi-num">{{ inApproval().length }}</div>
          <div class="kpi-label">Em Aprovação</div>
        </div>
        <a class="kpi" routerLink="/app/contracts" [queryParams]="{status: 'rejected'}">
          <div class="kpi-icon rejected"><mat-icon>reply</mat-icon></div>
          <div class="kpi-num">{{ rejected().length }}</div>
          <div class="kpi-label">Devolvidos</div>
          @if (rejected().length > 0) { <span class="kpi-link warn">Corrigir &rarr;</span> }
        </a>
        <div class="kpi">
          <div class="kpi-icon done"><mat-icon>verified</mat-icon></div>
          <div class="kpi-num">{{ completed().length }}</div>
          <div class="kpi-label">Concluídos</div>
        </div>
      </div>

      <!-- Contract list -->
      <div class="section animate-in animate-delay-3">
        <h2 class="section-title">Recentes</h2>

        @for (contract of myContracts().slice(0, 6); track contract.id; let i = $index) {
          <a class="contract-row" [routerLink]="'/app/contracts/' + contract.id"
             [style.animation-delay]="((i + 4) * 60) + 'ms'">
            <div class="row-left">
              <div class="row-type">{{ getTypeLabel(contract.type) }}</div>
              <h3>{{ contract.title }}</h3>
              <div class="row-meta">
                <span>{{ contract.value | currencyPt }}</span>
                <span class="sep">&middot;</span>
                <span>{{ contract.createdAt | relativeDate }}</span>
              </div>
            </div>

            <div class="row-right">
              <app-status-badge [status]="contract.status" />

              @if (contract.status === 'pending_approval' || contract.status === 'in_review') {
                <div class="progress-mini">
                  <div class="progress-track">
                    <div class="progress-fill" [style.width.%]="getProgress(contract.id)"></div>
                  </div>
                  <span class="progress-pct">{{ getProgress(contract.id) }}%</span>
                </div>
              }

              @if (contract.status === 'rejected' && contract.rejectionReason) {
                <div class="rejection-hint">
                  <mat-icon>info_outline</mat-icon>
                  {{ contract.rejectionReason }}
                </div>
              }
            </div>

            <mat-icon class="row-arrow">chevron_right</mat-icon>
          </a>
        }

        @if (myContracts().length === 0) {
          <div class="empty">
            <div class="empty-icon"><mat-icon>note_add</mat-icon></div>
            <h3>Ainda sem contratos</h3>
            <p>Comece por criar o seu primeiro contrato.</p>
            <a mat-raised-button color="primary" routerLink="/app/contracts/new">
              <mat-icon>add</mat-icon> Criar Contrato
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dash { max-width: 960px; margin: 0 auto; }

    .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }
    .new-btn { height: 40px !important; font-size: 13px !important; border-radius: var(--radius-sm) !important; }

    /* ── KPI Row ── */
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
    .kpi {
      background: var(--surface-card); border-radius: var(--radius-lg); padding: 18px 20px;
      border: 1px solid var(--border-subtle); display: flex; flex-direction: column; align-items: center;
      text-align: center; text-decoration: none; color: inherit;
      transition: all var(--t-normal); cursor: default;
    }
    a.kpi { cursor: pointer; }
    a.kpi:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--ch-teal); }
    .kpi-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
    }
    .kpi-icon mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .kpi-icon.draft { background: rgba(122,139,165,0.1); }
    .kpi-icon.draft mat-icon { color: var(--text-tertiary); }
    .kpi-icon.review { background: var(--ch-amber-subtle); }
    .kpi-icon.review mat-icon { color: var(--ch-amber); }
    .kpi-icon.rejected { background: rgba(232,93,74,0.06); }
    .kpi-icon.rejected mat-icon { color: var(--ch-coral); }
    .kpi-icon.done { background: rgba(5,150,105,0.08); }
    .kpi-icon.done mat-icon { color: var(--ch-emerald); }
    .kpi-num { font-size: 28px; font-weight: 800; color: var(--text-primary); line-height: 1; }
    .kpi-label { font-size: 12px; color: var(--text-tertiary); margin-top: 4px; font-weight: 500; }
    .kpi-link { font-size: 11px; font-weight: 700; color: var(--ch-teal); margin-top: 8px; }
    .kpi-link.warn { color: var(--ch-coral); }

    /* ── Section ── */
    .section-title { font-size: 14px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px; }

    /* ── Contract Rows ── */
    .contract-row {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; margin-bottom: 8px;
      background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
      text-decoration: none; color: inherit;
      transition: all var(--t-normal);
      animation: fadeInUp 0.4s var(--ease-out) both;
    }
    .contract-row:hover { box-shadow: var(--shadow-md); border-color: var(--ch-teal); }
    .contract-row:hover .row-arrow { opacity: 1; color: var(--ch-teal); }

    .row-left { flex: 1; min-width: 0; }
    .row-type {
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-teal); margin-bottom: 4px;
    }
    .row-left h3 { margin: 0 0 4px; font-size: 15px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .row-meta { font-size: 12px; color: var(--text-tertiary); display: flex; gap: 6px; }
    .sep { color: var(--border-light); }

    .row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
    .row-arrow { color: var(--text-tertiary); opacity: 0; transition: all 200ms; font-size: 20px !important; }

    .progress-mini { display: flex; align-items: center; gap: 6px; }
    .progress-track { width: 60px; height: 4px; background: var(--surface-muted); border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--ch-teal); border-radius: 2px; transition: width 0.6s var(--ease-out); }
    .progress-pct { font-size: 10px; font-weight: 700; color: var(--text-tertiary); }

    .rejection-hint {
      display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--ch-coral);
      max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .rejection-hint mat-icon { font-size: 14px; width: 14px; height: 14px; flex-shrink: 0; }

    /* ── Empty ── */
    .empty {
      text-align: center; padding: 60px 24px;
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
    }
    .empty-icon {
      width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 16px;
      background: var(--ch-teal-subtle);
      display: flex; align-items: center; justify-content: center;
    }
    .empty-icon mat-icon { font-size: 24px; width: 24px; height: 24px; color: var(--ch-teal); }
    .empty h3 { margin: 0 0 4px; font-size: 17px; font-weight: 700; color: var(--text-primary); }
    .empty p { color: var(--text-tertiary); font-size: 14px; margin: 0 0 20px; }
  `]
})
export class CreatorDashboardComponent {
  constructor(
    private authService: AuthService,
    private contractService: ContractService,
    private workflowService: WorkflowService
  ) {
    this.contractService.loadAll();
  }

  private userId = computed(() => this.authService.user()?.id ?? '');
  myContracts = computed(() => this.contractService.getContractsByCreator(this.userId())());
  drafts = computed(() => this.myContracts().filter(c => c.status === ContractStatus.DRAFT));
  inApproval = computed(() => this.myContracts().filter(c => c.status === ContractStatus.PENDING_APPROVAL || c.status === ContractStatus.IN_REVIEW));
  rejected = computed(() => this.myContracts().filter(c => c.status === ContractStatus.REJECTED));
  completed = computed(() => this.myContracts().filter(c => [ContractStatus.SIGNED, ContractStatus.ACTIVE, ContractStatus.APPROVED].includes(c.status)));

  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }
  getProgress(contractId: string) { return this.workflowService.getWorkflowProgress(contractId)(); }
}
