import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
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
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, StatusBadgeComponent, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>Os Meus Contratos</h2>
        <a mat-raised-button color="primary" routerLink="/creator/contracts/new">
          <mat-icon>add</mat-icon> Novo Contrato
        </a>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <mat-card class="kpi-card" routerLink="/creator/contracts" [queryParams]="{status: 'draft'}">
          <span class="kpi-value">{{ drafts().length }}</span>
          <span class="kpi-label">Rascunhos</span>
          <span class="kpi-action">Retomar &rarr;</span>
        </mat-card>
        <mat-card class="kpi-card">
          <span class="kpi-value">{{ inApproval().length }}</span>
          <span class="kpi-label">Em Aprovação</span>
        </mat-card>
        <mat-card class="kpi-card" routerLink="/creator/contracts" [queryParams]="{status: 'rejected'}">
          <span class="kpi-value">{{ rejected().length }}</span>
          <span class="kpi-label">Rejeitados</span>
          <span class="kpi-action">Corrigir &rarr;</span>
        </mat-card>
        <mat-card class="kpi-card">
          <span class="kpi-value">{{ completed().length }}</span>
          <span class="kpi-label">Concluídos</span>
        </mat-card>
      </div>

      <!-- Recent Contracts -->
      <h3>Contratos Recentes</h3>
      @for (contract of myContracts().slice(0, 5); track contract.id) {
        <mat-card class="contract-card" [routerLink]="'/creator/contracts/' + contract.id">
          <div class="contract-top">
            <h4>{{ contract.title }}</h4>
            <app-status-badge [status]="contract.status" />
          </div>
          <div class="contract-meta">
            <span>{{ getTypeLabel(contract.type) }}</span>
            <span>{{ contract.value | currencyPt }}</span>
            <span>Criado {{ contract.createdAt | relativeDate }}</span>
          </div>

          @if (contract.status === 'pending_approval' || contract.status === 'in_review') {
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="getProgress(contract.id)"></div>
            </div>
            <span class="progress-text">{{ getProgress(contract.id) }}% concluído</span>
          }

          @if (contract.status === 'rejected' && contract.rejectionReason) {
            <div class="rejection">
              <mat-icon>info</mat-icon>
              <span>{{ contract.rejectionReason }}</span>
            </div>
          }

          @if (contract.status === 'draft') {
            <div class="draft-action">
              <span class="draft-link">Continuar &rarr;</span>
            </div>
          }
        </mat-card>
      }

      @if (myContracts().length === 0) {
        <mat-card class="empty">
          <mat-icon>folder_open</mat-icon>
          <h4>Ainda não tem contratos</h4>
          <p>Comece por criar o seu primeiro contrato.</p>
          <a mat-raised-button color="primary" routerLink="/creator/contracts/new">
            <mat-icon>add</mat-icon> Criar Contrato
          </a>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .dashboard { max-width: 900px; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .dashboard-header h2 { margin: 0; font-weight: 400; }

    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .kpi-card {
      padding: 20px; text-align: center; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .kpi-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .kpi-value { font-size: 32px; font-weight: 600; color: #1a237e; }
    .kpi-label { font-size: 13px; color: #888; }
    .kpi-action { font-size: 12px; color: #1a237e; margin-top: 4px; }

    h3 { font-weight: 400; color: #555; margin-bottom: 16px; }

    .contract-card { padding: 20px; margin-bottom: 12px; cursor: pointer; }
    .contract-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

    .contract-top { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .contract-top h4 { margin: 0; flex: 1; font-weight: 500; }

    .contract-meta { display: flex; gap: 16px; font-size: 13px; color: #888; }

    .progress-bar { height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 12px; overflow: hidden; }
    .progress-fill { height: 100%; background: #1a237e; border-radius: 3px; transition: width 0.3s; }
    .progress-text { font-size: 11px; color: #888; margin-top: 4px; display: block; }

    .rejection {
      display: flex; align-items: flex-start; gap: 8px; margin-top: 12px;
      padding: 10px; background: #FFF3E0; border-radius: 8px; font-size: 13px; color: #E65100;
    }
    .rejection mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }

    .draft-action { margin-top: 12px; }
    .draft-link { color: #1a237e; font-size: 13px; font-weight: 500; }

    .empty { text-align: center; padding: 48px; color: #999; }
    .empty mat-icon { font-size: 64px; width: 64px; height: 64px; color: #e0e0e0; }
    .empty h4 { color: #666; }
  `]
})
export class CreatorDashboardComponent {
  constructor(
    private authService: AuthService,
    private contractService: ContractService,
    private workflowService: WorkflowService
  ) {}

  private userId = computed(() => this.authService.user()?.id ?? '');
  myContracts = computed(() => this.contractService.getContractsByCreator(this.userId())());
  drafts = computed(() => this.myContracts().filter(c => c.status === ContractStatus.DRAFT));
  inApproval = computed(() => this.myContracts().filter(c => c.status === ContractStatus.PENDING_APPROVAL || c.status === ContractStatus.IN_REVIEW));
  rejected = computed(() => this.myContracts().filter(c => c.status === ContractStatus.REJECTED));
  completed = computed(() => this.myContracts().filter(c => [ContractStatus.SIGNED, ContractStatus.ACTIVE, ContractStatus.APPROVED].includes(c.status)));

  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }
  getProgress(contractId: string) { return this.workflowService.getWorkflowProgress(contractId)(); }
}
