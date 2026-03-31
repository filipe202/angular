import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ContractService } from '../../../core/services/contract.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterLink, DecimalPipe, MatIconModule, MatButtonModule, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="dash">
      <!-- Header -->
      <div class="dash-header animate-in">
        <div>
          <h1>Contract Management</h1>
          <p class="subtitle">Overview of the contract portfolio</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/app/approvals" class="cta-btn">
          <mat-icon>task_alt</mat-icon>
          {{ kpis().pendingApproval }} to approve
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
            <h3>By Status</h3>
            <span class="panel-count">{{ kpis().totalContracts }} contracts</span>
          </div>
          <div class="panel-body">
            @for (item of kpis().contractsByStatus; track item.status) {
              <div class="bar-row">
                <div class="bar-label">
                  <span class="bar-dot" [style.background]="getStatusColor(item.status)"></span>
                  <span class="bar-label-text">{{ getStatusLabel(item.status) }}</span>
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
            <h3>By Type</h3>
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
            <h3>Monthly Trend</h3>
            <div class="legend">
              <span class="leg"><span class="leg-dot created"></span>Created</span>
              <span class="leg"><span class="leg-dot signed"></span>Signed</span>
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
            <h3>Expiring Soon</h3>
            <span class="panel-badge warn">{{ expiringContracts().length }} in next 30 days</span>
          </div>
          <div class="panel-body no-pad">
            @for (c of expiringContracts(); track c.id) {
              <a class="expire-row" [routerLink]="'/app/contracts/' + c.id">
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
              <div class="empty-mini"><mat-icon>check_circle</mat-icon> Nothing expiring in the next 30 days</div>
            }
          </div>
        </div>
      </div>

      <!-- Activity -->
      <div class="panel animate-in animate-delay-7">
        <div class="panel-head">
          <h3>Recent Activity</h3>
        </div>
        <div class="panel-body no-pad">
          @for (a of kpis().recentActivity; track a.id) {
            <div class="act-row">
              <div class="act-icon" [class]="getActivityType(a.action)">
                <mat-icon>{{ getActivityIcon(a.action) }}</mat-icon>
              </div>
              <div class="act-text">
                <strong>{{ a.user }}</strong> {{ a.action }}
                <a [routerLink]="'/app/contracts/' + a.contractId">{{ a.contractTitle }}</a>
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

    /* ── Header ── */
    .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 12px; flex-wrap: wrap; }
    h1 { margin: 0; font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 13px; color: var(--text-tertiary); }
    .cta-btn { height: 38px !important; font-size: 13px !important; border-radius: var(--radius-sm) !important; white-space: nowrap; flex-shrink: 0; }

    /* ── KPI Strip ── */
    .kpi-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px; margin-bottom: 16px;
    }
    .kpi {
      background: var(--surface-card); border-radius: var(--radius-lg); padding: 16px;
      border: 1px solid var(--border-subtle); overflow: hidden; min-width: 0;
      transition: box-shadow var(--t-normal), transform var(--t-normal);
    }
    .kpi:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .kpi-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .kpi-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kpi-icon mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .kpi.teal .kpi-icon { background: var(--ch-teal-subtle); }
    .kpi.teal .kpi-icon mat-icon { color: var(--ch-teal); }
    .kpi.amber .kpi-icon { background: var(--ch-amber-subtle); }
    .kpi.amber .kpi-icon mat-icon { color: var(--ch-amber); }
    .kpi.coral .kpi-icon { background: rgba(232,93,74,0.08); }
    .kpi.coral .kpi-icon mat-icon { color: var(--ch-coral); }
    .kpi.navy .kpi-icon { background: rgba(12,18,34,0.06); }
    .kpi.navy .kpi-icon mat-icon { color: var(--ch-navy); }
    .kpi-trend { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: var(--radius-full); white-space: nowrap; }
    .kpi-trend.up { background: rgba(5,150,105,0.08); color: var(--ch-emerald); }
    .kpi-trend.down { background: rgba(232,93,74,0.06); color: var(--ch-coral); }
    .kpi-value {
      font-size: clamp(18px, 2.2vw, 26px); font-weight: 800;
      color: var(--text-primary); letter-spacing: -0.03em; line-height: 1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .kpi-label { font-size: 11px; color: var(--text-tertiary); margin-top: 3px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .kpi-bar { height: 3px; background: var(--surface-muted); border-radius: 2px; margin-top: 12px; }
    .kpi.teal .kpi-bar-fill { background: var(--ch-teal); }
    .kpi.amber .kpi-bar-fill { background: var(--ch-amber); }
    .kpi.coral .kpi-bar-fill { background: var(--ch-coral); }
    .kpi.navy .kpi-bar-fill { background: var(--ch-navy); }
    .kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s var(--ease-out); }

    /* ── Panels ── */
    .panel { background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden; min-width: 0; }
    .panel-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 14px 16px; border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; }
    .panel-head h3 { margin: 0; font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; }
    .panel-count { font-size: 11px; font-weight: 600; color: var(--text-tertiary); padding: 2px 8px; background: var(--surface-bg); border-radius: var(--radius-full); white-space: nowrap; }
    .panel-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); white-space: nowrap; }
    .panel-badge.warn { background: var(--ch-amber-subtle); color: #a07c14; }
    .panel-body { padding: 14px 16px; }
    .panel-body.no-pad { padding: 0; }

    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }

    /* ── Status / Type Bars ── */
    .bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .bar-row:last-child { margin-bottom: 0; }
    .bar-label {
      min-width: 0; flex: 1 1 0; max-width: 45%;
      font-size: 11.5px; color: var(--text-secondary); font-weight: 500;
      display: flex; align-items: center; gap: 5px; overflow: hidden;
    }
    .bar-label-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .bar-track { flex: 1 1 0; min-width: 0; height: 4px; background: var(--surface-muted); border-radius: 2px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 2px; transition: width 0.7s var(--ease-out); }
    .bar-count { flex-shrink: 0; width: 22px; text-align: right; font-size: 12px; font-weight: 800; color: var(--text-primary); }

    .type-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .type-row:last-child { margin-bottom: 0; }
    .type-rank { width: 18px; height: 18px; border-radius: 5px; background: var(--surface-bg); font-size: 10px; font-weight: 800; color: var(--text-tertiary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .type-name { flex: 1 1 0; min-width: 0; max-width: 50%; font-size: 11.5px; font-weight: 500; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .type-bar-wrap { flex: 1 1 0; min-width: 0; height: 4px; background: var(--surface-muted); border-radius: 2px; overflow: hidden; }
    .type-bar { height: 100%; border-radius: 2px; background: var(--ch-teal); opacity: 0.75; transition: width 0.7s var(--ease-out); }
    .type-count { flex-shrink: 0; width: 22px; text-align: right; font-size: 12px; font-weight: 800; color: var(--text-primary); }

    /* ── Chart ── */
    .chart { display: flex; justify-content: space-around; align-items: flex-end; height: 120px; padding-top: 8px; overflow: hidden; }
    .chart-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; min-width: 0; }
    .col-bars { display: flex; align-items: flex-end; gap: 2px; }
    .col-bar { width: 14px; border-radius: 3px 3px 0 0; min-height: 3px; position: relative; transition: height 0.7s var(--ease-out); }
    .col-bar:hover .col-tip { opacity: 1; transform: translateX(-50%) translateY(-4px); }
    .col-tip { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 800; color: var(--text-primary); background: var(--surface-card); padding: 2px 5px; border-radius: 4px; box-shadow: var(--shadow-sm); opacity: 0; transition: all 200ms; pointer-events: none; white-space: nowrap; }
    .col-bar.created { background: var(--ch-teal); }
    .col-bar.signed { background: var(--ch-amber); }
    .col-label { font-size: 9px; color: var(--text-tertiary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; text-align: center; }
    .legend { display: flex; gap: 12px; flex-wrap: wrap; }
    .leg { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-tertiary); font-weight: 500; }
    .leg-dot { width: 8px; height: 8px; border-radius: 3px; flex-shrink: 0; }
    .leg-dot.created { background: var(--ch-teal); }
    .leg-dot.signed { background: var(--ch-amber); }

    /* ── Expiring ── */
    .expire-row { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-bottom: 1px solid var(--border-subtle); text-decoration: none; color: inherit; transition: background var(--t-fast); min-width: 0; }
    .expire-row:last-child { border-bottom: none; }
    .expire-row:hover { background: var(--surface-hover); }
    .expire-row:hover .expire-go { opacity: 1; }
    .expire-heat { width: 3px; height: 28px; border-radius: 2px; flex-shrink: 0; background: var(--border-light); }
    .expire-heat.hot { background: var(--ch-coral); }
    .expire-heat.warm { background: var(--ch-amber); }
    .expire-info { flex: 1; min-width: 0; }
    .expire-title { font-size: 12px; font-weight: 600; color: var(--text-primary); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .expire-when { font-size: 11px; color: var(--text-tertiary); margin-top: 1px; display: block; }
    .expire-value { font-size: 12px; font-weight: 700; color: var(--text-primary); white-space: nowrap; flex-shrink: 0; }
    .expire-go { color: var(--text-tertiary); opacity: 0; transition: opacity 200ms; font-size: 16px !important; flex-shrink: 0; }
    .empty-mini { padding: 20px 16px; font-size: 13px; color: var(--text-tertiary); display: flex; align-items: center; gap: 8px; }
    .empty-mini mat-icon { color: var(--ch-emerald); font-size: 18px; width: 18px; height: 18px; }

    /* ── Activity ── */
    .act-row { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-bottom: 1px solid var(--border-subtle); min-width: 0; }
    .act-row:last-child { border-bottom: none; }
    .act-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .act-icon mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .act-icon.create { background: rgba(13,148,136,0.08); }
    .act-icon.create mat-icon { color: var(--ch-teal); }
    .act-icon.approve { background: rgba(5,150,105,0.08); }
    .act-icon.approve mat-icon { color: var(--ch-emerald); }
    .act-icon.sign { background: rgba(124,92,252,0.08); }
    .act-icon.sign mat-icon { color: var(--ch-violet); }
    .act-icon.reject { background: rgba(232,93,74,0.06); }
    .act-icon.reject mat-icon { color: var(--ch-coral); }
    .act-text { flex: 1; min-width: 0; font-size: 12.5px; color: var(--text-secondary); line-height: 1.4; overflow: hidden; }
    .act-text strong { color: var(--text-primary); font-weight: 600; }
    .act-text a { color: var(--ch-teal); text-decoration: none; font-weight: 500; }
    .act-text a:hover { text-decoration: underline; }
    .act-time { font-size: 11px; color: var(--text-tertiary); white-space: nowrap; flex-shrink: 0; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .kpi-strip { grid-template-columns: repeat(2, 1fr); }
      .row-2 { grid-template-columns: 1fr; }
    }
    @media (max-width: 560px) {
      .kpi-strip { grid-template-columns: 1fr 1fr; gap: 8px; }
      .kpi { padding: 12px; }
      .kpi-value { font-size: 18px; }
    }
  `]
})
export class ManagerDashboardComponent {
  kpis;
  expiringContracts;

  constructor(private dashboardService: DashboardService, private contractService: ContractService) {
    this.kpis = dashboardService.dashboardKPIs;
    this.expiringContracts = contractService.getExpiringContracts(30);
    this.contractService.loadAll();
  }

  maxStatus = computed(() => Math.max(...this.kpis().contractsByStatus.map(s => s.count)));
  maxType = computed(() => Math.max(...this.kpis().contractsByType.map(t => t.count)));

  kpiCards = computed(() => [
    { label: 'Active Contracts', value: this.kpis().activeContracts, icon: 'folder_open', accent: 'teal', trend: 3, trendSuffix: ' mo', prefix: null, suffix: null, barPct: 70 },
    { label: 'Pending Approval', value: this.kpis().pendingApproval, icon: 'pending_actions', accent: 'amber', trend: -2, trendSuffix: ' wk', prefix: null, suffix: null, barPct: 40 },
    { label: 'Expiring in 30 days', value: this.kpis().expiringIn30Days, icon: 'schedule', accent: 'coral', trend: null, trendSuffix: '', prefix: null, suffix: null, barPct: 25 },
    { label: 'Total Value', value: this.kpis().totalValue / 1000, icon: 'payments', accent: 'navy', trend: 180, trendSuffix: 'k', prefix: '€', suffix: 'k', barPct: 85 }
  ]);

  // Status and type labels/colors are dynamic — use raw values directly
  getStatusLabel(s: string) { return s; }
  getTypeLabel(t: string) { return t; }
  daysLeft(d: Date) { return Math.round((new Date(d).getTime() - Date.now()) / 86400000); }

  getStatusColor(status: string): string {
    const m: Record<string, string> = {
      'Pending':    '#d4a017',
      'Dispatched': '#059669',
      'Canceled':   '#e85d4a',
      'Suspended':  '#9333ea',
      'Edition':    '#3b82f6',
    };
    return m[status] ?? '#7a8ba5';
  }

  getActivityType(action: string): string {
    const a = action.toLowerCase();
    if (a.includes('creat') || a.includes('draft') || a.includes('cri')) return 'create';
    if (a.includes('approv') || a.includes('aprov')) return 'approve';
    if (a.includes('sign') || a.includes('assinou')) return 'sign';
    if (a.includes('reject') || a.includes('rejeit')) return 'reject';
    return 'create';
  }
  getActivityIcon(action: string): string {
    const a = action.toLowerCase();
    if (a.includes('creat') || a.includes('draft') || a.includes('cri')) return 'add_circle_outline';
    if (a.includes('approv') || a.includes('aprov')) return 'check_circle_outline';
    if (a.includes('sign') || a.includes('assinou')) return 'draw';
    if (a.includes('reject') || a.includes('rejeit')) return 'cancel';
    return 'circle';
  }
}
