import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContractService } from '../../../core/services/contract.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-approval-queue',
  imports: [RouterLink, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="queue">
      <div class="queue-header animate-in">
        <div>
          <h1>Fila de Aprovação</h1>
          <p class="subtitle">Contratos a aguardar a sua decisão</p>
        </div>
        <span class="count-badge">{{ pendingContracts().length }} pendentes</span>
      </div>

      <div class="queue-list">
        @for (contract of pendingContracts(); track contract.id; let i = $index) {
          <div class="approval-item animate-in" [style.animation-delay]="(i * 60) + 'ms'"
               [class.urgency-high]="getUrgency(contract.createdAt) === 'urgent'">

            <div class="item-urgency">
              <div class="urgency-indicator" [class]="getUrgency(contract.createdAt)">
                {{ getUrgencyLabel(contract.createdAt) }}
              </div>
              <span class="item-time">{{ contract.createdAt | relativeDate }}</span>
            </div>

            <div class="item-main" [routerLink]="'/manager/contracts/' + contract.id">
              <h3>{{ contract.title }}</h3>
              <div class="item-meta">
                <span class="meta-chip">{{ getTypeLabel(contract.type) }}</span>
                <span class="meta-sep">&middot;</span>
                <span>{{ contract.createdBy.name }}</span>
                <span class="meta-sep">&middot;</span>
                <span class="meta-value">{{ contract.value | currencyPt }}</span>
              </div>
            </div>

            <div class="item-actions">
              <mat-form-field appearance="outline" class="comment-field">
                <mat-label>Nota (opcional)</mat-label>
                <input matInput [(ngModel)]="comments[contract.id]">
              </mat-form-field>
              <div class="action-btns">
                <button mat-raised-button color="primary" class="approve-btn" (click)="approve(contract.id)">
                  <mat-icon>check</mat-icon> Aprovar
                </button>
                <button mat-stroked-button class="reject-btn" (click)="reject(contract.id)">
                  <mat-icon>close</mat-icon> Rejeitar
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      @if (pendingContracts().length === 0) {
        <div class="empty-state animate-in">
          <div class="empty-icon">
            <mat-icon>task_alt</mat-icon>
          </div>
          <h2>Tudo em dia!</h2>
          <p>Não há contratos pendentes de aprovação.</p>
          <a mat-stroked-button routerLink="/manager/dashboard">Voltar ao Painel</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .queue { max-width: 900px; margin: 0 auto; }

    .queue-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }
    .count-badge {
      font-size: 12px; font-weight: 700; padding: 5px 14px;
      border-radius: var(--radius-full);
      background: var(--ch-amber-subtle); color: #a07c14;
    }

    .queue-list { display: flex; flex-direction: column; gap: 12px; }

    .approval-item {
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle); overflow: hidden;
      transition: all var(--t-normal);
    }
    .approval-item:hover { box-shadow: var(--shadow-md); }
    .approval-item.urgency-high { border-left: 3px solid var(--ch-coral); }

    .item-urgency {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 20px 0;
    }
    .urgency-indicator {
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
      padding: 3px 10px; border-radius: var(--radius-full);
    }
    .urgency-indicator.urgent { background: rgba(232,93,74,0.08); color: var(--ch-coral); }
    .urgency-indicator.normal { background: var(--ch-amber-subtle); color: #a07c14; }
    .urgency-indicator.recent { background: rgba(5,150,105,0.08); color: var(--ch-emerald); }
    .item-time { font-size: 12px; color: var(--text-tertiary); }

    .item-main {
      padding: 10px 20px 12px; cursor: pointer;
      transition: background var(--t-fast);
    }
    .item-main:hover { background: var(--surface-hover); }
    .item-main h3 { margin: 0 0 6px; font-size: 16px; font-weight: 700; color: var(--text-primary); }
    .item-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-tertiary); flex-wrap: wrap; }
    .meta-chip {
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
      padding: 2px 8px; border-radius: var(--radius-full);
      background: var(--ch-teal-subtle); color: var(--ch-teal);
    }
    .meta-sep { color: var(--border-light); }
    .meta-value { font-weight: 700; color: var(--text-primary); }

    .item-actions {
      display: flex; align-items: center; gap: 12px;
      padding: 0 20px 14px; margin-top: 4px;
    }
    .comment-field { flex: 1; margin: 0; }
    ::ng-deep .comment-field .mat-mdc-form-field-infix { padding-top: 8px !important; padding-bottom: 8px !important; }
    ::ng-deep .comment-field .mdc-text-field { height: 40px; }
    .action-btns { display: flex; gap: 8px; flex-shrink: 0; }
    .approve-btn { border-radius: var(--radius-sm) !important; }
    .reject-btn {
      border-color: rgba(232,93,74,0.3) !important;
      color: var(--ch-coral) !important;
    }
    .reject-btn:hover { background: rgba(232,93,74,0.04) !important; }

    .empty-state {
      text-align: center; padding: 80px 24px;
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
    }
    .empty-icon {
      width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 16px;
      background: rgba(5,150,105,0.08);
      display: flex; align-items: center; justify-content: center;
    }
    .empty-icon mat-icon { font-size: 28px; width: 28px; height: 28px; color: var(--ch-emerald); }
    .empty-state h2 { margin: 0 0 4px; font-size: 18px; font-weight: 700; color: var(--ch-emerald); }
    .empty-state p { color: var(--text-tertiary); font-size: 14px; margin: 0 0 20px; }
  `]
})
export class ApprovalQueueComponent {
  pendingContracts;
  comments: Record<string, string> = {};

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
    this.contractService.rejectContract(id, this.comments[id] || 'Rejeitado pelo gestor');
    this.snackBar.open('Contrato rejeitado', 'OK', { duration: 3000 });
  }
}
