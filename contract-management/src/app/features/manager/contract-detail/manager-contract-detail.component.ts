import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContractService } from '../../../core/services/contract.service';
import { WorkflowService } from '../../../core/services/workflow.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { WorkflowTimelineComponent } from '../../../shared/components/workflow-timeline/workflow-timeline.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_TYPE_LABELS, ContractStatus } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manager-contract-detail',
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, StatusBadgeComponent, WorkflowTimelineComponent, CurrencyPtPipe],
  template: `
    <div class="detail">
      <a routerLink="/manager/contracts" class="back animate-in">
        <mat-icon>arrow_back</mat-icon> Voltar aos Contratos
      </a>

      @if (contract(); as c) {
        <!-- Header -->
        <div class="detail-header animate-in animate-delay-1">
          <div class="header-left">
            <span class="type-tag">{{ getTypeLabel(c.type) }}</span>
            <h1>{{ c.title }}</h1>
            <p class="desc">{{ c.description }}</p>
          </div>
          <app-status-badge [status]="c.status" />
        </div>

        <div class="layout animate-in animate-delay-2">
          <!-- Main -->
          <div class="main-col">
            <!-- Info grid -->
            <div class="section">
              <h3 class="section-title">Informações</h3>
              <div class="info-grid">
                <div class="i-item"><span class="i-label">Criador</span><span class="i-val">{{ c.createdBy.name }}</span></div>
                <div class="i-item"><span class="i-label">Departamento</span><span class="i-val">{{ c.department }}</span></div>
                <div class="i-item"><span class="i-label">Valor</span><span class="i-val strong">{{ c.value | currencyPt }}</span></div>
                <div class="i-item"><span class="i-label">Moeda</span><span class="i-val">{{ c.currency }}</span></div>
                <div class="i-item"><span class="i-label">Início</span><span class="i-val">{{ c.startDate | date:'dd/MM/yyyy' }}</span></div>
                <div class="i-item"><span class="i-label">Fim</span><span class="i-val">{{ c.endDate | date:'dd/MM/yyyy' }}</span></div>
                <div class="i-item"><span class="i-label">Renovação</span><span class="i-val">{{ c.autoRenew ? 'Automática' : 'Manual' }}</span></div>
                @if (c.paymentTerms) {
                  <div class="i-item"><span class="i-label">Pagamento</span><span class="i-val">{{ c.paymentTerms }}</span></div>
                }
              </div>
            </div>

            <!-- Parties -->
            <div class="section">
              <h3 class="section-title">Partes</h3>
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

            <!-- Documents -->
            <div class="section">
              <h3 class="section-title">Documentos</h3>
              @for (doc of c.documents; track doc.id) {
                <div class="doc-row">
                  <div class="doc-thumb"><mat-icon>description</mat-icon></div>
                  <div class="doc-info">
                    <span class="doc-name">{{ doc.name }}</span>
                    <span class="doc-size">{{ (doc.size / 1024 / 1024).toFixed(1) }} MB</span>
                  </div>
                  <button mat-icon-button><mat-icon>download</mat-icon></button>
                </div>
              }
            </div>
          </div>

          <!-- Sidebar -->
          <div class="side-col">
            @if (workflow(); as wf) {
              <div class="side-panel">
                <h3 class="side-title">Workflow</h3>
                <app-workflow-timeline [steps]="wf.steps" />
              </div>
            }

            @if (canApprove()) {
              <div class="side-panel actions-panel">
                <h3 class="side-title">Ações</h3>
                <mat-form-field appearance="outline" class="full-w">
                  <mat-label>Comentário</mat-label>
                  <textarea matInput [(ngModel)]="comment" rows="3" placeholder="Opcional..."></textarea>
                </mat-form-field>
                <div class="action-btns">
                  <button mat-raised-button color="primary" class="approve-btn" (click)="approve()">
                    <mat-icon>check</mat-icon> Aprovar
                  </button>
                  <button mat-stroked-button class="reject-btn" (click)="reject()">
                    <mat-icon>close</mat-icon> Rejeitar
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="not-found animate-in">
          <mat-icon>search_off</mat-icon>
          <h2>Contrato não encontrado</h2>
          <a mat-stroked-button routerLink="/manager/contracts">Voltar</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail { max-width: 1100px; margin: 0 auto; }
    .back {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--text-tertiary); text-decoration: none; font-size: 13px; font-weight: 500;
      margin-bottom: 18px; transition: color 200ms;
    }
    .back:hover { color: var(--ch-teal); }
    .back mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 16px; }
    .header-left { flex: 1; }
    .type-tag {
      display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 3px 10px; border-radius: var(--radius-full);
      margin-bottom: 6px;
    }
    h1 { margin: 0 0 4px; font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
    .desc { margin: 0; font-size: 14px; color: var(--text-secondary); }

    .layout { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
    .main-col { display: flex; flex-direction: column; gap: 0; }
    .side-col { display: flex; flex-direction: column; gap: 14px; }

    .section {
      padding: 18px 20px; background: var(--surface-card);
      border: 1px solid var(--border-subtle); border-bottom: none;
    }
    .section:first-child { border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
    .section:last-child { border-bottom: 1px solid var(--border-subtle); border-radius: 0 0 var(--radius-lg) var(--radius-lg); }
    .section-title { margin: 0 0 14px; font-size: 12px; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .i-item { display: flex; flex-direction: column; gap: 2px; }
    .i-label { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
    .i-val { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .i-val.strong { font-weight: 800; }

    .party-row {
      display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
      padding: 10px 14px; background: var(--surface-bg); border-radius: var(--radius-sm);
    }
    .party-dot {
      width: 32px; height: 32px; border-radius: 8px; background: var(--ch-navy);
      color: var(--ch-teal-light); font-size: 12px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .party-info { flex: 1; }
    .party-name { font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; }
    .party-role { font-size: 11px; color: var(--ch-teal); font-weight: 600; }
    .party-contact { font-size: 11px; color: var(--text-tertiary); display: flex; flex-direction: column; text-align: right; }

    .doc-row {
      display: flex; align-items: center; gap: 12px; margin-bottom: 6px;
      padding: 10px 14px; background: var(--surface-bg); border-radius: var(--radius-sm);
    }
    .doc-thumb {
      width: 34px; height: 34px; border-radius: 8px; background: var(--ch-teal-subtle);
      display: flex; align-items: center; justify-content: center;
    }
    .doc-thumb mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--ch-teal); }
    .doc-info { flex: 1; }
    .doc-name { font-size: 13px; font-weight: 600; color: var(--text-primary); display: block; }
    .doc-size { font-size: 11px; color: var(--text-tertiary); }
    .doc-row button { color: var(--text-tertiary); }

    .side-panel {
      padding: 18px; background: var(--surface-card);
      border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
    }
    .side-title { margin: 0 0 14px; font-size: 12px; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; }

    .full-w { width: 100%; }
    .action-btns { display: flex; gap: 8px; }
    .approve-btn { flex: 1; }
    .reject-btn {
      flex: 1;
      border-color: rgba(232,93,74,0.2) !important;
      color: var(--ch-coral) !important;
    }
    .reject-btn:hover { background: rgba(232,93,74,0.04) !important; }

    .not-found { text-align: center; padding: 80px 24px; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--border-light); }
    .not-found h2 { color: var(--text-secondary); font-weight: 500; }
  `]
})
export class ManagerContractDetailComponent {
  comment = '';
  contract;
  workflow;
  private contractId: string;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private workflowService: WorkflowService,
    private snackBar: MatSnackBar
  ) {
    this.contractId = this.route.snapshot.paramMap.get('id') ?? '';
    this.contract = this.contractService.getContractById(this.contractId);
    this.workflow = this.workflowService.getWorkflow(this.contractId);
    if (this.contractService.allContracts().length === 0) {
      this.contractService.loadAll();
    }
  }

  canApprove = computed(() => {
    const c = this.contract();
    return c?.status === ContractStatus.PENDING_APPROVAL || c?.status === ContractStatus.IN_REVIEW;
  });

  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }

  approve() {
    this.contractService.approveContract(this.contractId, this.comment);
    this.snackBar.open('Contrato aprovado', 'OK', { duration: 3000 });
  }

  reject() {
    this.contractService.rejectContract(this.contractId, this.comment || 'Rejeitado');
    this.snackBar.open('Contrato rejeitado', 'OK', { duration: 3000 });
  }
}
