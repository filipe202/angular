import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ContractService } from '../../../core/services/contract.service';
import { WorkflowService } from '../../../core/services/workflow.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { WorkflowTimelineComponent } from '../../../shared/components/workflow-timeline/workflow-timeline.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-creator-contract-detail',
  imports: [RouterLink, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, StatusBadgeComponent, WorkflowTimelineComponent, CurrencyPtPipe],
  template: `
    <div class="detail">
      <a routerLink="/creator/contracts" class="back-link">
        <mat-icon>arrow_back</mat-icon> Voltar
      </a>

      @if (contract(); as c) {
        <div class="detail-header">
          <h2>{{ c.title }}</h2>
          <app-status-badge [status]="c.status" />
        </div>

        @if (c.rejectionReason) {
          <mat-card class="rejection-card">
            <mat-icon>warning</mat-icon>
            <div>
              <strong>Contrato rejeitado</strong>
              <p>{{ c.rejectionReason }}</p>
              <a mat-stroked-button routerLink="/creator/contracts/new">Editar e Resubmeter</a>
            </div>
          </mat-card>
        }

        <div class="detail-grid">
          <mat-card>
            <mat-card-header><mat-card-title>Detalhes</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="info-grid">
                <div class="info-item"><span class="label">Tipo</span><span>{{ getTypeLabel(c.type) }}</span></div>
                <div class="info-item"><span class="label">Departamento</span><span>{{ c.department }}</span></div>
                <div class="info-item"><span class="label">Valor</span><span>{{ c.value | currencyPt }}</span></div>
                <div class="info-item"><span class="label">Período</span><span>{{ c.startDate | date:'dd/MM/yyyy' }} - {{ c.endDate | date:'dd/MM/yyyy' }}</span></div>
                <div class="info-item"><span class="label">Renovação</span><span>{{ c.autoRenew ? 'Automática' : 'Manual' }}</span></div>
                @if (c.paymentTerms) {
                  <div class="info-item"><span class="label">Pagamento</span><span>{{ c.paymentTerms }}</span></div>
                }
              </div>

              <mat-divider />
              <h4>Partes</h4>
              @for (party of c.parties; track party.id) {
                <div class="party"><strong>{{ party.name }}</strong> ({{ party.role }}) — {{ party.email }}</div>
              }

              <mat-divider />
              <h4>Documentos</h4>
              @for (doc of c.documents; track doc.id) {
                <div class="doc"><mat-icon>description</mat-icon> {{ doc.name }} <span class="size">{{ (doc.size / 1024 / 1024).toFixed(1) }} MB</span></div>
              }
              @if (c.documents.length === 0) {
                <p class="no-docs">Sem documentos anexados.</p>
              }
            </mat-card-content>
          </mat-card>

          @if (workflow(); as wf) {
            <mat-card>
              <mat-card-header><mat-card-title>Progresso</mat-card-title></mat-card-header>
              <mat-card-content>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="progress()"></div>
                </div>
                <span class="progress-text">{{ progress() }}% concluído</span>
                <app-workflow-timeline [steps]="wf.steps" />
              </mat-card-content>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card class="not-found">
          <mat-icon>search_off</mat-icon>
          <h3>Contrato não encontrado</h3>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .detail { max-width: 1000px; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; color: #666; text-decoration: none; margin-bottom: 16px; font-size: 14px; }
    .back-link:hover { color: #1a237e; }
    .detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .detail-header h2 { margin: 0; font-weight: 400; flex: 1; }

    .rejection-card {
      display: flex; gap: 16px; padding: 20px; margin-bottom: 16px;
      background: #FFF3E0; align-items: flex-start;
    }
    .rejection-card mat-icon { color: #E65100; font-size: 28px; width: 28px; height: 28px; }
    .rejection-card p { margin: 4px 0 12px; color: #555; }

    .detail-grid { display: grid; grid-template-columns: 1fr 350px; gap: 16px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .info-item { display: flex; flex-direction: column; }
    .label { font-size: 12px; color: #888; margin-bottom: 2px; }
    h4 { margin: 16px 0 8px; font-weight: 500; color: #555; }
    .party { margin-bottom: 6px; font-size: 14px; }
    .doc { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 14px; }
    .size { margin-left: auto; color: #999; font-size: 12px; }
    .no-docs { color: #999; font-size: 14px; }
    .progress-bar { height: 8px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px; overflow: hidden; }
    .progress-fill { height: 100%; background: #1a237e; border-radius: 4px; }
    .progress-text { font-size: 12px; color: #888; display: block; margin-bottom: 20px; }
    .not-found { text-align: center; padding: 48px; color: #999; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; }
  `]
})
export class CreatorContractDetailComponent {
  contract;
  workflow;
  progress;
  private contractId: string;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private workflowService: WorkflowService
  ) {
    this.contractId = this.route.snapshot.paramMap.get('id') ?? '';
    this.contract = this.contractService.getContractById(this.contractId);
    this.workflow = this.workflowService.getWorkflow(this.contractId);
    this.progress = this.workflowService.getWorkflowProgress(this.contractId);
    // Ensure data is loaded (handles direct navigation / page refresh)
    if (this.contractService.allContracts().length === 0) {
      this.contractService.loadAll();
    }
  }

  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }
}
