import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';
import { SignatureService } from '../../../core/services/signature.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-pending-signatures',
  imports: [RouterLink, MatIconModule, MatButtonModule, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="page">
      <div class="page-header animate-in">
        <div>
          <h1>Pending Signatures</h1>
          <p class="subtitle">Contracts waiting for your signature</p>
        </div>
        <span class="count-badge">{{ pendingSignatures().length }} pending</span>
      </div>

      <div class="list">
        @for (sig of pendingSignatures(); track sig.id; let i = $index) {
          <div class="sig-item animate-in" [style.animation-delay]="((i + 1) * 60) + 'ms'">
            <div class="sig-icon-wrap">
              <mat-icon>description</mat-icon>
            </div>
            <div class="sig-info">
              <h3>{{ sig.contractTitle }}</h3>
              <div class="sig-meta">
                <span class="meta-type">{{ sig.contractType }}</span>
                <span class="meta-sep">&middot;</span>
                <span>{{ sig.contractValue | currencyPt }}</span>
                <span class="meta-sep">&middot;</span>
                <span>{{ sig.requestedBy.name }}</span>
                <span class="meta-sep">&middot;</span>
                <span>{{ sig.requestedAt | relativeDate }}</span>
              </div>
            </div>
            <div class="sig-actions">
              <a mat-stroked-button [routerLink]="'/app/contracts/' + sig.contractId">
                <mat-icon>visibility</mat-icon> View
              </a>
              <a mat-raised-button color="primary" [routerLink]="'/app/sign/' + sig.id">
                <mat-icon>draw</mat-icon> Sign
              </a>
            </div>
          </div>
        }
      </div>

      @if (pendingSignatures().length === 0) {
        <div class="empty animate-in">
          <div class="empty-icon"><mat-icon>verified</mat-icon></div>
          <h2>All signed!</h2>
          <p>No contracts pending your signature.</p>
          <a mat-stroked-button routerLink="/app/dashboard">Back to Dashboard</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; }

    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }
    .count-badge {
      font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: var(--radius-full);
      background: var(--ch-amber-subtle); color: #a07c14;
    }

    .list { display: flex; flex-direction: column; gap: 10px; }

    .sig-item {
      display: flex; align-items: center; gap: 16px;
      padding: 18px 20px;
      background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
      transition: all var(--t-normal);
    }
    .sig-item:hover { box-shadow: var(--shadow-md); border-color: var(--ch-teal); }

    .sig-icon-wrap {
      width: 44px; height: 44px; border-radius: 11px;
      background: var(--ch-teal-subtle);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .sig-icon-wrap mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--ch-teal); }

    .sig-info { flex: 1; min-width: 0; }
    .sig-info h3 { margin: 0 0 4px; font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .sig-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-tertiary); flex-wrap: wrap; }
    .meta-type { font-weight: 700; color: var(--ch-teal); text-transform: uppercase; font-size: 10px; letter-spacing: 0.04em; }
    .meta-sep { color: var(--border-light); }

    .sig-actions { display: flex; gap: 8px; flex-shrink: 0; }

    .empty {
      text-align: center; padding: 80px 24px;
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
    }
    .empty-icon {
      width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 16px;
      background: rgba(5,150,105,0.08);
      display: flex; align-items: center; justify-content: center;
    }
    .empty-icon mat-icon { font-size: 24px; width: 24px; height: 24px; color: var(--ch-emerald); }
    .empty h2 { margin: 0 0 4px; font-size: 18px; font-weight: 700; color: var(--ch-emerald); }
    .empty p { color: var(--text-tertiary); font-size: 14px; margin: 0 0 20px; }
  `]
})
export class PendingSignaturesComponent {
  constructor(private authService: AuthService, private signatureService: SignatureService) {
    this.signatureService.loadForCurrentUser();
  }

  private userId = computed(() => this.authService.user()?.id ?? '');
  pendingSignatures = computed(() => this.signatureService.getPendingByUser(this.userId())());
}
