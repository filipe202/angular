import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

type FlowStatusFilter = 'Todos' | 'Pendentes' | 'Terminados' | 'Suspensos';
type QuickFilter = 'Os meus pendentes' | 'Urgentes' | 'Vencidos' | 'Esta semana' | 'Aprovações' | 'Pareceres';
type StageStatus = 'completed' | 'current' | 'pending';

interface FlowStage {
  name: string;
  status: StageStatus;
  user?: string;
}

interface Flow {
  id: string;
  title: string;
  reference: string;
  status: 'Pendente' | 'Terminado' | 'Suspenso' | 'Indeferido';
  type: string;
  date: string;
  folder: string;
  stages: FlowStage[];
  actions: string[];
  urgent?: boolean;
  dueDate?: string;
  assignee?: string;
}

@Component({
  selector: 'app-flows',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Page Header -->
    <div class="page-container">
      <div class="page-header animate-in">
        <div class="header-left">
          <h1 class="page-title">Fluxos</h1>
          <span class="flow-count">{{ filteredFlows().length }} fluxos</span>
        </div>
        <button class="btn-new-flow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Fluxo
        </button>
      </div>

      <!-- Filter Chips -->
      <div class="filter-chips animate-in animate-delay-1">
        @for (filter of statusFilters; track filter) {
          <button
            class="chip"
            [class.chip-active]="activeFilter() === filter"
            (click)="activeFilter.set(filter)">
            {{ filter }}
            @if (getFilterCount(filter) > 0) {
              <span class="chip-count">{{ getFilterCount(filter) }}</span>
            }
          </button>
        }
      </div>

      <!-- Quick Filters Bar -->
      <div class="quick-filters animate-in animate-delay-1">
        @for (qf of quickFilters; track qf) {
          <button
            class="quick-filter"
            [class.quick-filter-active]="activeQuickFilter() === qf"
            (click)="toggleQuickFilter(qf)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              @switch (qf) {
                @case ('Os meus pendentes') { <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/> }
                @case ('Urgentes') { <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/> }
                @case ('Vencidos') { <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/> }
                @case ('Esta semana') { <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/> }
                @case ('Aprovações') { <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/> }
                @case ('Pareceres') { <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/> }
              }
            </svg>
            {{ qf }}
          </button>
        }
      </div>

      <!-- Flow List -->
      <div class="flow-list">
        @for (flow of filteredFlows(); track flow.id; let i = $index) {
          <div class="flow-card animate-in" [style.animation-delay]="(i * 60) + 'ms'">
            <!-- Status Bar -->
            <div class="flow-status-bar"
              [class.status-bar-pending]="flow.status === 'Pendente'"
              [class.status-bar-completed]="flow.status === 'Terminado'"
              [class.status-bar-suspended]="flow.status === 'Suspenso' || flow.status === 'Indeferido'">
            </div>

            <!-- Flow Header -->
            <div class="flow-header">
              <div class="flow-header-left">
                <h3 class="flow-title">{{ flow.title }}</h3>
                <span class="flow-badge"
                  [class.badge-pending]="flow.status === 'Pendente'"
                  [class.badge-completed]="flow.status === 'Terminado'"
                  [class.badge-suspended]="flow.status === 'Suspenso' || flow.status === 'Indeferido'">
                  {{ flow.status }}
                </span>
              </div>
              <span class="flow-reference">{{ flow.reference }}</span>
            </div>

            <!-- Meta Info -->
            <div class="flow-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {{ flow.type }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ flow.date }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                </svg>
                {{ flow.folder }}
              </span>
            </div>

            <!-- Timeline -->
            <div class="flow-timeline">
              @for (stage of flow.stages; track stage.name; let j = $index; let last = $last) {
                <div class="timeline-step" [class]="stage.status">
                  <div class="timeline-dot"></div>
                  <span class="timeline-label">{{ stage.name }}</span>
                  @if (stage.user) {
                    <span class="timeline-user">{{ getShortName(stage.user) }}</span>
                  }
                </div>
                @if (!last) {
                  <div class="timeline-connector"
                    [class.completed]="stage.status === 'completed'"
                    [class.active]="stage.status === 'completed' && flow.stages[j + 1].status === 'current'">
                  </div>
                }
              }
            </div>

            <!-- Actions -->
            <div class="flow-actions">
              @for (action of flow.actions; track action) {
                <button
                  [class.btn-approve]="action === 'Aprovar'"
                  [class.btn-reject]="action === 'Rejeitar'"
                  [class.btn-send]="action === 'Enviar'"
                  [class.btn-view]="action === 'Ver' || action === 'Detalhes'"
                  class="flow-action-btn">
                  @switch (action) {
                    @case ('Aprovar') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
                    }
                    @case ('Rejeitar') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    }
                    @case ('Enviar') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    }
                    @default {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  }
                  {{ action }}
                </button>
              }
            </div>
          </div>
        }

        @if (filteredFlows().length === 0) {
          <div class="empty-state animate-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
              <circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="14"/><circle cx="12" cy="19" r="3"/><path d="M12 14l-6 2m6-2l6 2"/>
            </svg>
            <h3>Sem fluxos</h3>
            <p>Nenhum fluxo encontrado para o filtro selecionado.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* ── Page Layout ──────────────────────────────────────────── */
    .page-container {
      padding: 24px 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .header-left {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--teal-600), var(--teal-400));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .flow-count {
      font-size: 14px;
      color: var(--gray-400);
      font-weight: 500;
    }

    .btn-new-flow {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, var(--teal-500), var(--teal-400));
      color: white;
      border: none;
      border-radius: var(--radius-pill);
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all var(--t-normal);
      box-shadow: 0 4px 15px rgba(10, 186, 181, 0.3);
    }

    .btn-new-flow:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(10, 186, 181, 0.4);
    }

    /* ── Filter Chips ─────────────────────────────────────────── */
    .filter-chips {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-pill);
      border: 1.5px solid var(--glass-border);
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      color: var(--gray-600);
      cursor: pointer;
      transition: all var(--t-normal);
    }

    .chip:hover {
      border-color: rgba(10, 186, 181, 0.3);
      color: var(--teal-600);
    }

    .chip-active {
      background: linear-gradient(135deg, var(--teal-500), var(--teal-400));
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(10, 186, 181, 0.25);
    }

    .chip-active:hover {
      color: white;
    }

    .chip-count {
      background: rgba(255, 255, 255, 0.25);
      padding: 1px 7px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
    }

    .chip:not(.chip-active) .chip-count {
      background: var(--gray-100);
      color: var(--gray-500);
    }

    /* ── Quick Filters ────────────────────────────────────────── */
    .quick-filters {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .quick-filter {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      border: 1px solid var(--gray-200);
      background: white;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      color: var(--gray-500);
      cursor: pointer;
      transition: all var(--t-fast);
    }

    .quick-filter:hover {
      border-color: var(--teal-300);
      color: var(--teal-600);
      background: var(--teal-50);
    }

    .quick-filter-active {
      border-color: var(--teal-400);
      color: var(--teal-600);
      background: var(--teal-50);
    }

    /* ── Flow List ────────────────────────────────────────────── */
    .flow-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* ── Flow Card ────────────────────────────────────────────── */
    .flow-card {
      position: relative;
      overflow: hidden;
      padding: 24px;
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--glass-shadow);
      transition: all var(--t-normal);
    }

    .flow-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    /* ── Status Bar ───────────────────────────────────────────── */
    .flow-status-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .status-bar-pending {
      background: linear-gradient(90deg, var(--teal-500), var(--teal-300));
    }

    .status-bar-completed {
      background: linear-gradient(90deg, #10B981, #34D399);
    }

    .status-bar-suspended {
      background: linear-gradient(90deg, var(--orange-500), var(--orange-300));
    }

    /* ── Flow Header ──────────────────────────────────────────── */
    .flow-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .flow-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .flow-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--gray-800);
      margin: 0;
    }

    .flow-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-pending {
      background: linear-gradient(135deg, var(--teal-50), var(--teal-100));
      color: var(--teal-600);
    }

    .badge-completed {
      background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
      color: #059669;
    }

    .badge-suspended {
      background: linear-gradient(135deg, var(--orange-50), var(--orange-100));
      color: var(--orange-600);
    }

    .flow-reference {
      font-size: 12px;
      font-weight: 600;
      color: var(--gray-400);
      white-space: nowrap;
    }

    /* ── Meta Info ────────────────────────────────────────────── */
    .flow-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 13px;
      color: var(--gray-500);
    }

    .meta-item svg {
      color: var(--gray-400);
      flex-shrink: 0;
    }

    /* ── Timeline ─────────────────────────────────────────────── */
    .flow-timeline {
      display: flex;
      align-items: flex-start;
      overflow-x: auto;
      padding: 12px 0;
      margin-bottom: 16px;
      scrollbar-width: thin;
      scrollbar-color: var(--gray-200) transparent;
    }

    .flow-timeline::-webkit-scrollbar {
      height: 4px;
    }

    .flow-timeline::-webkit-scrollbar-thumb {
      background: var(--gray-200);
      border-radius: 4px;
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 85px;
      flex-shrink: 0;
    }

    .timeline-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--gray-200);
      margin-bottom: 6px;
      transition: all var(--t-normal);
    }

    .timeline-step.completed .timeline-dot {
      background: linear-gradient(135deg, #10B981, #34D399);
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.35);
    }

    .timeline-step.current .timeline-dot {
      background: linear-gradient(135deg, var(--teal-500), var(--teal-300));
      box-shadow: 0 0 12px rgba(10, 186, 181, 0.4);
      animation: pulse-dot 2s ease-in-out infinite;
    }

    .timeline-step.pending .timeline-dot {
      background: var(--gray-200);
    }

    @keyframes pulse-dot {
      0%, 100% { box-shadow: 0 0 12px rgba(10, 186, 181, 0.4); }
      50% { box-shadow: 0 0 20px rgba(10, 186, 181, 0.6); }
    }

    .timeline-connector {
      flex: 1;
      height: 3px;
      min-width: 24px;
      border-radius: 3px;
      background: var(--gray-200);
      margin-top: 7.5px;
      align-self: flex-start;
    }

    .timeline-connector.completed {
      background: linear-gradient(90deg, #10B981, #34D399);
    }

    .timeline-connector.active {
      background: linear-gradient(90deg, #10B981, var(--teal-400));
    }

    .timeline-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--gray-700);
      text-align: center;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .timeline-step.pending .timeline-label {
      color: var(--gray-400);
      font-weight: 500;
    }

    .timeline-user {
      font-size: 11px;
      color: var(--gray-400);
      text-align: center;
      margin-top: 2px;
    }

    /* ── Actions ──────────────────────────────────────────────── */
    .flow-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      padding-top: 12px;
      border-top: 1px solid var(--gray-100);
    }

    .flow-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: var(--radius-pill);
      border: none;
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all var(--t-fast);
    }

    .btn-approve {
      background: linear-gradient(135deg, #10B981, #34D399);
      color: white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
    }

    .btn-approve:hover {
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      transform: translateY(-1px);
    }

    .btn-reject {
      background: rgba(239, 68, 68, 0.08);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.15);
    }

    .btn-reject:hover {
      background: rgba(239, 68, 68, 0.14);
    }

    .btn-send {
      background: linear-gradient(135deg, var(--teal-500), var(--teal-400));
      color: white;
      box-shadow: 0 2px 8px rgba(10, 186, 181, 0.25);
    }

    .btn-send:hover {
      box-shadow: 0 4px 14px rgba(10, 186, 181, 0.35);
      transform: translateY(-1px);
    }

    .btn-view {
      background: rgba(100, 116, 139, 0.08);
      color: var(--gray-600);
      border: 1px solid rgba(100, 116, 139, 0.12);
    }

    .btn-view:hover {
      background: rgba(100, 116, 139, 0.14);
    }

    /* ── Empty State ──────────────────────────────────────────── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 24px;
      color: var(--gray-400);
      text-align: center;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 700;
      color: var(--gray-500);
      margin: 0 0 6px;
    }

    .empty-state p {
      font-size: 14px;
      margin: 0;
    }

    /* ── Animations ───────────────────────────────────────────── */
    .animate-in {
      animation: slideIn 0.4s var(--ease-out) both;
    }

    .animate-delay-1 {
      animation-delay: 60ms;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class FlowsComponent {
  private store = inject(EdoclinkStoreService);

  readonly statusFilters: FlowStatusFilter[] = ['Todos', 'Pendentes', 'Terminados', 'Suspensos'];
  readonly quickFilters: QuickFilter[] = [
    'Os meus pendentes', 'Urgentes', 'Vencidos', 'Esta semana', 'Aprovações', 'Pareceres'
  ];

  activeFilter = signal<FlowStatusFilter>('Pendentes');
  activeQuickFilter = signal<QuickFilter | null>(null);

  /** Map store flows into local view model */
  flows = computed<Flow[]>(() => {
    return this.store.flows.map(f => {
      const stages: FlowStage[] = f.stages.map(s => ({
        name: s.name,
        status: s.status === 'completed' ? 'completed' : s.status === 'current' ? 'current' : 'pending',
        user: s.userId ? this.store.getUser(s.userId).name : undefined,
      }));
      const isUrgent = this.store.daysUntilDeadline(f.deadline) <= 2;

      return {
        id: f.id.toString(),
        title: f.title,
        reference: f.ref,
        status: f.status,
        type: f.type,
        date: new Date(f.date).toLocaleDateString('pt-PT'),
        folder: f.folderId ? (this.store.getFolder(f.folderId)?.name ?? '') : '',
        stages,
        actions: this.getActionsForStatus(f.status as Flow['status']),
        urgent: isUrgent,
        dueDate: f.deadline,
        assignee: '',
      } as Flow;
    });
  });

  filteredFlows = computed<Flow[]>(() => {
    const all = this.flows();
    const filter = this.activeFilter();

    let result: Flow[];
    switch (filter) {
      case 'Pendentes':
        result = all.filter(f => f.status === 'Pendente');
        break;
      case 'Terminados':
        result = all.filter(f => f.status === 'Terminado');
        break;
      case 'Suspensos':
        result = all.filter(f => f.status === 'Suspenso' || f.status === 'Indeferido');
        break;
      default:
        result = all;
    }

    const qf = this.activeQuickFilter();
    if (qf) {
      switch (qf) {
        case 'Urgentes':
          result = result.filter(f => f.urgent);
          break;
        case 'Vencidos':
          result = result.filter(f => f.dueDate && new Date(f.dueDate) < new Date());
          break;
        case 'Aprovações':
          result = result.filter(f => f.actions.includes('Aprovar'));
          break;
        case 'Pareceres':
          result = result.filter(f => f.type.toLowerCase().includes('parecer'));
          break;
      }
    }

    return result;
  });

  getFilterCount(filter: FlowStatusFilter): number {
    const all = this.flows();
    switch (filter) {
      case 'Pendentes': return all.filter(f => f.status === 'Pendente').length;
      case 'Terminados': return all.filter(f => f.status === 'Terminado').length;
      case 'Suspensos': return all.filter(f => f.status === 'Suspenso' || f.status === 'Indeferido').length;
      default: return all.length;
    }
  }

  toggleQuickFilter(qf: QuickFilter): void {
    this.activeQuickFilter.set(this.activeQuickFilter() === qf ? null : qf);
  }

  getShortName(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) return fullName;
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  }

  private mapStatus(status: string | undefined): Flow['status'] {
    switch (status) {
      case 'Pending': case 'Edition': return 'Pendente';
      case 'Dispatched': return 'Terminado';
      case 'Suspended': return 'Suspenso';
      case 'Canceled': return 'Indeferido';
      default: return 'Pendente';
    }
  }

  private mapStageStatus(status: string | undefined): StageStatus {
    switch (status) {
      case 'Dispatched': case 'Redirected': return 'completed';
      case 'Pending': return 'current';
      case 'Future': return 'pending';
      case 'Canceled': case 'ReturnedBack': case 'Suspended': return 'completed';
      default: return 'pending';
    }
  }

  private getActionsForStatus(status: Flow['status']): string[] {
    switch (status) {
      case 'Pendente': return ['Aprovar', 'Rejeitar', 'Enviar'];
      case 'Terminado': return ['Detalhes'];
      case 'Suspenso': return ['Ver', 'Enviar'];
      case 'Indeferido': return ['Ver'];
      default: return ['Ver'];
    }
  }
}
