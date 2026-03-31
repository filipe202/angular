import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractService } from '../../../core/services/contract.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { Contract } from '../../../core/models/contract.model';

@Component({
  selector: 'app-approval-queue',
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatProgressSpinnerModule, StatusBadgeComponent, CurrencyPtPipe],
  template: `
    <div class="queue">
      <div class="queue-header animate-in">
        <div>
          <h1>Approval Queue</h1>
          <p class="subtitle">Contracts waiting for your decision</p>
        </div>
        @if (pendingContracts().length) {
          <span class="count-badge">{{ pendingContracts().length }} pending</span>
        }
      </div>

      @if (pendingContracts().length === 0) {
        <div class="empty-state animate-in">
          <div class="empty-icon"><mat-icon>task_alt</mat-icon></div>
          <h2>All caught up!</h2>
          <p>No contracts pending approval.</p>
          <a mat-stroked-button routerLink="/app/contracts">View all contracts</a>
        </div>
      } @else {

        <div class="card-list animate-in animate-delay-1">
          @for (c of pendingContracts(); track c.id; let i = $index) {
            <div class="approval-card" [class.urgent]="isUrgent(c.createdAt)">

              <!-- Card header row -->
              <div class="card-top">
                <div class="card-title-block">
                  @if (c.edoclinkCode) {
                    <span class="code-badge">{{ c.edoclinkCode }}</span>
                  }
                  <a [routerLink]="'/app/contracts/' + c.id" class="card-title">{{ c.title }}</a>
                </div>
                <div class="card-badges">
                  <app-status-badge [status]="c.status" />
                  @if (isUrgent(c.createdAt)) {
                    <span class="urgent-badge">Overdue</span>
                  }
                </div>
              </div>

              <!-- Info grid -->
              <div class="card-info">
                @if (c.flowTypeName || c.type) {
                  <div class="info-item">
                    <span class="info-label">Type</span>
                    <span class="info-val type-chip">{{ c.flowTypeName || c.type }}</span>
                  </div>
                }
                @if (c.currentStageName) {
                  <div class="info-item">
                    <span class="info-label">Current stage</span>
                    <span class="info-val stage-chip">{{ c.currentStageName }}</span>
                  </div>
                }
                <div class="info-item">
                  <span class="info-label">Created by</span>
                  <span class="info-val">{{ c.createdBy.name }}</span>
                </div>
                @if (c.department) {
                  <div class="info-item">
                    <span class="info-label">Department</span>
                    <span class="info-val">{{ c.department }}</span>
                  </div>
                }
                @if (c.value) {
                  <div class="info-item">
                    <span class="info-label">Value</span>
                    <span class="info-val value-strong">{{ c.value | currencyPt }}</span>
                  </div>
                }
                <div class="info-item">
                  <span class="info-label">Submitted</span>
                  <span class="info-val">{{ c.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                @if (c.description) {
                  <div class="info-item info-full">
                    <span class="info-label">Description</span>
                    <span class="info-val">{{ c.description }}</span>
                  </div>
                }
              </div>

              <!-- Actions row -->
              <div class="card-actions">
                <mat-form-field appearance="outline" class="comment-field">
                  <mat-label>Comment (optional)</mat-label>
                  <input matInput [(ngModel)]="comments[c.id]" placeholder="Add a note...">
                </mat-form-field>
                <div class="action-btns">
                  <a mat-stroked-button [routerLink]="'/app/contracts/' + c.id" class="view-btn">
                    <mat-icon>open_in_new</mat-icon> View
                  </a>
                  <button mat-raised-button color="primary" class="approve-btn"
                          (click)="approve(c)" [disabled]="loading[c.id]">
                    @if (loading[c.id] === 'approve') {
                      <mat-spinner diameter="16" style="display:inline-block;margin-right:4px"></mat-spinner>
                    } @else { <mat-icon>check</mat-icon> }
                    Approve
                  </button>
                  <button mat-stroked-button class="reject-btn"
                          (click)="reject(c)" [disabled]="loading[c.id]">
                    <mat-icon>close</mat-icon> Reject
                  </button>
                </div>
              </div>

            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .queue { max-width: 960px; margin: 0 auto; }

    .queue-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }
    .count-badge {
      font-size: 12px; font-weight: 700; padding: 5px 14px;
      border-radius: var(--radius-full);
      background: rgba(245,158,11,0.08); color: #a07c14;
    }

    /* ── CARDS ── */
    .card-list { display: flex; flex-direction: column; gap: 12px; }

    .approval-card {
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      padding: 18px 20px; transition: box-shadow 200ms;
    }
    .approval-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .approval-card.urgent { border-left: 3px solid var(--ch-coral); }

    /* Top row */
    .card-top {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px; margin-bottom: 14px;
    }
    .card-title-block { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; }
    .code-badge {
      font-size: 11px; font-weight: 700; font-family: monospace;
      color: var(--text-secondary); background: var(--surface-muted);
      border: 1px solid var(--border-subtle); padding: 2px 8px;
      border-radius: var(--radius-full); flex-shrink: 0;
    }
    .card-title {
      font-size: 15px; font-weight: 700; color: var(--text-primary);
      text-decoration: none; line-height: 1.3;
    }
    .card-title:hover { color: var(--ch-teal); }
    .card-badges { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .urgent-badge {
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-coral); background: rgba(232,93,74,0.07);
      padding: 3px 8px; border-radius: 99px;
    }

    /* Info grid */
    .card-info {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 10px 20px; margin-bottom: 16px;
    }
    .info-item { display: flex; flex-direction: column; gap: 2px; }
    .info-full { grid-column: 1 / -1; }
    .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); }
    .info-val { font-size: 13px; color: var(--text-primary); font-weight: 500; }
    .value-strong { font-weight: 800; }
    .type-chip {
      font-size: 10px !important; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.04em; color: var(--ch-teal); background: var(--ch-teal-subtle);
      padding: 2px 8px; border-radius: var(--radius-full); display: inline-block; width: fit-content;
    }
    .stage-chip {
      font-size: 11px !important; font-weight: 600; color: var(--ch-amber);
      background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.15);
      padding: 2px 8px; border-radius: var(--radius-full); display: inline-block; width: fit-content;
    }

    /* Actions */
    .card-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .comment-field { flex: 1; min-width: 180px; margin: 0; }
    ::ng-deep .comment-field .mat-mdc-form-field-infix { padding-top: 8px !important; padding-bottom: 8px !important; }
    .action-btns { display: flex; gap: 8px; flex-shrink: 0; }
    .view-btn { color: var(--text-secondary) !important; }
    .reject-btn { border-color: rgba(232,93,74,0.25) !important; color: var(--ch-coral) !important; }
    .reject-btn:hover { background: rgba(232,93,74,0.04) !important; }

    /* Empty */
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
  loading: Record<string, 'approve' | 'reject' | null> = {};

  constructor(private contractService: ContractService, private snackBar: MatSnackBar) {
    this.pendingContracts = contractService.getPendingApproval();
    this.contractService.loadAll();
  }

  isUrgent(date: Date): boolean {
    return Math.round((Date.now() - new Date(date).getTime()) / 86400000) >= 5;
  }

  async approve(c: Contract) {
    this.loading[c.id] = 'approve';
    try {
      await this.contractService.approveContract(c.id, this.comments[c.id]);
      this.snackBar.open('Contract approved', 'OK', { duration: 3000 });
    } catch {
      this.snackBar.open('Failed to approve', 'OK', { duration: 3000 });
    } finally {
      this.loading[c.id] = null;
    }
  }

  async reject(c: Contract) {
    this.loading[c.id] = 'reject';
    try {
      await this.contractService.rejectContract(c.id, this.comments[c.id] || 'Rejected');
      this.snackBar.open('Contract rejected', 'OK', { duration: 3000 });
    } finally {
      this.loading[c.id] = null;
    }
  }
}
