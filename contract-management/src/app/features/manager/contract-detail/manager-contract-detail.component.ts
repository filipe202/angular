import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContractService } from '../../../core/services/contract.service';
import { WorkflowService } from '../../../core/services/workflow.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { WorkflowTimelineComponent } from '../../../shared/components/workflow-timeline/workflow-timeline.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_TYPE_LABELS, ContractStatus } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manager-contract-detail',
  imports: [RouterLink, DatePipe, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatSnackBarModule, StatusBadgeComponent, WorkflowTimelineComponent, CurrencyPtPipe],
  template: `
    <div class="detail">
      <a routerLink="/manager/contracts" class="back-link">
        <mat-icon>arrow_back</mat-icon> Voltar
      </a>

      @if (contract(); as c) {
        <div class="detail-header">
          <h2>{{ c.title }}</h2>
          <app-status-badge [status]="c.status" />
        </div>

        <div class="detail-grid">
          <!-- Left: Details -->
          <mat-card>
            <mat-card-header><mat-card-title>Detalhes</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="info-grid">
                <div class="info-item"><span class="label">Tipo</span><span>{{ getTypeLabel(c.type) }}</span></div>
                <div class="info-item"><span class="label">Criador</span><span>{{ c.createdBy.name }}</span></div>
                <div class="info-item"><span class="label">Departamento</span><span>{{ c.department }}</span></div>
                <div class="info-item"><span class="label">Valor</span><span>{{ c.value | currencyPt }}</span></div>
                <div class="info-item"><span class="label">Início</span><span>{{ c.startDate | date:'dd/MM/yyyy' }}</span></div>
                <div class="info-item"><span class="label">Fim</span><span>{{ c.endDate | date:'dd/MM/yyyy' }}</span></div>
                <div class="info-item"><span class="label">Renovação</span><span>{{ c.autoRenew ? 'Automática' : 'Manual' }}</span></div>
                @if (c.paymentTerms) {
                  <div class="info-item"><span class="label">Pagamento</span><span>{{ c.paymentTerms }}</span></div>
                }
              </div>

              <mat-divider />

              <h4>Partes</h4>
              @for (party of c.parties; track party.id) {
                <div class="party">
                  <strong>{{ party.name }}</strong> ({{ party.role }})
                  <br><span class="party-detail">{{ party.email }} {{ party.taxId ? '- NIF ' + party.taxId : '' }}</span>
                </div>
              }

              <mat-divider />

              <h4>Documentos</h4>
              @for (doc of c.documents; track doc.id) {
                <div class="doc-item">
                  <mat-icon>description</mat-icon>
                  <span>{{ doc.name }}</span>
                  <span class="doc-size">{{ (doc.size / 1024 / 1024).toFixed(1) }} MB</span>
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Right: Workflow + Actions -->
          <div class="right-col">
            @if (workflow(); as wf) {
              <mat-card>
                <mat-card-header><mat-card-title>Workflow</mat-card-title></mat-card-header>
                <mat-card-content>
                  <app-workflow-timeline [steps]="wf.steps" />
                </mat-card-content>
              </mat-card>
            }

            @if (canApprove()) {
              <mat-card class="actions-card">
                <mat-card-header><mat-card-title>Ações</mat-card-title></mat-card-header>
                <mat-card-content>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Comentário</mat-label>
                    <textarea matInput [(ngModel)]="comment" rows="3"></textarea>
                  </mat-form-field>
                  <div class="action-buttons">
                    <button mat-raised-button color="primary" (click)="approve()">
                      <mat-icon>check</mat-icon> Aprovar
                    </button>
                    <button mat-stroked-button color="warn" (click)="reject()">
                      <mat-icon>close</mat-icon> Rejeitar
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
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
    .detail { max-width: 1100px; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; color: #666; text-decoration: none; margin-bottom: 16px; font-size: 14px; }
    .back-link:hover { color: #1a237e; }

    .detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .detail-header h2 { margin: 0; font-weight: 400; flex: 1; }

    .detail-grid { display: grid; grid-template-columns: 1fr 380px; gap: 16px; }
    .right-col { display: flex; flex-direction: column; gap: 16px; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .info-item { display: flex; flex-direction: column; }
    .info-item .label { font-size: 12px; color: #888; margin-bottom: 2px; }

    h4 { margin: 16px 0 8px; font-weight: 500; color: #555; }
    .party { margin-bottom: 8px; }
    .party-detail { font-size: 13px; color: #888; }

    .doc-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; font-size: 14px; }
    .doc-size { margin-left: auto; color: #999; font-size: 12px; }

    .full-width { width: 100%; }
    .action-buttons { display: flex; gap: 12px; }

    .not-found { text-align: center; padding: 48px; color: #999; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; }
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
