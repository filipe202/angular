import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ContractService } from '../../../core/services/contract.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterLink, DatePipe, DecimalPipe, MatCardModule, MatIconModule, MatButtonModule, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="dashboard">
      <div class="page-header animate-in">
        <div>
          <h1>Bom dia, Maria</h1>
          <p class="page-subtitle">Aqui está o resumo da sua gestão de contratos</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/manager/approvals">
            <mat-icon>task_alt</mat-icon>
            {{ kpis().pendingApproval }} pendentes
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        @for (kpi of kpiCards(); track kpi.label; let i = $index) {
          <div class="kpi-card animate-in" [style.animation-delay]="(i * 80) + 'ms'">
            <div class="kpi-top">
              <div class="kpi-icon-wrap" [style.background]="kpi.gradient">
                <mat-icon>{{ kpi.icon }}</mat-icon>
              </div>
              @if (kpi.trend) {
                <span class="kpi-trend" [class.up]="kpi.trend > 0" [class.down]="kpi.trend < 0">
                  <mat-icon>{{ kpi.trend > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                  {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}{{ kpi.trendSuffix }}
                </span>
              }
            </div>
            <div class="kpi-value">{{ kpi.prefix ?? '' }}{{ kpi.value | number }}{{ kpi.suffix ?? '' }}</div>
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-sparkline" [style.background]="kpi.sparkBg"></div>
          </div>
        }
      </div>

      <div class="grid-2 animate-in animate-delay-4">
        <!-- Status Chart -->
        <div class="card">
          <div class="card-header">
            <h3>Contratos por Estado</h3>
            <span class="card-badge">{{ kpis().totalContracts }} total</span>
          </div>
          <div class="card-body">
            @for (item of kpis().contractsByStatus; track item.status) {
              <div class="h-bar-row">
                <span class="h-bar-label">{{ getStatusLabel(item.status) }}</span>
                <div class="h-bar-track">
                  <div class="h-bar-fill" [style.width.%]="(item.count / maxStatus()) * 100" [style.background]="getBarGradient(item.status)"></div>
                </div>
                <span class="h-bar-value">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Type Chart -->
        <div class="card">
          <div class="card-header">
            <h3>Contratos por Tipo</h3>
          </div>
          <div class="card-body">
            @for (item of kpis().contractsByType; track item.type) {
              <div class="h-bar-row">
                <span class="h-bar-label">{{ getTypeLabel(item.type) }}</span>
                <div class="h-bar-track">
                  <div class="h-bar-fill type-fill" [style.width.%]="(item.count / maxType()) * 100"></div>
                </div>
                <span class="h-bar-value">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="grid-2 animate-in animate-delay-6">
        <!-- Monthly Trend -->
        <div class="card">
          <div class="card-header">
            <h3>Tendência Mensal</h3>
            <div class="legend">
              <span class="legend-dot created"></span> Criados
              <span class="legend-dot signed"></span> Assinados
            </div>
          </div>
          <div class="card-body">
            <div class="chart-area">
              @for (m of kpis().monthlyTrend; track m.month) {
                <div class="chart-col">
                  <div class="bars-wrap">
                    <div class="bar bar-created" [style.height.px]="m.created * 7" [title]="'Criados: ' + m.created">
                      <span class="bar-tooltip">{{ m.created }}</span>
                    </div>
                    <div class="bar bar-signed" [style.height.px]="m.signed * 7" [title]="'Assinados: ' + m.signed">
                      <span class="bar-tooltip">{{ m.signed }}</span>
                    </div>
                  </div>
                  <span class="chart-label">{{ m.month }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Expiring -->
        <div class="card">
          <div class="card-header">
            <h3>A Expirar em Breve</h3>
            <mat-icon class="header-icon warn">schedule</mat-icon>
          </div>
          <div class="card-body">
            @for (c of expiringContracts(); track c.id) {
              <a class="expiry-row" [routerLink]="'/manager/contracts/' + c.id">
                <div class="expiry-indicator" [class.urgent]="daysLeft(c.endDate) <= 7" [class.warning]="daysLeft(c.endDate) > 7"></div>
                <div class="expiry-info">
                  <span class="expiry-title">{{ c.title }}</span>
                  <span class="expiry-meta">Expira {{ c.endDate | relativeDate }}</span>
                </div>
                <span class="expiry-value">{{ c.value | currencyPt }}</span>
                <mat-icon class="expiry-arrow">chevron_right</mat-icon>
              </a>
            }
            @if (expiringContracts().length === 0) {
              <div class="empty-state"><mat-icon>check_circle</mat-icon><span>Nenhum contrato a expirar nos próximos 30 dias</span></div>
            }
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="card animate-in animate-delay-8">
        <div class="card-header">
          <h3>Atividade Recente</h3>
        </div>
        <div class="card-body">
          @for (a of kpis().recentActivity; track a.id) {
            <div class="activity-row">
              <div class="activity-dot" [class]="getActivityColor(a.action)"></div>
              <div class="activity-content">
                <strong>{{ a.user }}</strong> {{ a.action }}
                <a [routerLink]="'/manager/contracts/' + a.contractId">"{{ a.contractTitle }}"</a>
              </div>
              <span class="activity-time">{{ a.timestamp | relativeDate }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; margin: 0 auto; }

    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px;
    }
    h1 { margin: 0; font-size: 28px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .page-subtitle { margin: 4px 0 0; font-size: 15px; color: var(--text-tertiary); }

    /* KPI Grid */
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card {
      background: var(--surface-card); border-radius: var(--radius-lg); padding: 20px 22px;
      border: 1px solid var(--border-subtle); position: relative; overflow: hidden;
      transition: all var(--transition-normal);
    }
    .kpi-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
    .kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .kpi-icon-wrap {
      width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
    }
    .kpi-icon-wrap mat-icon { font-size: 20px; width: 20px; height: 20px; color: white; }
    .kpi-trend {
      display: inline-flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600;
      padding: 2px 8px; border-radius: 20px;
    }
    .kpi-trend mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .kpi-trend.up { background: #ecfdf5; color: #059669; }
    .kpi-trend.down { background: #fef2f2; color: #dc2626; }
    .kpi-value { font-size: 30px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; line-height: 1; }
    .kpi-label { font-size: 13px; color: var(--text-tertiary); margin-top: 6px; font-weight: 500; }
    .kpi-sparkline {
      position: absolute; bottom: 0; left: 0; right: 0; height: 3px; opacity: 0.6;
    }

    /* Cards */
    .card {
      background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);
      overflow: hidden; transition: box-shadow var(--transition-normal);
    }
    .card:hover { box-shadow: var(--shadow-md); }
    .card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 22px; border-bottom: 1px solid var(--border-subtle);
    }
    .card-header h3 { margin: 0; font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .card-badge {
      font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
      background: #f1f5f9; color: #475569;
    }
    .card-body { padding: 18px 22px; }
    .header-icon.warn { color: #f59e0b; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

    /* Horizontal bars */
    .h-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .h-bar-row:last-child { margin-bottom: 0; }
    .h-bar-label { width: 130px; font-size: 13px; color: var(--text-secondary); font-weight: 500; }
    .h-bar-track { flex: 1; height: 24px; background: #f1f5f9; border-radius: 6px; overflow: hidden; }
    .h-bar-fill {
      height: 100%; border-radius: 6px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .type-fill { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
    .h-bar-value { width: 32px; text-align: right; font-size: 14px; font-weight: 700; color: var(--text-primary); }

    /* Chart */
    .chart-area { display: flex; justify-content: space-around; align-items: flex-end; height: 130px; padding-top: 12px; }
    .chart-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .bars-wrap { display: flex; align-items: flex-end; gap: 4px; }
    .bar {
      width: 22px; border-radius: 5px 5px 0 0; min-height: 4px; position: relative;
      transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .bar:hover .bar-tooltip { opacity: 1; transform: translateX(-50%) translateY(-4px); }
    .bar-tooltip {
      position: absolute; top: -24px; left: 50%; transform: translateX(-50%) translateY(0);
      font-size: 11px; font-weight: 700; color: var(--text-primary);
      background: white; padding: 2px 6px; border-radius: 4px; box-shadow: var(--shadow-md);
      opacity: 0; transition: all 200ms ease; pointer-events: none;
    }
    .bar-created { background: linear-gradient(180deg, #818cf8, #6366f1); }
    .bar-signed { background: linear-gradient(180deg, #34d399, #10b981); }
    .chart-label { font-size: 11px; color: var(--text-tertiary); font-weight: 500; }
    .legend { display: flex; gap: 12px; align-items: center; font-size: 12px; color: var(--text-tertiary); }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 3px; }
    .legend-dot.created { background: #6366f1; }
    .legend-dot.signed { background: #10b981; }

    /* Expiring */
    .expiry-row {
      display: flex; align-items: center; gap: 14px; padding: 14px 0;
      border-bottom: 1px solid var(--border-subtle); cursor: pointer; text-decoration: none; color: inherit;
      transition: all var(--transition-fast);
    }
    .expiry-row:last-child { border-bottom: none; }
    .expiry-row:hover { padding-left: 4px; }
    .expiry-row:hover .expiry-arrow { opacity: 1; transform: translateX(0); }
    .expiry-indicator {
      width: 4px; height: 36px; border-radius: 2px; flex-shrink: 0;
    }
    .expiry-indicator.urgent { background: linear-gradient(180deg, #ef4444, #dc2626); }
    .expiry-indicator.warning { background: linear-gradient(180deg, #f59e0b, #d97706); }
    .expiry-info { flex: 1; display: flex; flex-direction: column; }
    .expiry-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .expiry-meta { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }
    .expiry-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .expiry-arrow { color: var(--text-tertiary); opacity: 0; transform: translateX(-4px); transition: all 200ms ease; }
    .empty-state { display: flex; align-items: center; gap: 8px; padding: 24px 0; color: var(--text-tertiary); font-size: 14px; }
    .empty-state mat-icon { color: #10b981; }

    /* Activity */
    .activity-row {
      display: flex; align-items: center; gap: 14px; padding: 14px 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .activity-row:last-child { border-bottom: none; }
    .activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .activity-dot.green { background: #10b981; }
    .activity-dot.blue { background: #3b82f6; }
    .activity-dot.red { background: #ef4444; }
    .activity-dot.purple { background: #8b5cf6; }
    .activity-content { flex: 1; font-size: 14px; color: var(--text-secondary); }
    .activity-content strong { color: var(--text-primary); }
    .activity-content a { color: var(--brand-primary); text-decoration: none; font-weight: 500; }
    .activity-content a:hover { text-decoration: underline; }
    .activity-time { font-size: 12px; color: var(--text-tertiary); white-space: nowrap; }
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
    { label: 'Contratos Ativos', value: this.kpis().activeContracts, icon: 'folder_open', gradient: 'linear-gradient(135deg, #10b981, #059669)', trend: 3, trendSuffix: ' mês', prefix: null, suffix: null, sparkBg: 'linear-gradient(90deg, transparent, #10b981)' },
    { label: 'Pendentes Aprovação', value: this.kpis().pendingApproval, icon: 'pending_actions', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', trend: -2, trendSuffix: ' sem.', prefix: null, suffix: null, sparkBg: 'linear-gradient(90deg, transparent, #f59e0b)' },
    { label: 'Expiram em 30 dias', value: this.kpis().expiringIn30Days, icon: 'schedule', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', trend: null, trendSuffix: '', prefix: null, suffix: null, sparkBg: 'linear-gradient(90deg, transparent, #ef4444)' },
    { label: 'Valor Total', value: this.kpis().totalValue / 1000, icon: 'payments', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', trend: 180, trendSuffix: 'k', prefix: '€', suffix: 'k', sparkBg: 'linear-gradient(90deg, transparent, #6366f1)' }
  ]);

  getStatusLabel(s: any) { return (CONTRACT_STATUS_LABELS as any)[s] ?? s; }
  getTypeLabel(t: any) { return (CONTRACT_TYPE_LABELS as any)[t] ?? t; }
  daysLeft(d: Date) { return Math.round((new Date(d).getTime() - Date.now()) / 86400000); }

  getBarGradient(status: string): string {
    const map: Record<string, string> = {
      active: 'linear-gradient(90deg, #10b981, #34d399)',
      pending_approval: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      pending_signature: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      draft: 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
      signed: 'linear-gradient(90deg, #10b981, #34d399)',
      expired: 'linear-gradient(90deg, #ef4444, #f87171)',
      rejected: 'linear-gradient(90deg, #ef4444, #f87171)'
    };
    return map[status] ?? 'linear-gradient(90deg, #94a3b8, #cbd5e1)';
  }

  getActivityColor(action: string): string {
    if (action.includes('cri')) return 'blue';
    if (action.includes('aprov')) return 'green';
    if (action.includes('assinou')) return 'purple';
    if (action.includes('rejeit')) return 'red';
    return 'blue';
  }
}
