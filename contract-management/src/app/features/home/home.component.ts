import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

interface TaskItem {
  id: string;
  title: string;
  reference: string;
  folder: string;
  deadline: Date;
  priority: 'urgent' | 'medium' | 'normal';
  type: 'Aprovacao' | 'Parecer' | 'Assinatura' | 'Revisao';
  assignedBy: string;
  stage?: string;
}

interface ActivityEntry {
  id: string;
  user: string;
  initials: string;
  avatarGradient: string;
  action: string;
  target: string;
  timestamp: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <!-- Hero Section -->
      <section class="page-hero">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-greeting">{{ greeting() }}, <span class="hero-name">{{ firstName() }}</span></h1>
            <p class="hero-subtitle">
              @if (pendingCount() > 0) {
                Tens <strong>{{ pendingCount() }}</strong> {{ pendingCount() === 1 ? 'tarefa pendente' : 'tarefas pendentes' }} para hoje.
              } @else {
                Sem tarefas pendentes de momento. Bom trabalho!
              }
            </p>
          </div>
          <div class="hero-date">
            {{ currentDateFormatted() }}
          </div>
        </div>
        <div class="hero-glow"></div>
      </section>

      <!-- Stats Row -->
      <section class="stats-row">
        <div class="stat-card stat-pending">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-value pending-gradient">{{ pendingCount() }}</div>
          <div class="stat-label">Pendentes</div>
        </div>
        <div class="stat-card stat-urgent">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="stat-value urgent-gradient">{{ urgentCount() }}</div>
          <div class="stat-label">Urgentes</div>
        </div>
        <div class="stat-card stat-sent">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </div>
          <div class="stat-value sent-gradient">{{ sentThisWeek() }}</div>
          <div class="stat-label">Enviados esta semana</div>
        </div>
        <div class="stat-card stat-done">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-value done-gradient">{{ completedThisMonth() }}</div>
          <div class="stat-label">Concluidos este mes</div>
        </div>
      </section>

      <!-- Urgent Tasks -->
      @if (urgentTasks().length > 0) {
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon urgent-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              Tarefas Urgentes
            </h2>
            <span class="section-badge urgent-badge">{{ urgentTasks().length }}</span>
          </div>
          <div class="tasks-list">
            @for (task of urgentTasks(); track task.id) {
              <div class="task-card">
                <div class="task-priority">
                  <span class="priority-dot priority-urgent"></span>
                </div>
                <div class="task-info">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-meta">
                    <span class="task-ref">{{ task.reference }}</span>
                    <span class="task-sep"></span>
                    <span class="task-folder">{{ task.folder }}</span>
                  </div>
                  <div class="task-deadline urgent-deadline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ formatDeadline(task.deadline) }}
                  </div>
                </div>
                <div class="task-actions">
                  @if (task.type === 'Aprovacao') {
                    <button class="btn btn-approve" (click)="onApprove(task)">Aprovar</button>
                    <button class="btn btn-reject" (click)="onReject(task)">Rejeitar</button>
                  } @else if (task.type === 'Parecer') {
                    <button class="btn btn-send" (click)="onSend(task)">Enviar</button>
                    <button class="btn btn-return" (click)="onReturn(task)">Devolver</button>
                  } @else if (task.type === 'Assinatura') {
                    <button class="btn btn-sign" (click)="onSign(task)">Assinar</button>
                  }
                  <button class="btn btn-view" [routerLink]="['/app/contracts', task.id]">Ver</button>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Pending Tasks -->
      @if (pendingTasks().length > 0) {
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon pending-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              Tarefas Pendentes
            </h2>
            <span class="section-badge pending-badge">{{ pendingTasks().length }}</span>
          </div>
          <div class="tasks-list">
            @for (task of pendingTasks(); track task.id) {
              <div class="task-card">
                <div class="task-priority">
                  <span class="priority-dot"
                    [class.priority-urgent]="task.priority === 'urgent'"
                    [class.priority-medium]="task.priority === 'medium'"
                    [class.priority-normal]="task.priority === 'normal'">
                  </span>
                </div>
                <div class="task-info">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-meta">
                    <span class="task-ref">{{ task.reference }}</span>
                    <span class="task-sep"></span>
                    <span class="task-folder">{{ task.folder }}</span>
                  </div>
                  <div class="task-deadline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ formatDeadline(task.deadline) }}
                  </div>
                </div>
                <div class="task-actions">
                  @if (task.type === 'Aprovacao') {
                    <button class="btn btn-approve" (click)="onApprove(task)">Aprovar</button>
                    <button class="btn btn-reject" (click)="onReject(task)">Rejeitar</button>
                  } @else if (task.type === 'Parecer') {
                    <button class="btn btn-send" (click)="onSend(task)">Enviar</button>
                    <button class="btn btn-return" (click)="onReturn(task)">Devolver</button>
                  } @else if (task.type === 'Assinatura') {
                    <button class="btn btn-sign" (click)="onSign(task)">Assinar</button>
                  }
                  <button class="btn btn-view" [routerLink]="['/app/contracts', task.id]">Ver</button>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Activity Feed -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon activity-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </span>
            Atividade Recente
          </h2>
        </div>
        <div class="activity-feed">
          @for (activity of recentActivities(); track activity.id) {
            <div class="activity-item">
              <div class="activity-avatar" [style.background]="activity.avatarGradient">
                {{ activity.initials }}
              </div>
              <div class="activity-content">
                <div class="activity-text">
                  <strong>{{ activity.user }}</strong> {{ activity.action }}
                  <span class="activity-target">{{ activity.target }}</span>
                </div>
                <div class="activity-time">{{ formatRelativeTime(activity.timestamp) }}</div>
              </div>
            </div>
          }
          @if (recentActivities().length === 0) {
            <div class="activity-empty">Sem atividade recente.</div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .page {
      padding: 28px 32px;
      animation: fadeIn 0.5s var(--ease-out) both;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ── Hero ──────────────────────────────────── */
    .page-hero {
      position: relative;
      background: var(--hero-gradient);
      border-radius: var(--radius-xl);
      padding: 32px 36px;
      color: white;
      overflow: hidden;
      box-shadow: var(--shadow-lg), var(--shadow-glow-teal);
    }
    .hero-glow {
      position: absolute;
      top: -40%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hero-greeting {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .hero-name {
      color: rgba(255, 255, 255, 0.95);
    }
    .hero-subtitle {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
    }
    .hero-subtitle strong {
      color: white;
      font-weight: 700;
    }
    .hero-date {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .hero-date-day {
      font-size: 38px;
      font-weight: 800;
      line-height: 1;
      opacity: 0.9;
    }
    .hero-date-full {
      font-size: 13px;
      opacity: 0.8;
      margin-top: 4px;
      font-weight: 500;
    }

    /* ── Stats Row ─────────────────────────────── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .stat-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 20px 22px;
      box-shadow: var(--shadow-sm);
      transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out);
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .stat-pending::before { background: linear-gradient(90deg, var(--teal-400), var(--teal-500)); }
    .stat-urgent::before { background: linear-gradient(90deg, var(--error), #f87171); }
    .stat-sent::before   { background: linear-gradient(90deg, var(--purple), #a78bfa); }
    .stat-done::before   { background: linear-gradient(90deg, var(--success), #34d399); }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .stat-pending .stat-icon { background: rgba(10, 186, 181, 0.1); color: var(--teal-500); }
    .stat-urgent .stat-icon  { background: rgba(239, 68, 68, 0.1);  color: var(--error); }
    .stat-sent .stat-icon    { background: rgba(139, 92, 246, 0.1); color: var(--purple); }
    .stat-done .stat-icon    { background: rgba(16, 185, 129, 0.1); color: var(--success); }

    .stat-value {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 4px;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .pending-gradient { background-image: linear-gradient(135deg, var(--teal-500), var(--teal-400)); }
    .urgent-gradient  { background-image: linear-gradient(135deg, var(--error), #f87171); }
    .sent-gradient    { background-image: linear-gradient(135deg, var(--purple), #a78bfa); }
    .done-gradient    { background-image: linear-gradient(135deg, var(--success), #34d399); }

    .stat-label {
      font-size: 13px;
      color: var(--gray-500);
      font-weight: 500;
    }

    /* ── Sections ──────────────────────────────── */
    .section {
      animation: fadeIn 0.5s var(--ease-out) both;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--gray-800);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .urgent-icon  { background: rgba(239, 68, 68, 0.1);  color: var(--error); }
    .pending-icon { background: rgba(10, 186, 181, 0.1);  color: var(--teal-500); }
    .activity-icon { background: rgba(139, 92, 246, 0.1); color: var(--purple); }

    .section-badge {
      font-size: 12px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      margin-left: auto;
    }
    .urgent-badge  { background: rgba(239, 68, 68, 0.1);  color: var(--error); }
    .pending-badge { background: rgba(10, 186, 181, 0.1);  color: var(--teal-500); }

    /* ── Task Cards ────────────────────────────── */
    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .task-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
    }
    .task-card:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    .task-priority {
      flex-shrink: 0;
    }
    .priority-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: block;
    }
    .priority-urgent { background: var(--error); box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
    .priority-medium { background: var(--orange-400); box-shadow: 0 0 8px rgba(245, 166, 35, 0.3); }
    .priority-normal { background: var(--teal-500); box-shadow: 0 0 8px rgba(10, 186, 181, 0.3); }

    .task-info {
      flex: 1;
      min-width: 0;
    }
    .task-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .task-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--gray-500);
      margin-bottom: 4px;
    }
    .task-ref {
      font-weight: 600;
      color: var(--teal-600);
    }
    .task-sep {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--gray-300);
    }
    .task-folder {
      color: var(--gray-400);
    }
    .task-deadline {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--gray-400);
    }
    .urgent-deadline {
      color: var(--error);
      font-weight: 600;
    }

    .task-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    /* ── Buttons ───────────────────────────────── */
    .btn {
      padding: 7px 16px;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s var(--ease-out);
      font-family: inherit;
      white-space: nowrap;
    }
    .btn-approve {
      background: linear-gradient(135deg, var(--success), #34d399);
      color: white;
    }
    .btn-approve:hover { box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transform: translateY(-1px); }
    .btn-reject {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }
    .btn-reject:hover { background: rgba(239, 68, 68, 0.18); }
    .btn-send {
      background: linear-gradient(135deg, var(--teal-500), var(--teal-400));
      color: white;
    }
    .btn-send:hover { box-shadow: 0 4px 12px rgba(10, 186, 181, 0.3); transform: translateY(-1px); }
    .btn-return {
      background: rgba(245, 166, 35, 0.1);
      color: var(--orange-600);
    }
    .btn-return:hover { background: rgba(245, 166, 35, 0.18); }
    .btn-sign {
      background: linear-gradient(135deg, var(--purple), #a78bfa);
      color: white;
    }
    .btn-sign:hover { box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); transform: translateY(-1px); }
    .btn-view {
      background: rgba(10, 186, 181, 0.08);
      color: var(--teal-600);
    }
    .btn-view:hover { background: rgba(10, 186, 181, 0.15); }

    /* ── Activity Feed ─────────────────────────── */
    .activity-feed {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      transition: background 0.15s var(--ease-out);
    }
    .activity-item:hover {
      background: rgba(10, 186, 181, 0.04);
    }
    .activity-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
    .activity-content {
      flex: 1;
      min-width: 0;
    }
    .activity-text {
      font-size: 13px;
      color: var(--gray-600);
      line-height: 1.4;
    }
    .activity-text strong {
      color: var(--gray-800);
      font-weight: 600;
    }
    .activity-target {
      color: var(--teal-600);
      font-weight: 500;
    }
    .activity-time {
      font-size: 11px;
      color: var(--gray-400);
      margin-top: 2px;
    }
    .activity-empty {
      padding: 24px;
      text-align: center;
      color: var(--gray-400);
      font-size: 14px;
    }

    /* ── Responsive ────────────────────────────── */
    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .page {
        padding: 16px;
      }
      .page-hero {
        padding: 24px;
      }
      .hero-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .hero-date {
        align-items: flex-start;
      }
      .stats-row {
        grid-template-columns: 1fr;
      }
      .task-card {
        flex-wrap: wrap;
      }
      .task-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class HomeComponent {
  private authService = inject(AuthService);
  store = inject(EdoclinkStoreService);

  firstName = computed(() => {
    const name = this.authService.user()?.name ?? 'Filipe';
    return name.split(' ')[0] || 'Utilizador';
  });

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 19) return 'Boa tarde';
    return 'Boa noite';
  });

  currentDateFormatted = computed(() => {
    const now = new Date();
    return now.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  pendingCount = computed(() => this.store.getPendingTasks().length);
  urgentCount = computed(() => this.store.getUrgentTasks().length);

  sentThisWeek = computed(() => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return this.store.flows.filter(f => new Date(f.date) >= weekAgo).length;
  });

  completedThisMonth = computed(() => {
    const monthStart = new Date(); monthStart.setDate(1);
    return this.store.flows.filter(f => f.status === 'Terminado' && new Date(f.date) >= monthStart).length;
  });

  private toTaskItem(f: any): TaskItem {
    const currentStageIdx = f.stages.findIndex((s: any) => s.status === 'current');
    const prevStage = currentStageIdx > 0 ? f.stages[currentStageIdx - 1] : null;
    const sender = prevStage?.userId ? this.store.getUser(prevStage.userId) : null;
    const folder = f.folderId ? this.store.getFolder(f.folderId) : undefined;
    const days = this.store.daysUntilDeadline(f.deadline);
    const priority = days <= 1 ? 'urgent' as const : days <= 2 ? 'medium' as const : 'normal' as const;
    return {
      id: f.id.toString(),
      title: f.title,
      reference: f.ref,
      folder: folder?.name ?? '',
      deadline: f.deadline ? new Date(f.deadline) : new Date('2099-01-01'),
      priority,
      type: f.type as any,
      assignedBy: sender?.name ?? '',
      stage: `${currentStageIdx + 1}/${f.stages.length}`,
    };
  }

  urgentTasks = computed<TaskItem[]>(() => {
    return this.store.getUrgentTasks().map(f => this.toTaskItem(f));
  });

  pendingTasks = computed<TaskItem[]>(() => {
    const pending = this.store.getPendingTasks();
    const urgent = this.store.getUrgentTasks();
    const urgentIds = new Set(urgent.map(f => f.id));
    return pending.filter(f => !urgentIds.has(f.id)).map(f => this.toTaskItem(f));
  });

  recentActivities = computed<ActivityEntry[]>(() => {
    return this.store.activities.map(a => {
      const user = this.store.getUser(a.userId);
      return {
        id: a.id.toString(),
        user: user.name,
        initials: user.initials,
        avatarGradient: user.gradient,
        action: a.action,
        target: a.target,
        timestamp: new Date(a.time),
      };
    });
  });

  formatDeadline(date: Date): string {
    const days = this.store.daysUntilDeadline(date.toISOString().split('T')[0]);
    if (days <= 0) return 'Vencido!';
    if (days === 1) return 'Vence amanhã';
    if (days <= 7) return `Vence em ${days} dias`;
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  }

  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  }

  onApprove(task: TaskItem): void { console.log('Approve', task.id); }
  onReject(task: TaskItem): void { console.log('Reject', task.id); }
  onSend(task: TaskItem): void { console.log('Send', task.id); }
  onReturn(task: TaskItem): void { console.log('Return', task.id); }
  onSign(task: TaskItem): void { console.log('Sign', task.id); }
}
