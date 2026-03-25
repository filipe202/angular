import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SignatureService } from '../../../core/services/signature.service';
import { ContractService } from '../../../core/services/contract.service';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-sign-contract',
  imports: [RouterLink, FormsModule, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatDialogModule, MatSnackBarModule, CurrencyPtPipe],
  template: `
    <div class="sign">
      <a routerLink="/signer/pending" class="back-link">
        <mat-icon>arrow_back</mat-icon> Voltar
      </a>

      @if (signature(); as sig) {
        <div class="sign-header">
          <h2>{{ sig.contractTitle }}</h2>
          <span class="badge pending">Aguarda Assinatura</span>
        </div>

        <div class="sign-grid">
          <!-- Document Preview -->
          <mat-card class="preview-card">
            <div class="preview-placeholder">
              <mat-icon>picture_as_pdf</mat-icon>
              <h3>Pré-visualização do Documento</h3>
              <p>O documento será apresentado aqui via edoclink.</p>
              <div class="mock-viewer">
                @if (contract(); as c) {
                  @for (doc of c.documents; track doc.id) {
                    <div class="mock-page">
                      <mat-icon>description</mat-icon>
                      <span>{{ doc.name }}</span>
                    </div>
                  }
                }
              </div>
            </div>
          </mat-card>

          <!-- Details + Actions -->
          <div class="side-panel">
            <mat-card>
              <mat-card-header><mat-card-title>Detalhes</mat-card-title></mat-card-header>
              <mat-card-content>
                <div class="info-item"><span class="label">Tipo</span><span>{{ sig.contractType }}</span></div>
                <div class="info-item"><span class="label">Valor</span><span>{{ sig.contractValue | currencyPt }}</span></div>
                @if (contract(); as c) {
                  <div class="info-item"><span class="label">Início</span><span>{{ c.startDate | date:'dd/MM/yyyy' }}</span></div>
                  <div class="info-item"><span class="label">Fim</span><span>{{ c.endDate | date:'dd/MM/yyyy' }}</span></div>
                  <div class="info-item"><span class="label">Departamento</span><span>{{ c.department }}</span></div>

                  <mat-divider />

                  <h4>Partes</h4>
                  @for (party of c.parties; track party.id) {
                    <div class="party">{{ party.name }} ({{ party.role }})</div>
                  }

                  <mat-divider />

                  <h4>Documentos</h4>
                  @for (doc of c.documents; track doc.id) {
                    <div class="doc"><mat-icon>description</mat-icon> {{ doc.name }}</div>
                  }
                }
              </mat-card-content>
            </mat-card>

            <mat-card class="actions-card">
              @if (!showDeclineForm()) {
                <button mat-raised-button color="primary" class="sign-btn" (click)="onSign()">
                  <mat-icon>draw</mat-icon> Assinar
                </button>
                <button mat-stroked-button color="warn" (click)="showDeclineForm.set(true)">
                  <mat-icon>close</mat-icon> Recusar
                </button>
              } @else {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Motivo da recusa</mat-label>
                  <textarea matInput [(ngModel)]="declineReason" rows="3" placeholder="Indique o motivo..."></textarea>
                </mat-form-field>
                <div class="decline-actions">
                  <button mat-raised-button color="warn" [disabled]="!declineReason" (click)="onDecline()">Confirmar Recusa</button>
                  <button mat-stroked-button (click)="showDeclineForm.set(false)">Cancelar</button>
                </div>
              }
            </mat-card>
          </div>
        </div>
      } @else {
        <mat-card class="not-found">
          <mat-icon>search_off</mat-icon>
          <h3>Pedido de assinatura não encontrado</h3>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .sign { max-width: 1100px; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; color: #666; text-decoration: none; margin-bottom: 16px; font-size: 14px; }
    .back-link:hover { color: #1a237e; }
    .sign-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .sign-header h2 { margin: 0; font-weight: 400; flex: 1; }
    .badge { padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
    .badge.pending { background: #FFF3E0; color: #E65100; }

    .sign-grid { display: grid; grid-template-columns: 1fr 380px; gap: 16px; }

    .preview-card { min-height: 500px; }
    .preview-placeholder {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 48px; text-align: center; color: #666; height: 100%;
      background: #fafafa;
    }
    .preview-placeholder mat-icon { font-size: 64px; width: 64px; height: 64px; color: #1a237e; opacity: 0.4; }
    .preview-placeholder h3 { color: #555; }
    .mock-viewer { margin-top: 16px; }
    .mock-page {
      display: flex; align-items: center; gap: 8px;
      padding: 12px; margin: 4px 0; background: white; border-radius: 8px; border: 1px solid #e0e0e0;
    }
    .mock-page mat-icon { color: #1a237e; }

    .side-panel { display: flex; flex-direction: column; gap: 16px; }
    .info-item { display: flex; flex-direction: column; margin-bottom: 12px; }
    .label { font-size: 12px; color: #888; margin-bottom: 2px; }
    h4 { margin: 12px 0 8px; font-weight: 500; color: #555; font-size: 14px; }
    .party { font-size: 14px; margin-bottom: 4px; }
    .doc { display: flex; align-items: center; gap: 8px; font-size: 14px; margin-bottom: 4px; }

    .actions-card { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .sign-btn { height: 48px; font-size: 16px; }
    .full-width { width: 100%; }
    .decline-actions { display: flex; gap: 8px; }

    .not-found { text-align: center; padding: 48px; color: #999; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; }
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
  }

  onSign() {
    this.signatureService.sign(this.signatureId);
    this.snackBar.open('Contrato assinado com sucesso!', 'OK', { duration: 3000 });
    this.router.navigate(['/signer/pending']);
  }

  onDecline() {
    this.signatureService.decline(this.signatureId, this.declineReason);
    this.snackBar.open('Assinatura recusada', 'OK', { duration: 3000 });
    this.router.navigate(['/signer/pending']);
  }
}
