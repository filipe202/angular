import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';
import { SignatureService } from '../../../core/services/signature.service';
import { ContractService } from '../../../core/services/contract.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-signer-dashboard',
  imports: [RouterLink, MatIconModule, MatButtonModule, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="dash">
      <div class="dash-header animate-in">
        <div>
          <h1>Olá, {{ userName() }}</h1>
          <p class="subtitle">Resumo das suas assinaturas</p>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpi-row animate-in animate-delay-1">
        <div class="kpi urgent">
          <div class="kpi-icon"><mat-icon>draw</mat-icon></div>
          <div class="kpi-num">{{ pending().length }}</div>
          <div class="kpi-label">Pendentes</div>
          @if (pending().length > 0) {
            <a class="kpi-link" routerLink="/app/pending">Ver pendentes &rarr;</a>
          }
        </div>
        <div class="kpi">
          <div class="kpi-icon signed"><mat-icon>verified</mat-icon></div>
          <div class="kpi-num">{{ signed().length }}</div>
          <div class="kpi-label">Assinados</div>
        </div>
        <div class="kpi">
          <div class="kpi-icon visible"><mat-icon>folder_open</mat-icon></div>
          <div class="kpi-num">{{ allContracts().length }}</div>
          <div class="kpi-label">Visíveis</div>
        </div>
      </div>

      <!-- Pending -->
      @if (pending().length > 0) {
        <div class="section animate-in animate-delay-3">
          <div class="section-head">
            <h2>Aguardam Assinatura</h2>
            <a mat-stroked-button routerLink="/app/pending">Ver todos</a>
          </div>

          <div class="sig-grid">
            @for (sig of pending(); track sig.id; let i = $index) {
              <div class="sig-card" [style.animation-delay]="((i + 4) * 60) + 'ms'">
                <div class="sig-accent"></div>
                <div class="sig-body">
                  <div class="sig-top">
                    <span class="sig-type">{{ sig.contractType }}</span>
                    <span class="sig-time">{{ sig.requestedAt | relativeDate }}</span>
                  </div>
                  <h3>{{ sig.contractTitle }}</h3>
                  <div class="sig-meta">
                    <span><mat-icon>person</mat-icon> {{ sig.requestedBy.name }}</span>
                    @if (sig.contractValue > 0) {
                      <span><mat-icon>payments</mat-icon> {{ sig.contractValue | currencyPt }}</span>
                    }
                  </div>
                  <div class="sig-actions">
                    <a mat-stroked-button [routerLink]="'/app/contracts/' + sig.contractId" class="view-btn">
                      <mat-icon>visibility</mat-icon> Ver
                    </a>
                    <a mat-raised-button color="primary" [routerLink]="'/app/sign/' + sig.id" class="sign-btn">
                      <mat-icon>draw</mat-icon> Assinar
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Recent signed -->
      @if (signed().length > 0) {
        <div class="section animate-in animate-delay-5">
          <div class="section-head">
            <h2>Assinados Recentemente</h2>
            <a mat-stroked-button routerLink="/app/history">Histórico</a>
          </div>

          @for (sig of signed().slice(0, 3); track sig.id) {
            <a class="history-row" [routerLink]="'/app/contracts/' + sig.contractId">
              <div class="history-icon"><mat-icon>verified</mat-icon></div>
              <div class="history-info">
                <span class="history-title">{{ sig.contractTitle }}</span>
                <span class="history-meta">{{ sig.contractType }} &middot; {{ sig.contractValue | currencyPt }}</span>
              </div>
              <span class="history-date">{{ (sig.signedAt ?? sig.requestedAt) | relativeDate }}</span>
              <mat-icon class="history-go">chevron_right</mat-icon>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dash { max-width: 960px; margin: 0 auto; }

    .dash-header { margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }

    /* ── KPIs ── */
    .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
    .kpi {
      background: var(--surface-card); border-radius: var(--radius-lg); padding: 20px;
      border: 1px solid var(--border-subtle);
      transition: all var(--t-normal);
    }
    .kpi:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .kpi.urgent { border-left: 3px solid var(--ch-amber); }
    .kpi-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
      background: var(--ch-amber-subtle);
    }
    .kpi-icon mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ch-amber); }
    .kpi-icon.signed { background: rgba(5,150,105,0.08); }
    .kpi-icon.signed mat-icon { color: var(--ch-emerald); }
    .kpi-icon.visible { background: var(--ch-teal-subtle); }
    .kpi-icon.visible mat-icon { color: var(--ch-teal); }
    .kpi-num { font-size: 30px; font-weight: 800; color: var(--text-primary); line-height: 1; }
    .kpi-label { font-size: 12px; color: var(--text-tertiary); margin-top: 4px; font-weight: 500; }
    .kpi-link { font-size: 11px; font-weight: 700; color: var(--ch-teal); margin-top: 8px; display: inline-block; text-decoration: none; }
    .kpi-link:hover { text-decoration: underline; }

    /* ── Section ── */
    .section { margin-bottom: 28px; }
    .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .section-head h2 { margin: 0; font-size: 16px; font-weight: 700; }

    /* ── Signature Cards ── */
    .sig-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px; }
    .sig-card {
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle); overflow: hidden;
      transition: all var(--t-normal);
      animation: fadeInUp 0.4s var(--ease-out) both;
    }
    .sig-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
    .sig-accent { height: 3px; background: linear-gradient(90deg, var(--ch-amber), var(--ch-teal)); }
    .sig-body { padding: 18px; }
    .sig-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .sig-type {
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 2px 8px; border-radius: var(--radius-full);
    }
    .sig-time { font-size: 11px; color: var(--text-tertiary); }
    .sig-body h3 { margin: 0 0 10px; font-size: 15px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
    .sig-meta { display: flex; gap: 14px; margin-bottom: 14px; }
    .sig-meta span { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-tertiary); }
    .sig-meta mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .sig-actions { display: flex; gap: 8px; }
    .view-btn, .sign-btn { flex: 1; font-size: 12px !important; }

    /* ── History ── */
    .history-row {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px; margin-bottom: 6px;
      background: var(--surface-card); border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      text-decoration: none; color: inherit;
      transition: all var(--t-fast);
    }
    .history-row:hover { box-shadow: var(--shadow-sm); border-color: var(--ch-teal); }
    .history-row:hover .history-go { opacity: 1; }
    .history-icon { width: 28px; height: 28px; border-radius: 7px; background: rgba(5,150,105,0.08); display: flex; align-items: center; justify-content: center; }
    .history-icon mat-icon { font-size: 15px; width: 15px; height: 15px; color: var(--ch-emerald); }
    .history-info { flex: 1; }
    .history-title { font-size: 13px; font-weight: 600; color: var(--text-primary); display: block; }
    .history-meta { font-size: 11px; color: var(--text-tertiary); }
    .history-date { font-size: 11px; color: var(--text-tertiary); }
    .history-go { color: var(--text-tertiary); opacity: 0; transition: opacity 200ms; font-size: 18px !important; }
  `]
})
export class SignerDashboardComponent {
  userName;
  private userId;
  pending;
  signed;
  allContracts;

  constructor(
    private authService: AuthService,
    private signatureService: SignatureService,
    private contractService: ContractService
  ) {
    this.userName = computed(() => this.authService.user()?.name?.split(' ')[0] ?? '');
    this.userId = computed(() => this.authService.user()?.id ?? '');
    this.pending = computed(() => this.signatureService.getPendingByUser(this.userId())());
    this.signed = computed(() => this.signatureService.getHistoryByUser(this.userId())());
    this.allContracts = this.contractService.allContracts;
    this.signatureService.loadForCurrentUser();
    this.contractService.loadAll();
  }
}
