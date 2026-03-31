import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

@Component({
  selector: 'app-edoc-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Page Header -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard</h1>
      <div class="period-selector">
        @for (period of periods; track period.value) {
          <button
            class="period-btn"
            [class.active]="selectedPeriod === period.value"
            (click)="selectedPeriod = period.value">
            {{ period.label }}
          </button>
        }
      </div>
    </div>

    <!-- Counter Widgets Row -->
    <div class="dashboard-grid">
      <div class="widget-counter" style="border-top: 4px solid #0d9488">
        <div class="widget-counter-number" style="color: #0d9488">{{ totalFlows() }}</div>
        <div class="widget-counter-label">Total de Fluxos</div>
      </div>
      <div class="widget-counter" style="border-top: 4px solid #e67e22">
        <div class="widget-counter-number" style="color: #e67e22">{{ pendingFlows() }}</div>
        <div class="widget-counter-label">Pendentes</div>
      </div>
      <div class="widget-counter" style="border-top: 4px solid #059669">
        <div class="widget-counter-number" style="color: #059669">{{ completedFlows() }}</div>
        <div class="widget-counter-label">Terminados</div>
      </div>
      <div class="widget-counter" style="border-top: 4px solid #7c5cfc">
        <div class="widget-counter-number" style="color: #7c5cfc">{{ suspendedFlows() }}</div>
        <div class="widget-counter-label">Suspensos</div>
      </div>

      <!-- Donut Chart Widget -->
      <div class="widget widget-large">
        <div class="widget-header">
          <div class="widget-title">Distribuição por Tipo de Fluxo</div>
        </div>
        <div class="widget-body">
          <div class="donut-wrapper">
            <div class="donut-chart" [style.background]="donutGradient()">
              <div class="donut-center">
                <span class="donut-total">{{ totalFlows() }}</span>
                <span class="donut-total-label">Total</span>
              </div>
            </div>
            <div class="chart-legend">
              @for (item of typeDistribution(); track item.type) {
                <div class="legend-item">
                  <span class="legend-dot" [style.background]="item.color"></span>
                  <span class="legend-label">{{ item.type }}</span>
                  <span class="legend-value">{{ item.count }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Bar Chart Widget -->
      <div class="widget widget-large">
        <div class="widget-header">
          <div class="widget-title">Atividade Mensal</div>
        </div>
        <div class="widget-body">
          <div class="bar-chart">
            @for (bar of monthlyBars; track bar.label) {
              <div class="bar-col">
                <span class="bar-value">{{ bar.value }}</span>
                <div class="bar" [style.height.px]="bar.value * 14"></div>
                <span class="bar-label">{{ bar.label }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Deadline Widget -->
      <div class="widget widget-large">
        <div class="widget-header">
          <div class="widget-title">Prazos Próximos</div>
        </div>
        <div class="widget-body widget-body-list">
          @for (flow of deadlineFlows(); track flow.id) {
            <div class="widget-list-item">
              <span
                class="deadline-dot"
                [class.urgent]="isUrgent(flow)"
                [class.warning]="isWarning(flow)"
                [class.normal]="!isUrgent(flow) && !isWarning(flow)">
              </span>
              <div class="deadline-info">
                <span class="deadline-subject">{{ flow.title }}</span>
                <span class="deadline-type">{{ flow.type }}</span>
              </div>
              <span class="deadline-date">{{ formatDate(flow.deadline) }}</span>
            </div>
          }
          @if (deadlineFlows().length === 0) {
            <div class="empty-state">Sem prazos próximos</div>
          }
        </div>
      </div>

      <!-- Recent Activity Widget -->
      <div class="widget widget-large">
        <div class="widget-header">
          <div class="widget-title">Atividade Recente</div>
        </div>
        <div class="widget-body widget-body-list">
          @for (flow of recentFlows(); track flow.id) {
            <div class="widget-list-item">
              <span class="activity-dot"></span>
              <div class="deadline-info">
                <span class="deadline-subject">{{ flow.title }}</span>
                <span class="deadline-type">{{ flow.type }} · {{ flow.status }}</span>
              </div>
              <span class="deadline-date">{{ formatDate(flow.date) }}</span>
            </div>
          }
          @if (recentFlows().length === 0) {
            <div class="empty-state">Sem atividade recente</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .dashboard-title {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary, #1a1a2e);
      letter-spacing: -0.03em;
    }

    .period-selector {
      display: flex;
      gap: 4px;
      background: var(--surface-muted, #f1f5f9);
      border-radius: 8px;
      padding: 3px;
    }

    .period-btn {
      border: none;
      background: transparent;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-tertiary, #94a3b8);
      border-radius: 6px;
      cursor: pointer;
      transition: all 200ms;
    }

    .period-btn.active {
      background: var(--surface-card, #fff);
      color: var(--text-primary, #1a1a2e);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .period-btn:hover:not(.active) {
      color: var(--text-secondary, #64748b);
    }

    /* ── Grid ── */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    /* ── Widget base ── */
    .widget {
      background: var(--surface-card, #fff);
      border-radius: var(--radius-lg, 12px);
      border: 1px solid var(--border-subtle, #e2e8f0);
      overflow: hidden;
      transition: box-shadow 200ms, transform 200ms;
    }

    .widget:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .widget-large {
      grid-column: span 2;
    }

    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 22px 0;
    }

    .widget-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary, #1a1a2e);
    }

    .widget-body {
      padding: 18px 22px 22px;
    }

    .widget-body-list {
      padding: 8px 22px 22px;
    }

    /* ── Counter Widgets ── */
    .widget-counter {
      padding: 22px;
      background: var(--surface-card, #fff);
      border-radius: var(--radius-lg, 12px);
      border: 1px solid var(--border-subtle, #e2e8f0);
      overflow: hidden;
      transition: box-shadow 200ms, transform 200ms;
    }

    .widget-counter:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      transform: translateY(-2px);
    }

    .widget-counter-number {
      font-size: 36px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .widget-counter-label {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-tertiary, #64748b);
      margin-top: 6px;
    }

    /* ── Donut Chart ── */
    .donut-wrapper {
      display: flex;
      align-items: center;
      gap: 32px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .donut-chart {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .donut-center {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--surface-card, #fff);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .donut-total {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary, #1a1a2e);
      line-height: 1;
    }

    .donut-total-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary, #94a3b8);
      margin-top: 2px;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-secondary, #475569);
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-label {
      flex: 1;
      font-weight: 500;
    }

    .legend-value {
      font-weight: 700;
      color: var(--text-primary, #1a1a2e);
      min-width: 20px;
      text-align: right;
    }

    /* ── Bar Chart ── */
    .bar-chart {
      display: flex;
      align-items: flex-end;
      height: 200px;
      gap: 16px;
      justify-content: space-around;
    }

    .bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .bar {
      width: 36px;
      border-radius: 6px 6px 0 0;
      background: linear-gradient(180deg, #0d9488, #14b8a6);
      transition: height 0.6s ease-out;
      min-height: 4px;
    }

    .bar-value {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-primary, #1a1a2e);
    }

    .bar-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary, #94a3b8);
    }

    /* ── Deadline / Activity List ── */
    .widget-list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-subtle, #e2e8f0);
    }

    .widget-list-item:last-child {
      border-bottom: none;
    }

    .deadline-dot,
    .activity-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .deadline-dot.urgent { background: #e85d4a; }
    .deadline-dot.warning { background: #e67e22; }
    .deadline-dot.normal { background: #0d9488; }
    .activity-dot { background: #0d9488; }

    .deadline-info {
      flex: 1;
      min-width: 0;
    }

    .deadline-subject {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary, #1a1a2e);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .deadline-type {
      display: block;
      font-size: 11px;
      color: var(--text-tertiary, #94a3b8);
      margin-top: 2px;
    }

    .deadline-date {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary, #64748b);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .empty-state {
      padding: 20px 0;
      font-size: 13px;
      color: var(--text-tertiary, #94a3b8);
      text-align: center;
    }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .widget-large {
        grid-column: span 2;
      }
    }

    @media (max-width: 560px) {
      .dashboard-grid {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .widget-large {
        grid-column: span 2;
      }
      .widget-counter-number {
        font-size: 28px;
      }
    }
  `]
})
export class EdocDashboardComponent {
  private store = inject(EdoclinkStoreService);

  // Period selector
  periods = [
    { label: 'Este mês', value: 'month' },
    { label: 'Esta semana', value: 'week' },
    { label: 'Este trimestre', value: 'quarter' },
  ];
  selectedPeriod = 'month';

  // Monthly bar chart data (Oct - Mar)
  monthlyBars = [
    { label: 'Out', value: 5 },
    { label: 'Nov', value: 8 },
    { label: 'Dez', value: 12 },
    { label: 'Jan', value: 7 },
    { label: 'Fev', value: 10 },
    { label: 'Mar', value: 13 },
  ];

  // Type colors for donut chart
  private typeColors: Record<string, string> = {
    'Aprovação': '#0d9488',
    'Parecer': '#e67e22',
    'Distribuição': '#3b82f6',
    'Assinatura': '#7c5cfc',
    'Difusão': '#059669',
  };

  totalFlows = computed(() => this.store.flows.length);
  pendingFlows = computed(() => this.store.flows.filter(f => f.status === 'Pendente').length);
  completedFlows = computed(() => this.store.flows.filter(f => f.status === 'Terminado').length);
  suspendedFlows = computed(() => this.store.flows.filter(f => f.status === 'Suspenso' || f.status === 'Indeferido').length);

  typeDistribution = computed(() => {
    const flows = this.store.flows;
    const types = ['Aprovação', 'Parecer', 'Distribuição', 'Assinatura', 'Difusão'];
    return types.map(type => ({
      type,
      count: flows.filter(f => f.type === type).length,
      color: this.typeColors[type] || '#94a3b8',
    }));
  });

  donutGradient = computed(() => {
    const dist = this.typeDistribution();
    const total = this.totalFlows() || 1;
    let cumulative = 0;
    const stops: string[] = [];
    for (const item of dist) {
      const pct = (item.count / total) * 100;
      stops.push(`${item.color} ${cumulative}% ${cumulative + pct}%`);
      cumulative += pct;
    }
    if (cumulative < 100) stops.push(`#e2e8f0 ${cumulative}% 100%`);
    return `conic-gradient(${stops.join(', ')})`;
  });

  deadlineFlows = computed(() => {
    return this.store.flows
      .filter(f => f.deadline !== null)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 8);
  });

  recentFlows = computed(() => {
    return [...this.store.flows]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  });

  isUrgent(flow: any): boolean {
    if (!flow.deadline) return false;
    return this.store.daysUntilDeadline(flow.deadline) <= 3;
  }

  isWarning(flow: any): boolean {
    if (!flow.deadline) return false;
    const days = this.store.daysUntilDeadline(flow.deadline);
    return days > 3 && days <= 7;
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }
}
