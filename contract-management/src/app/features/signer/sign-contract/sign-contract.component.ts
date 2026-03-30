import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SignatureService } from '../../../core/services/signature.service';
import { ContractService } from '../../../core/services/contract.service';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-sign-contract',
  imports: [RouterLink, FormsModule, DatePipe, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, CurrencyPtPipe],
  template: `
    <div class="sign">
      <a routerLink="/app/pending" class="back animate-in">
        <mat-icon>arrow_back</mat-icon> Back
      </a>

      @if (signature(); as sig) {
        <div class="sign-header animate-in animate-delay-1">
          <h1>{{ sig.contractTitle }}</h1>
          <span class="status-tag">Awaiting Signature</span>
        </div>

        <div class="sign-layout animate-in animate-delay-2">
          <!-- Document Preview -->
          <div class="preview-panel">
            <div class="preview-area">
              <div class="preview-icon">
                <mat-icon>picture_as_pdf</mat-icon>
              </div>
              <h3>Document Preview</h3>
              <p>The document will be shown here via edoclink integration.</p>
              @if (contract(); as c) {
                <div class="doc-list">
                  @for (doc of c.documents; track doc.id) {
                    <div class="doc-item">
                      <mat-icon>description</mat-icon>
                      <span>{{ doc.name }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Sidebar -->
          <div class="side">
            <!-- Details -->
            <div class="side-section">
              <h3 class="side-title">Details</h3>
              <div class="detail-row"><span class="d-label">Type</span><span class="d-val">{{ sig.contractType }}</span></div>
              <div class="detail-row"><span class="d-label">Value</span><span class="d-val">{{ sig.contractValue | currencyPt }}</span></div>
              @if (contract(); as c) {
                <div class="detail-row"><span class="d-label">Start</span><span class="d-val">{{ c.startDate | date:'dd/MM/yyyy' }}</span></div>
                <div class="detail-row"><span class="d-label">End</span><span class="d-val">{{ c.endDate | date:'dd/MM/yyyy' }}</span></div>
                <div class="detail-row"><span class="d-label">Department</span><span class="d-val">{{ c.department }}</span></div>
              }
            </div>

            @if (contract(); as c) {
              <!-- Parties -->
              <div class="side-section">
                <h3 class="side-title">Parties</h3>
                @for (party of c.parties; track party.id) {
                  <div class="party-mini">
                    <div class="party-dot">{{ party.name[0] }}</div>
                    <div><span class="party-name">{{ party.name }}</span><span class="party-role">{{ party.role }}</span></div>
                  </div>
                }
              </div>

              <!-- Documents -->
              <div class="side-section">
                <h3 class="side-title">Documents</h3>
                @for (doc of c.documents; track doc.id) {
                  <div class="doc-mini"><mat-icon>description</mat-icon> {{ doc.name }}</div>
                }
              </div>
            }

            <!-- Actions -->
            <div class="side-actions">
              @if (!showDeclineForm()) {
                <button mat-raised-button color="primary" class="sign-btn" (click)="onSign()">
                  <mat-icon>draw</mat-icon> Sign Contract
                </button>
                <button mat-stroked-button class="decline-btn" (click)="showDeclineForm.set(true)">
                  <mat-icon>close</mat-icon> Decline
                </button>
              } @else {
                <mat-form-field appearance="outline" class="reason-field">
                  <mat-label>Reason for declining</mat-label>
                  <textarea matInput [(ngModel)]="declineReason" rows="3" placeholder="Explain the reason..."></textarea>
                </mat-form-field>
                <div class="decline-btns">
                  <button mat-raised-button class="confirm-decline" [disabled]="!declineReason" (click)="onDecline()">
                    Confirm Decline
                  </button>
                  <button mat-stroked-button (click)="showDeclineForm.set(false)">Cancel</button>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="not-found animate-in">
          <mat-icon>search_off</mat-icon>
          <h2>Request not found</h2>
          <a mat-stroked-button routerLink="/app/pending">Back</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .sign { max-width: 1100px; margin: 0 auto; }
    .back {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--text-tertiary); text-decoration: none; font-size: 13px; font-weight: 500;
      margin-bottom: 18px; transition: color 200ms;
    }
    .back:hover { color: var(--ch-teal); }
    .back mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .sign-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
    .sign-header h1 { margin: 0; font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; flex: 1; }
    .status-tag {
      font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full);
      background: var(--ch-amber-subtle); color: #a07c14;
    }

    .sign-layout { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }

    .preview-panel {
      background: var(--surface-card); border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg); min-height: 500px;
    }
    .preview-area {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 48px; text-align: center; height: 100%;
    }
    .preview-icon {
      width: 64px; height: 64px; border-radius: 16px; margin-bottom: 16px;
      background: var(--ch-teal-subtle);
      display: flex; align-items: center; justify-content: center;
    }
    .preview-icon mat-icon { font-size: 28px; width: 28px; height: 28px; color: var(--ch-teal); }
    .preview-area h3 { margin: 0 0 4px; font-size: 16px; font-weight: 700; color: var(--text-primary); }
    .preview-area p { margin: 0; font-size: 13px; color: var(--text-tertiary); }
    .doc-list { margin-top: 20px; width: 100%; max-width: 280px; }
    .doc-item {
      display: flex; align-items: center; gap: 8px; padding: 10px 14px;
      background: var(--surface-bg); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);
      margin-bottom: 6px; font-size: 13px; color: var(--text-primary);
    }
    .doc-item mat-icon { color: var(--ch-teal); font-size: 18px; width: 18px; height: 18px; }

    .side { display: flex; flex-direction: column; gap: 0; }
    .side-section {
      padding: 16px 18px; background: var(--surface-card);
      border: 1px solid var(--border-subtle); border-bottom: none;
    }
    .side-section:first-child { border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
    .side-title { margin: 0 0 10px; font-size: 12px; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .d-label { font-size: 12px; color: var(--text-tertiary); }
    .d-val { font-size: 13px; font-weight: 600; color: var(--text-primary); }

    .party-mini { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .party-dot {
      width: 28px; height: 28px; border-radius: 7px; background: var(--ch-navy);
      color: var(--ch-teal-light); font-size: 11px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .party-name { font-size: 13px; font-weight: 600; color: var(--text-primary); display: block; }
    .party-role { font-size: 10px; color: var(--text-tertiary); }

    .doc-mini {
      display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary);
      margin-bottom: 6px;
    }
    .doc-mini mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--ch-teal); }

    .side-actions {
      padding: 18px; background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      display: flex; flex-direction: column; gap: 10px;
    }
    .sign-btn {
      width: 100%; height: 48px !important; font-size: 15px !important;
      border-radius: var(--radius-md) !important; font-weight: 700 !important;
    }
    .decline-btn {
      width: 100%;
      border-color: rgba(232,93,74,0.2) !important;
      color: var(--ch-coral) !important;
    }
    .decline-btn:hover { background: rgba(232,93,74,0.04) !important; }
    .reason-field { width: 100%; }
    .decline-btns { display: flex; gap: 8px; }
    .confirm-decline {
      background: var(--ch-coral) !important; color: white !important;
      border-radius: var(--radius-sm) !important;
    }

    .not-found { text-align: center; padding: 80px 24px; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--border-light); }
    .not-found h2 { color: var(--text-secondary); font-weight: 500; }
  `]
})
export class SignContractComponent {
  declineReason = '';
  showDeclineForm = signal(false);
  signature;
  contract;
  private signatureId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signatureService: SignatureService,
    private contractService: ContractService,
    private snackBar: MatSnackBar
  ) {
    this.signatureId = this.route.snapshot.paramMap.get('id') ?? '';
    this.signature = computed(() => this.signatureService.allSignatures().find(s => s.id === this.signatureId) ?? null);
    this.contract = computed(() => {
      const sig = this.signature();
      return sig ? this.contractService.getContractById(sig.contractId)() : null;
    });
    if (this.signatureService.allSignatures().length === 0) {
      this.signatureService.loadForCurrentUser();
    }
  }

  onSign() {
    this.signatureService.sign(this.signatureId);
    this.snackBar.open('Contrato assinado com sucesso!', 'OK', { duration: 3000 });
    this.router.navigate(['/app/pending']);
  }

  onDecline() {
    this.signatureService.decline(this.signatureId, this.declineReason);
    this.snackBar.open('Assinatura recusada', 'OK', { duration: 3000 });
    this.router.navigate(['/app/pending']);
  }
}
