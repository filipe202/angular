import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ContractService } from '../../../core/services/contract.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterLink, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatListModule, MatChipsModule, StatusBadgeComponent, RelativeDatePipe, CurrencyPtPipe],
  template: `
    <div class="dashboard">
      <h2>Bom dia, Maria</h2>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        @for (kpi of kpiCards(); track kpi.label) {
          <mat-card class="kpi-card">
            <div class="kpi-icon" [style.background]="kpi.color + '20'" [style.color]="kpi.color">
              <mat-icon>{{ kpi.icon }}</mat-icon>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">{{ kpi.prefix ?? '' }}{{ kpi.value }}{{ kpi.suffix ?? '' }}</span>
              <span class="kpi-label">{{ kpi.label }}</span>
              @if (kpi.trend) {
                <span class="kpi-trend" [class.positive]="kpi.trend > 0" [class.negative]="kpi.trend < 0">
                  {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}{{ kpi.trendSuffix ?? '' }}
                </span>
              }
            </div>
          </mat-card>
        }
      </div>

      <div class="charts-row">
        <!-- Contracts by Status -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Contratos por Estado</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @for (item of kpis().contractsByStatus; track item.status) {
              <div class="bar-item">
                <span class="bar-label">{{ getStatusLabel(item.status) }}</span>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="(item.count / maxStatusCount()) * 100" [style.background]="getStatusColor(item.status)"></div>
                </div>
                <span class="bar-count">{{ item.count }}</span>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <!-- Contracts by Type -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Contratos por Tipo</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @for (item of kpis().contractsByType; track item.type) {
              <div class="bar-item">
                <span class="bar-label">{{ getTypeLabel(item.type) }}</span>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="(item.count / maxTypeCount()) * 100" style="background: #3949ab"></div>
                </div>
                <span class="bar-count">{{ item.count }}</span>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <div class="charts-row">
        <!-- Monthly Trend -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Tendência Mensal</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="trend-chart">
              @for (m of kpis().monthlyTrend; track m.month) {
                <div class="trend-col">
                  <div class="trend-bars">
                    <div class="trend-bar created" [style.height.px]="m.created * 6" title="Criados: {{ m.created }}"></div>
                    <div class="trend-bar signed" [style.height.px]="m.signed * 6" title="Assinados: {{ m.signed }}"></div>
                  </div>
                  <span class="trend-label">{{ m.month }}</span>
                </div>
              }
            </div>
            <div class="trend-legend">
              <span class="legend-item"><span class="dot created"></span> Criados</span>
              <span class="legend-item"><span class="dot signed"></span> Assinados</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Expiring Soon -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>A Expirar em Breve</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @for (contract of expiringContracts(); track contract.id) {
              <div class="expiring-item" [routerLink]="'/manager/contracts/' + contract.id">
                <mat-icon [class.urgent]="daysUntilExpiry(contract.endDate) <= 7">warning</mat-icon>
                <div class="expiring-info">
                  <span class="expiring-title">{{ contract.title }}</span>
                  <span class="expiring-date">Expira {{ contract.endDate | relativeDate }}</span>
                </div>
                <span class="expiring-value">{{ contract.value | currencyPt }}</span>
              </div>
            }
            @if (expiringContracts().length === 0) {
              <p class="no-items">Nenhum contrato a expirar nos próximos 30 dias.</p>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Activity -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Atividade Recente</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (activity of kpis().recentActivity; track activity.id) {
            <div class="activity-item">
              <mat-icon class="activity-icon">{{ activity.icon }}</mat-icon>
              <div class="activity-info">
                <span><strong>{{ activity.user }}</strong> {{ activity.action }} <a [routerLink]="'/manager/contracts/' + activity.contractId">"{{ activity.contractTitle }}"</a></span>
              </div>
              <span class="activity-time">{{ activity.timestamp | relativeDate }}</span>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; }
    h2 { margin: 0 0 24px; font-weight: 400; color: #333; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .kpi-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }

    .kpi-icon mat-icon { font-size: 24px; }

    .kpi-info { display: flex; flex-direction: column; }
    .kpi-value { font-size: 24px; font-weight: 600; color: #333; }
    .kpi-label { font-size: 13px; color: #888; margin-top: 2px; }
    .kpi-trend { font-size: 12px; margin-top: 4px; }
    .kpi-trend.positive { color: #4CAF50; }
    .kpi-trend.negative { color: #F44336; }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .chart-card { padding: 8px; }
    .chart-card mat-card-content { padding: 0 16px 16px; }

    .bar-item {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 10px;
    }
    .bar-label { width: 140px; font-size: 13px; color: #555; }
    .bar-track { flex: 1; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 10px; transition: width 0.3s ease; }
    .bar-count { width: 30px; text-align: right; font-size: 13px; font-weight: 500; }

    .trend-chart {
      display: flex; justify-content: space-around; align-items: flex-end;
      height: 120px; padding: 16px 0;
    }
    .trend-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .trend-bars { display: flex; align-items: flex-end; gap: 4px; }
    .trend-bar { width: 20px; border-radius: 4px 4px 0 0; min-height: 4px; }
    .trend-bar.created { background: #3949ab; }
    .trend-bar.signed { background: #66bb6a; }
    .trend-label { font-size: 11px; color: #888; }
    .trend-legend { display: flex; gap: 16px; justify-content: center; padding-top: 8px; }
    .legend-item { font-size: 12px; color: #666; display: flex; align-items: center; gap: 4px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .dot.created { background: #3949ab; }
    .dot.signed { background: #66bb6a; }

    .expiring-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
    }
    .expiring-item:hover { background: #fafafa; }
    .expiring-item mat-icon { color: #FF9800; }
    .expiring-item mat-icon.urgent { color: #F44336; }
    .expiring-info { flex: 1; display: flex; flex-direction: column; }
    .expiring-title { font-size: 14px; font-weight: 500; }
    .expiring-date { font-size: 12px; color: #888; }
    .expiring-value { font-size: 13px; font-weight: 500; color: #333; }

    .activity-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .activity-icon { color: #666; font-size: 20px; }
    .activity-info { flex: 1; font-size: 14px; }
    .activity-info a { color: #1a237e; text-decoration: none; }
    .activity-info a:hover { text-decoration: underline; }
    .activity-time { font-size: 12px; color: #999; white-space: nowrap; }
    .no-items { color: #999; font-size: 14px; text-align: center; padding: 24px; }
  `]
})
export class ManagerDashboardComponent {
  kpis;
  expiringContracts;

  constructor(private dashboardService: DashboardService, private contractService: ContractService) {
    this.kpis = dashboardService.dashboardKPIs;
    this.expiringContracts = contractService.getExpiringContracts(30);
  }

  maxStatusCount = computed(() => Math.max(...this.kpis().contractsByStatus.map(s => s.count)));
  maxTypeCount = computed(() => Math.max(...this.kpis().contractsByType.map(t => t.count)));

  kpiCards = computed(() => [
    { label: 'Contratos Ativos', value: this.kpis().activeContracts, icon: 'folder_open', color: '#4CAF50', trend: 3, trendSuffix: ' este mês' },
    { label: 'Pendentes Aprovação', value: this.kpis().pendingApproval, icon: 'pending_actions', color: '#FF9800', trend: -2, trendSuffix: ' vs semana ant.' },
    { label: 'Expiram em 30 dias', value: this.kpis().expiringIn30Days, icon: 'schedule', color: '#F44336', trend: null, trendSuffix: '' },
    { label: 'Valor Total', value: this.kpis().totalValue / 1000, prefix: '€', suffix: 'k', icon: 'payments', color: '#2196F3', trend: 180, trendSuffix: 'k este mês' }
  ]);

  getStatusLabel(status: any) { return (CONTRACT_STATUS_LABELS as any)[status] ?? status; }
  getStatusColor(status: any) {
    const colors: any = { active: '#4CAF50', pending_approval: '#FF9800', pending_signature: '#FF9800', draft: '#9E9E9E', signed: '#4CAF50', expired: '#F44336', rejected: '#F44336' };
    return colors[status] ?? '#9E9E9E';
  }
  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }
  daysUntilExpiry(date: Date) { return Math.round((new Date(date).getTime() - Date.now()) / 86400000); }
}
