import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';
import { SignatureService } from '../../../core/services/signature.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-pending-signatures',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="pending">
      <div class="header">
        <h2>Contratos Pendentes de Assinatura</h2>
        <span class="count">{{ pendingSignatures().length }} pendentes</span>
      </div>

      @for (sig of pendingSignatures(); track sig.id) {
        <mat-card class="sig-card">
          <mat-icon class="sig-icon">description</mat-icon>
          <div class="sig-info">
            <h3>{{ sig.contractTitle }}</h3>
            <div class="sig-meta">
              <span>Tipo: {{ sig.contractType }}</span>
              <span>Valor: {{ sig.contractValue | currencyPt }}</span>
            </div>
            <div class="sig-meta">
              <span>Enviado por: {{ sig.requestedBy.name }}</span>
              <span>Recebido {{ sig.requestedAt | relativeDate }}</span>
            </div>
          </div>
          <a mat-raised-button color="primary" [routerLink]="'/signer/sign/' + sig.id">
            Ver e Assinar &rarr;
          </a>
        </mat-card>
      }

      @if (pendingSignatures().length === 0) {
        <mat-card class="empty">
          <mat-icon>check_circle</mat-icon>
          <h3>Tudo assinado!</h3>
          <p>Não tem contratos pendentes de assinatura.</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .pending { max-width: 800px; }
    .header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
    h2 { margin: 0; font-weight: 400; }
    .count { color: #888; font-size: 14px; }

    .sig-card {
      display: flex; align-items: center; gap: 20px;
      padding: 24px; margin-bottom: 16px;
    }

    .sig-icon { font-size: 40px; width: 40px; height: 40px; color: #1a237e; opacity: 0.6; }

    .sig-info { flex: 1; }
    .sig-info h3 { margin: 0 0 8px; font-weight: 500; }
    .sig-meta { display: flex; gap: 24px; font-size: 13px; color: #666; margin-bottom: 4px; }

    .empty { text-align: center; padding: 64px; color: #999; }
    .empty mat-icon { font-size: 72px; width: 72px; height: 72px; color: #4CAF50; }
    .empty h3 { color: #4CAF50; margin: 16px 0 8px; }
  `]
})
export class PendingSignaturesComponent {
  constructor(private authService: AuthService, private signatureService: SignatureService) {}

  private userId = computed(() => this.authService.user()?.id ?? '');
  pendingSignatures = computed(() => this.signatureService.getPendingByUser(this.userId())());
}
