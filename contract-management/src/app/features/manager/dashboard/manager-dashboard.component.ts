import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ContractService } from '../../../core/services/contract.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterLink, DecimalPipe, MatIconModule, MatButtonModule, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="dash">
      <!-- Header -->
      <div class="dash-header animate-in">
        <div>
          <h1>Gestão de Contratos</h1>
          <p class="subtitle">Visão geral do portfolio contratual</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/manager/approvals" class="cta-btn">
          <mat-icon>task_alt</mat-icon>
          {{ kpis().pendingApproval }} para aprovar
        </a>
      </div>

      <!-- KPIs -->
      <div class="kpi-strip animate-in animate-delay-1">
        @for (kpi of kpiCards(); track kpi.label; let i = $index) {
          <div class="kpi" [class]="kpi.accent">
            <div class="kpi-head">
              <div class="kpi-icon"><mat-icon>{{ kpi.icon }}</mat-icon></div>
              @if (kpi.trend) {
                <span class="kpi-trend" [class.up]="kpi.trend > 0" [class.down]="kpi.trend < 0">
                  {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}{{ kpi.trendSuffix }}
                </span>
              }
            </div>
            <div class="kpi-value">{{ kpi.prefix ?? '' }}{{ kpi.value | number }}{{ kpi.suffix ?? '' }}</div>
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-bar"><div class="kpi-bar-fill" [style.width.%]="kpi.barPct"></div></div>
          </div>
        }
      </div>

      <!-- Charts row -->
      <div class="row-2 animate-in animate-delay-3">
        <!-- Status breakdown -->
        <div class="panel">
          <div class="panel-head">
            <h3>Por Estado</h3>
            <span class="panel-count">{{ kpis().totalContracts }} contratos</span>
          </div>
          <div class="panel-body">
            @for (item of kpis().contractsByStatus; track item.status) {
              <div class="bar-row">
                <div class="bar-label">
                  <span class="bar-dot" [style.background]="getStatusColor(item.status)"></span>
                  {{ getStatusLabel(item.status) }}
                </div>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="(item.count / maxStatus()) * 100" [style.background]="getStatusColor(item.status)"></div>
                </div>
                <span class="bar-count">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Type breakdown -->
        <div class="panel">
          <div class="panel-head">
            <h3>Por Tipo</h3>
          </div>
          <div class="panel-body">
            @for (item of kpis().contractsByType; track item.type; let i = $index) {
              <div class="type-row">
                <span class="type-rank">{{ i + 1 }}</span>
                <span class="type-name">{{ getTypeLabel(item.type) }}</span>
                <div class="type-bar-wrap">
                  <div class="type-bar" [style.width.%]="(item.count / maxType()) * 100"></div>
                </div>
                <span class="type-count">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Trend + Expiring -->
      <div class="row-2 animate-in animate-delay-5">
        <!-- Monthly trend -->
        <div class="panel">
          <div class="panel-head">
            <h3>Tendência Mensal</h3>
            <div class="legend">
              <span class="leg"><span class="leg-dot created"></span>Criados</span>
              <span class="leg"><span class="leg-dot signed"></span>Assinados</span>
            </div>
          </div>
          <div class="panel-body">
            <div class="chart">
              @for (m of kpis().monthlyTrend; track m.month) {
                <div class="chart-col">
                  <div class="col-bars">
                    <div class="col-bar created" [style.height.px]="m.created * 8">
                      <span class="col-tip">{{ m.created }}</span>
                    </div>
                    <div class="col-bar signed" [style.height.px]="m.signed * 8">
                      <span class="col-tip">{{ m.signed }}</span>
                    </div>
                  </div>
                  <span class="col-label">{{ m.month }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Expiring -->
        <div class="panel">
          <div class="panel-head">
            <h3>A Expirar</h3>
            <span class="panel-badge warn">{{ expiringContracts().length }} nos próx. 30 dias</span>
          </div>
          <div class="panel-body no-pad">
            @for (c of expiringContracts(); track c.id) {
              <a class="expire-row" [routerLink]="'/manager/contracts/' + c.id">
                <div class="expire-heat" [class.hot]="daysLeft(c.endDate) <= 7" [class.warm]="daysLeft(c.endDate) > 7 && daysLeft(c.endDate) <= 15"></div>
                <div class="expire-info">
                  <span class="expire-title">{{ c.title }}</span>
                  <span class="expire-when">{{ c.endDate | relativeDate }}</span>
                </div>
                <span class="expire-value">{{ c.value | currencyPt }}</span>
                <mat-icon class="expire-go">chevron_right</mat-icon>
              </a>
            }
            @if (expiringContracts().length === 0) {
              <div class="empty-mini"><mat-icon>check_circle</mat-icon> Sem expirar nos próximos 30 dias</div>
            }
          </div>
        </div>
      </div>

      <!-- Activity -->
      <div class="panel animate-in animate-delay-7">
        <div class="panel-head">
          <h3>Atividade Recente</h3>
        </div>
        <div class="panel-body no-pad">
          @for (a of kpis().recentActivity; track a.id) {
            <div class="act-row">
              <div class="act-icon" [class]="getActivityType(a.action)">
                <mat-icon>{{ getActivityIcon(a.action) }}</mat-icon>
              </div>
              <div class="act-text">
                <strong>{{ a.user }}</strong> {{ a.action }}
                <a [routerLink]="'/manager/contracts/' + a.contractId">{{ a.contractTitle }}</a>
              </div>
              <span class="act-time">{{ a.timestamp | relativeDate }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dash { max-width: 1200px; margin: 0 auto; }

    .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }
    .cta-btn { height: 40px !important; font-size: 13px !important; border-radius: var(--radius-sm) !important; }

    /* ── KPI Strip ── */
    .kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
    .kpi {
      background: var(--surface-card); border-radius: var(--radius-lg); padding: 18px 20px;
      border: 1px solid var(--border-subtle); position: relative; overflow: hidden;
      transition: all var(--t-normal);
    }
    .kpi:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .kpi-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
    .kpi-icon {
      width: 36px; height: 36px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .kpi-icon mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .kpi.teal .kpi-icon { background: var(--ch-teal-subtle); }
    .kpi.teal .kpi-icon mat-icon { color: var(--ch-teal); }
    .kpi.amber .kpi-icon { background: var(--ch-amber-subtle); }
    .kpi.amber .kpi-icon mat-icon { color: var(--ch-amber); }
    .kpi.coral .kpi-icon { background: rgba(232,93,74,0.08); }
    .kpi.coral .kpi-icon mat-icon { color: var(--ch-coral); }
    .kpi.navy .kpi-icon { background: rgba(12,18,34,0.06); }
    .kpi.navy .kpi-icon mat-icon { color: var(--ch-navy); }

    .kpi-trend {
      font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full);
    }
    .kpi-trend.up { background: rgba(5,150,105,0.08); color: var(--ch-emerald); }
    .kpi-trend.down { background: rgba(232,93,74,0.06); color: var(--ch-coral); }

    .kpi-value { font-size: 28px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; line-height: 1; }
    .kpi-label { font-size: 12px; color: var(--text-tertiary); margin-top: 4px; font-weight: 500; }
    .kpi-bar { height: 3px; background: var(--surface-muted); border-radius: 2px; margin-top: 14px; }
    .kpi.teal .kpi-bar-fill { background: var(--ch-teal); }
    .kpi.amber .kpi-bar-fill { background: var(--ch-amber); }
    .kpi.coral .kpi-bar-fill { background: var(--ch-coral); }
    .kpi.navy .kpi-bar-fill { background: var(--ch-navy); }
    .kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s var(--ease-out); }

    /* ── Panels ── */
    .panel {
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle); overflow: hidden;
      transition: box-shadow var(--t-normal);
    }
    .panel:hover { box-shadow: var(--shadow-sm); }
    .panel-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);
    }
    .panel-head h3 { margin: 0; font-size: 14px; font-weight: 700; color: var(--text-primary); }
    .panel-count { font-size: 11px; font-weight: 600; color: var(--text-tertiary); padding: 2px 8px; background: var(--surface-bg); border-radius: var(--radius-full); }
    .panel-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: var(--radius-full); }
    .panel-badge.warn { background: var(--ch-amber-subtle); color: #a07c14; }
    .panel-body { padding: 16px 20px; }
    .panel-body.no-pad { padding: 0; }

    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }

    /* ── Status Bars ── */
    .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .bar-row:last-child { margin-bottom: 0; }
    .bar-label { width: 130px; font-size: 12.5px; color: var(--text-secondary); font-weight: 500; display: flex; align-items: center; gap: 7px; }
    .bar-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .bar-track { flex: 1; height: 8px; background: var(--surface-muted); border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.7s var(--ease-out); }
    .bar-count { width: 26px; text-align: right; font-size: 13px; font-weight: 800; color: var(--text-primary); }

    /* ── Type Rows ── */
    .type-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .type-row:last-child { margin-bottom: 0; }
    .type-rank {
      width: 22px; height: 22px; border-radius: 6px; background: var(--surface-bg);
      font-size: 11px; font-weight: 800; color: var(--text-tertiary);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .type-name { width: 110px; font-size: 12.5px; font-weight: 500; color: var(--text-secondary); }
    .type-bar-wrap { flex: 1; height: 8px; background: var(--surface-muted); border-radius: 4px; overflow: hidden; }
    .type-bar { height: 100%; border-radius: 4px; background: var(--ch-teal); opacity: 0.7; transition: width 0.7s var(--ease-out); }
    .type-count { width: 26px; text-align: right; font-size: 13px; font-weight: 800; color: var(--text-primary); }

    /* ── Chart ── */
    .chart { display: flex; justify-content: space-around; align-items: flex-end; height: 140px; padding-top: 8px; }
    .chart-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .col-bars { display: flex; align-items: flex-end; gap: 3px; }
    .col-bar {
      width: 18px; border-radius: 4px 4px 0 0; min-height: 4px; position: relative;
      transition: height 0.7s var(--ease-out);
    }
    .col-bar:hover .col-tip { opacity: 1; transform: translateX(-50%) translateY(-4px); }
    .col-tip {
      position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
      font-size: 10px; font-weight: 800; color: var(--text-primary);
      background: var(--surface-card); padding: 2px 5px; border-radius: 4px;
      box-shadow: var(--shadow-sm); opacity: 0; transition: all 200ms; pointer-events: none;
    }
    .col-bar.created { background: var(--ch-teal); }
    .col-bar.signed { background: var(--ch-amber); }
    .col-label { font-size: 10px; color: var(--text-tertiary); font-weight: 600; }
    .legend { display: flex; gap: 14px; }
    .leg { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-tertiary); font-weight: 500; }
    .leg-dot { width: 8px; height: 8px; border-radius: 3px; }
    .leg-dot.created { background: var(--ch-teal); }
    .leg-dot.signed { background: var(--ch-amber); }

    /* ── Expiring ── */
    .expire-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; border-bottom: 1px solid var(--border-subtle);
      text-decoration: none; color: inherit;
      transition: background var(--t-fast);
    }
    .expire-row:last-child { border-bottom: none; }
    .expire-row:hover { background: var(--surface-hover); }
    .expire-row:hover .expire-go { opacity: 1; }
    .expire-heat {
      width: 4px; height: 32px; border-radius: 2px; flex-shrink: 0;
      background: var(--border-light);
    }
    .expire-heat.hot { background: var(--ch-coral); }
    .expire-heat.warm { background: var(--ch-amber); }
    .expire-info { flex: 1; }
    .expire-title { font-size: 13px; font-weight: 600; color: var(--text-primary); display: block; }
    .expire-when { font-size: 11px; color: var(--text-tertiary); margin-top: 1px; display: block; }
    .expire-value { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .expire-go { color: var(--text-tertiary); opacity: 0; transition: opacity 200ms; font-size: 18px !important; }
    .empty-mini { padding: 24px 20px; font-size: 13px; color: var(--text-tertiary); display: flex; align-items: center; gap: 8px; }
    .empty-mini mat-icon { color: var(--ch-emerald); font-size: 18px; width: 18px; height: 18px; }

    /* ── Activity ── */
    .act-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; border-bottom: 1px solid var(--border-subtle);
    }
    .act-row:last-child { border-bottom: none; }
    .act-icon {
      width: 30px; height: 30px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .act-icon mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .act-icon.create { background: rgba(13,148,136,0.08); }
    .act-icon.create mat-icon { color: var(--ch-teal); }
    .act-icon.approve { background: rgba(5,150,105,0.08); }
    .act-icon.approve mat-icon { color: var(--ch-emerald); }
    .act-icon.sign { background: rgba(124,92,252,0.08); }
    .act-icon.sign mat-icon { color: var(--ch-violet); }
    .act-icon.reject { background: rgba(232,93,74,0.06); }
    .act-icon.reject mat-icon { color: var(--ch-coral); }
    .act-text { flex: 1; font-size: 13px; color: var(--text-secondary); line-height: 1.4; }
    .act-text strong { color: var(--text-primary); font-weight: 600; }
    .act-text a { color: var(--ch-teal); text-decoration: none; font-weight: 500; }
    .act-text a:hover { text-decoration: underline; }
    .act-time { font-size: 11px; color: var(--text-tertiary); white-space: nowrap; }
  `]
})
export class ManagerDashboardComponent {
  kpis;
  expiringContracts;

  constructor(private dashboardService: DashboardService, private contractService: ContractService) {
    this.kpis = dashboardService.dashboardKPIs;
    this.expiringContracts = contractService.getExpiringContracts(30);
  }

  maxStatus = computed(() => Math.max(...this.kpis().contractsByStatus.map(s => s.count)));
  maxType = computed(() => Math.max(...this.kpis().contractsByType.map(t => t.count)));

  kpiCards = computed(() => [
    { label: 'Contratos Ativos', value: this.kpis().activeContracts, icon: 'folder_open', accent: 'teal', trend: 3, trendSuffix: ' mês', prefix: null, suffix: null, barPct: 70 },
    { label: 'Pendentes Aprovação', value: this.kpis().pendingApproval, icon: 'pending_actions', accent: 'amber', trend: -2, trendSuffix: ' sem.', prefix: null, suffix: null, barPct: 40 },
    { label: 'Expiram em 30 dias', value: this.kpis().expiringIn30Days, icon: 'schedule', accent: 'coral', trend: null, trendSuffix: '', prefix: null, suffix: null, barPct: 25 },
    { label: 'Valor Total', value: this.kpis().totalValue / 1000, icon: 'payments', accent: 'navy', trend: 180, trendSuffix: 'k', prefix: '€', suffix: 'k', barPct: 85 }
  ]);

  getStatusLabel(s: any) { return (CONTRACT_STATUS_LABELS as any)[s] ?? s; }
  getTypeLabel(t: any) { return (CONTRACT_TYPE_LABELS as any)[t] ?? t; }
  daysLeft(d: Date) { return Math.round((new Date(d).getTime() - Date.now()) / 86400000); }

  getStatusColor(status: string): string {
    const m: Record<string, string> = {
      active: '#059669', pending_approval: '#d4a017', pending_signature: '#d4a017',
      draft: '#7a8ba5', signed: '#059669', expired: '#e85d4a',
      rejected: '#e85d4a', in_review: '#3b82f6'
    };
    return m[status] ?? '#7a8ba5';
  }

  getActivityType(action: string): string {
    if (action.includes('cri')) return 'create';
    if (action.includes('aprov')) return 'approve';
    if (action.includes('assinou')) return 'sign';
    if (action.includes('rejeit')) return 'reject';
    return 'create';
  }
  getActivityIcon(action: string): string {
    if (action.includes('cri')) return 'add_circle_outline';
    if (action.includes('aprov')) return 'check_circle_outline';
    if (action.includes('assinou')) return 'draw';
    if (action.includes('rejeit')) return 'cancel';
    return 'circle';
  }
}
