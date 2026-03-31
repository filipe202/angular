import { Component, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../core/auth/auth.service';
import { SignatureService } from '../../../core/services/signature.service';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-signature-history',
  imports: [DatePipe, RouterLink, MatIconModule, MatTableModule, CurrencyPtPipe],
  template: `
    <div class="page">
      <div class="page-header animate-in">
        <div>
          <h1>Signature History</h1>
          <p class="subtitle">Record of all your signature actions</p>
        </div>
      </div>

      @if (history().length > 0) {
        <div class="table-wrap animate-in animate-delay-1">
          <table mat-table [dataSource]="history()">
            <ng-container matColumnDef="contract">
              <th mat-header-cell *matHeaderCellDef>Contract</th>
              <td mat-cell *matCellDef="let s">
                <a [routerLink]="'/app/contracts/' + s.contractId" class="title-link">{{ s.contractTitle }}</a>
              </td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let s">
                <span class="type-tag">{{ s.contractType }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="value">
              <th mat-header-cell *matHeaderCellDef>Value</th>
              <td mat-cell *matCellDef="let s">{{ s.contractValue | currencyPt }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let s">
                <span class="status-chip" [class]="s.status">
                  <mat-icon>{{ s.status === 'signed' ? 'verified' : 'cancel' }}</mat-icon>
                  {{ s.status === 'signed' ? 'Signed' : 'Declined' }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let s">{{ (s.signedAt || s.declinedAt) | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
        </div>
      } @else {
        <div class="empty animate-in">
          <div class="empty-icon"><mat-icon>history</mat-icon></div>
          <h2>No history yet</h2>
          <p>You haven't signed any contracts yet.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 960px; margin: 0 auto; }

    .page-header { margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }

    .table-wrap {
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle); overflow: hidden;
    }
    table { width: 100%; }

    .title-link { color: var(--ch-teal); text-decoration: none; font-weight: 600; font-size: 13px; }
    .title-link:hover { text-decoration: underline; }

    .type-tag {
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
      color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 2px 8px; border-radius: var(--radius-full);
    }

    .status-chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 700;
    }
    .status-chip mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .status-chip.signed { color: var(--ch-emerald); }
    .status-chip.declined { color: var(--ch-coral); }

    .empty {
      text-align: center; padding: 80px 24px;
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
    }
    .empty-icon {
      width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 16px;
      background: rgba(122,139,165,0.1);
      display: flex; align-items: center; justify-content: center;
    }
    .empty-icon mat-icon { font-size: 24px; width: 24px; height: 24px; color: var(--text-tertiary); }
    .empty h2 { margin: 0 0 4px; font-size: 17px; font-weight: 700; color: var(--text-secondary); }
    .empty p { color: var(--text-tertiary); font-size: 14px; margin: 0; }
  `]
})
export class SignatureHistoryComponent {
  constructor(private authService: AuthService, private signatureService: SignatureService) {
    if (this.signatureService.allSignatures().length === 0) {
      this.signatureService.loadForCurrentUser();
    }
  }

  columns = ['contract', 'type', 'value', 'status', 'date'];
  private userId = computed(() => this.authService.user()?.id ?? '');
  history = computed(() => this.signatureService.getHistoryByUser(this.userId())());
}
