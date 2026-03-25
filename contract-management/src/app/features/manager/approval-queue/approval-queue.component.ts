import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContractService } from '../../../core/services/contract.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-approval-queue',
  imports: [RouterLink, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSnackBarModule, StatusBadgeComponent, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="queue">
      <div class="header">
        <h2>Fila de Aprovação</h2>
        <span class="count">{{ pendingContracts().length }} pendentes</span>
      </div>

      @for (contract of pendingContracts(); track contract.id) {
        <mat-card class="approval-card" [class.urgent]="getUrgency(contract.createdAt) === 'urgent'">
          <div class="card-top">
            <mat-checkbox />
            <span class="urgency-badge" [class]="getUrgency(contract.createdAt)">
              {{ getUrgencyLabel(contract.createdAt) }}
            </span>
            <span class="time">{{ contract.createdAt | relativeDate }}</span>
          </div>

          <div class="card-body" [routerLink]="'/manager/contracts/' + contract.id" style="cursor:pointer">
            <h3>{{ contract.title }}</h3>
            <div class="meta">
              <span>Tipo: {{ getTypeLabel(contract.type) }}</span>
              <span>Criador: {{ contract.createdBy.name }}</span>
              <span>Valor: {{ contract.value | currencyPt }}</span>
            </div>
          </div>

          <div class="card-actions">
            <mat-form-field appearance="outline" class="comment-field">
              <mat-label>Comentário</mat-label>
              <input matInput placeholder="Opcional...">
            </mat-form-field>
            <div class="action-buttons">
              <button mat-raised-button color="primary" (click)="approve(contract.id)">
                <mat-icon>check</mat-icon> Aprovar
              </button>
              <button mat-stroked-button color="warn" (click)="reject(contract.id)">
                <mat-icon>close</mat-icon> Rejeitar
              </button>
            </div>
          </div>
        </mat-card>
      }

      @if (pendingContracts().length === 0) {
        <mat-card class="empty-card">
          <mat-icon>check_circle</mat-icon>
          <h3>Tudo em dia!</h3>
          <p>Não há contratos pendentes de aprovação.</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .queue { max-width: 900px; }
    .header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
    h2 { margin: 0; font-weight: 400; }
    .count { color: #888; font-size: 14px; }

    .approval-card { margin-bottom: 16px; padding: 20px; }
    .approval-card.urgent { border-left: 4px solid #F44336; }

    .card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .urgency-badge {
      padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;
    }
    .urgency-badge.urgent { background: #FFEBEE; color: #C62828; }
    .urgency-badge.normal { background: #FFF3E0; color: #E65100; }
    .urgency-badge.recent { background: #E8F5E9; color: #2E7D32; }
    .time { margin-left: auto; color: #999; font-size: 13px; }

    .card-body h3 { margin: 0 0 8px; font-weight: 500; }
    .card-body:hover h3 { color: #1a237e; }
    .meta { display: flex; gap: 24px; font-size: 13px; color: #666; flex-wrap: wrap; }

    .card-actions { display: flex; align-items: center; gap: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
    .comment-field { flex: 1; margin: 0; }
    ::ng-deep .comment-field .mat-mdc-form-field-infix { padding-top: 8px !important; padding-bottom: 8px !important; }
    .action-buttons { display: flex; gap: 8px; }

    .empty-card { text-align: center; padding: 48px; color: #999; }
    .empty-card mat-icon { font-size: 64px; width: 64px; height: 64px; color: #4CAF50; }
    .empty-card h3 { color: #4CAF50; }
  `]
})
export class ApprovalQueueComponent {
  pendingContracts;

  constructor(private contractService: ContractService, private snackBar: MatSnackBar) {
    this.pendingContracts = contractService.getPendingApproval();
  }

  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }

  getUrgency(date: Date): string {
    const days = Math.round((Date.now() - new Date(date).getTime()) / 86400000);
    if (days >= 5) return 'urgent';
    if (days >= 2) return 'normal';
    return 'recent';
  }

  getUrgencyLabel(date: Date): string {
    const u = this.getUrgency(date);
    return u === 'urgent' ? 'Urgente' : u === 'normal' ? 'Normal' : 'Recente';
  }

  approve(id: string) {
    this.contractService.approveContract(id);
    this.snackBar.open('Contrato aprovado com sucesso', 'OK', { duration: 3000 });
  }

  reject(id: string) {
    this.contractService.rejectContract(id, 'Rejeitado pelo gestor');
    this.snackBar.open('Contrato rejeitado', 'OK', { duration: 3000 });
  }
}
