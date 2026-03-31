import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';
import { ContractStatus, ContractType, CONTRACT_TYPE_LABELS } from '../../core/models/contract.model';
import { MOCK_CONTRACTS } from '../../core/mock/contracts.mock';

interface PendingTask {
  id: string;
  title: string;
  code: string;
  type: ContractType;
  typeLabel: string;
  deadline: Date;
  daysRemaining: number;
  isUrgent: boolean;
  actionType: 'approval' | 'signature';
}

interface ExpiringContract {
  id: string;
  title: string;
  code: string;
  expiryDate: Date;
  daysRemaining: number;
}

interface ActivityItem {
  id: number;
  userName: string;
  initials: string;
  gradient: string;
  action: string;
  target: string;
  timeAgo: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <!-- Hero Banner -->
      <section class="page-hero">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-greeting">{{ greeting() }}, <span class="hero-name">{{ firstName() }}</span></h1>
            <p class="hero-subtitle">
              @if (pendingTaskCount() > 0) {
                You have <strong>{{ pendingTaskCount() }}</strong> pending {{ pendingTaskCount() === 1 ? 'task' : 'tasks' }} to review
              } @else {
                All caught up! No pending tasks right now.
              }
            </p>
          </div>
          <div class="hero-date">
            <span class="hero-date-day">{{ currentDay() }}</span>
            <span class="hero-date-full">{{ currentDateFormatted() }}</span>
          </div>
        </div>
        <div class="hero-glow"></div>
      </section>

      <!-- Stats Row -->
      <section class="stats-row">
        <div class="stat-card stat-active">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-number active-gradient">{{ activeCount() }}</div>
          <div class="stat-label">Active Contracts</div>
        </div>
        <div class="stat-card stat-approval">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-number approval-gradient">{{ pendingApprovalCount() }}</div>
          <div class="stat-label">Pending Approval</div>
        </div>
        <div class="stat-card stat-signature">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </div>
          <div class="stat-number signature-gradient">{{ pendingSignatureCount() }}</div>
          <div class="stat-label">Pending Signature</div>
        </div>
        <div class="stat-card stat-portfolio">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="stat-number portfolio-gradient">{{ portfolioValue() }}</div>
          <div class="stat-label">Total Portfolio Value</div>
        </div>
      </section>

      <!-- Two Column Layout -->
      <div class="two-col">
        <!-- Left Column -->
        <div class="left-col">
          <!-- My Pending Tasks -->
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="section-icon tasks-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </span>
                My Pending Tasks
              </h2>
              <span class="section-badge tasks-badge">{{ pendingTasks().length }}</span>
            </div>
            <div class="tasks-list">
              @for (task of pendingTasks(); track task.id) {
                <div class="task-card">
                  <div class="task-priority">
                    <span class="priority-dot" [class.priority-urgent]="task.isUrgent" [class.priority-normal]="!task.isUrgent"></span>
                  </div>
                  <div class="task-info">
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-meta">
                      <span class="task-code">{{ task.code }}</span>
                      <span class="task-sep"></span>
                      <span class="task-type-badge" [attr.data-type]="task.type">{{ task.typeLabel }}</span>
                    </div>
                    <div class="task-deadline" [class.urgent-deadline]="task.isUrgent">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      @if (task.daysRemaining <= 0) {
                        Overdue!
                      } @else if (task.daysRemaining === 1) {
                        Due tomorrow
                      } @else {
                        Due in {{ task.daysRemaining }} days
                      }
                    </div>
                  </div>
                  <div class="task-actions">
                    @if (task.actionType === 'approval') {
                      <button class="btn btn-approve" (click)="onApprove(task)">Approve</button>
                      <button class="btn btn-reject" (click)="onReject(task)">Reject</button>
                    } @else {
                      <button class="btn btn-sign" (click)="onSign(task)">Sign</button>
                      <button class="btn btn-decline" (click)="onDecline(task)">Decline</button>
                    }
                  </div>
                </div>
              }
              @if (pendingTasks().length === 0) {
                <div class="empty-state">No pending tasks. You're all caught up!</div>
              }
            </div>
          </section>

          <!-- Expiring Soon -->
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="section-icon expiring-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </span>
                Expiring Soon
              </h2>
              <span class="section-badge expiring-badge">{{ expiringContracts().length }}</span>
            </div>
            <div class="tasks-list">
              @for (contract of expiringContracts(); track contract.id) {
                <div class="task-card expiring-card">
                  <div class="task-info">
                    <div class="task-title">{{ contract.title }}</div>
                    <div class="task-meta">
                      <span class="task-code">{{ contract.code }}</span>
                      <span class="task-sep"></span>
                      <span class="expiry-date">Expires {{ contract.expiryDate | date:'mediumDate' }}</span>
                    </div>
                  </div>
                  <div class="days-remaining" [class.days-critical]="contract.daysRemaining <= 7" [class.days-warning]="contract.daysRemaining > 7 && contract.daysRemaining <= 15">
                    <span class="days-count">{{ contract.daysRemaining }}</span>
                    <span class="days-label">days left</span>
                  </div>
                </div>
              }
              @if (expiringContracts().length === 0) {
                <div class="empty-state">No contracts expiring in the next 30 days.</div>
              }
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div class="right-col">
          <!-- Recent Activity -->
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="section-icon activity-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </span>
                Recent Activity
              </h2>
            </div>
            <div class="activity-feed">
              @for (activity of recentActivities(); track activity.id) {
                <div class="activity-item">
                  <div class="activity-avatar" [style.background]="activity.gradient">
                    {{ activity.initials }}
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">
                      <strong>{{ activity.userName }}</strong> {{ activity.action }}
                      <span class="activity-target">{{ activity.target }}</span>
                    </div>
                    <div class="activity-time">{{ activity.timeAgo }}</div>
                  </div>
                </div>
              }
              @if (recentActivities().length === 0) {
                <div class="empty-state">No recent activity.</div>
              }
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="section-icon quick-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </span>
                Quick Actions
              </h2>
            </div>
            <div class="quick-actions-card">
              <a class="quick-action-btn primary" routerLink="/app/contracts/new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Contract
              </a>
              <a class="quick-action-btn secondary" routerLink="/app/contracts">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                View All Contracts
              </a>
              <a class="quick-action-btn tertiary" routerLink="/app/manager/approvals">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Pending Approvals
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .page {
      padding: 28px 32px;
      animation: fadeIn 0.5s ease-out both;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ── Hero Banner ───────────────────────────── */
    .page-hero {
      position: relative;
      background: linear-gradient(135deg, #0ABAB5 0%, #F5A623 100%);
      border-radius: 20px;
      padding: 32px 36px;
      color: white;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(10, 186, 181, 0.25), 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    .hero-glow {
      position: absolute;
      top: -40%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 70%);
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
      margin: 0 0 6px 0;
    }
    .hero-name {
      color: rgba(255, 255, 255, 0.95);
    }
    .hero-subtitle {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
      margin: 0;
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
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      padding: 20px 22px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
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
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
    .stat-active::before    { background: linear-gradient(90deg, #10B981, #34d399); }
    .stat-approval::before  { background: linear-gradient(90deg, #F5A623, #F59E0B); }
    .stat-signature::before { background: linear-gradient(90deg, #8B5CF6, #a78bfa); }
    .stat-portfolio::before { background: linear-gradient(90deg, #0ABAB5, #14b8a6); }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .stat-active .stat-icon    { background: rgba(16, 185, 129, 0.1);  color: #10B981; }
    .stat-approval .stat-icon  { background: rgba(245, 166, 35, 0.1);  color: #F5A623; }
    .stat-signature .stat-icon { background: rgba(139, 92, 246, 0.1);  color: #8B5CF6; }
    .stat-portfolio .stat-icon { background: rgba(10, 186, 181, 0.1);  color: #0ABAB5; }

    .stat-number {
      font-size: 36px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 4px;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .active-gradient    { background-image: linear-gradient(135deg, #10B981, #34d399); }
    .approval-gradient  { background-image: linear-gradient(135deg, #F5A623, #D97706); }
    .signature-gradient { background-image: linear-gradient(135deg, #8B5CF6, #a78bfa); }
    .portfolio-gradient { background-image: linear-gradient(135deg, #0ABAB5, #089E9A); }

    .stat-label {
      font-size: 13px;
      color: #6B7280;
      font-weight: 500;
    }

    /* ── Two Column Layout ─────────────────────── */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
    }

    /* ── Sections ──────────────────────────────── */
    .section {
      animation: fadeIn 0.5s ease-out both;
      margin-bottom: 24px;
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
      color: #1F2937;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }
    .section-icon {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .tasks-icon     { background: rgba(10, 186, 181, 0.1);  color: #0ABAB5; }
    .expiring-icon  { background: rgba(239, 68, 68, 0.1);   color: #EF4444; }
    .activity-icon  { background: rgba(139, 92, 246, 0.1);  color: #8B5CF6; }
    .quick-icon     { background: rgba(245, 166, 35, 0.1);  color: #F5A623; }

    .section-badge {
      font-size: 12px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 100px;
      margin-left: auto;
    }
    .tasks-badge    { background: rgba(10, 186, 181, 0.1);  color: #0ABAB5; }
    .expiring-badge { background: rgba(239, 68, 68, 0.1);   color: #EF4444; }

    /* ── Task Cards ────────────────────────────── */
    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .task-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    }
    .task-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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
    .priority-urgent {
      background: #EF4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
      animation: pulse 2s ease-in-out infinite;
    }
    .priority-normal {
      background: #0ABAB5;
      box-shadow: 0 0 8px rgba(10, 186, 181, 0.3);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .task-info {
      flex: 1;
      min-width: 0;
    }
    .task-title {
      font-size: 14px;
      font-weight: 600;
      color: #1F2937;
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
      color: #6B7280;
      margin-bottom: 4px;
    }
    .task-code {
      font-weight: 600;
      color: #0D9488;
    }
    .task-sep {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #D1D5DB;
    }
    .task-type-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 100px;
      background: rgba(10, 186, 181, 0.1);
      color: #0ABAB5;
    }
    .task-type-badge[data-type="nda"]         { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
    .task-type-badge[data-type="supply"]      { background: rgba(245, 166, 35, 0.1); color: #D97706; }
    .task-type-badge[data-type="service"]     { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .task-type-badge[data-type="consulting"]  { background: rgba(99, 102, 241, 0.1); color: #6366F1; }
    .task-type-badge[data-type="partnership"] { background: rgba(236, 72, 153, 0.1); color: #EC4899; }
    .task-type-badge[data-type="lease"]       { background: rgba(14, 165, 233, 0.1); color: #0EA5E9; }

    .task-deadline {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #9CA3AF;
    }
    .urgent-deadline {
      color: #EF4444;
      font-weight: 600;
    }

    .task-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    /* ── Expiring Card ─────────────────────────── */
    .expiring-card {
      gap: 12px;
    }
    .expiry-date {
      color: #9CA3AF;
    }
    .days-remaining {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 14px;
      border-radius: 10px;
      background: rgba(245, 166, 35, 0.08);
      flex-shrink: 0;
    }
    .days-remaining.days-critical {
      background: rgba(239, 68, 68, 0.08);
    }
    .days-remaining.days-critical .days-count {
      color: #EF4444;
    }
    .days-remaining.days-warning {
      background: rgba(245, 166, 35, 0.08);
    }
    .days-remaining.days-warning .days-count {
      color: #D97706;
    }
    .days-count {
      font-size: 20px;
      font-weight: 800;
      color: #F5A623;
      line-height: 1;
    }
    .days-label {
      font-size: 10px;
      font-weight: 600;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ── Buttons ───────────────────────────────── */
    .btn {
      padding: 7px 16px;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease-out;
      font-family: inherit;
      white-space: nowrap;
    }
    .btn-approve {
      background: linear-gradient(135deg, #10B981, #34d399);
      color: white;
    }
    .btn-approve:hover { box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transform: translateY(-1px); }
    .btn-reject {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }
    .btn-reject:hover { background: rgba(239, 68, 68, 0.18); }
    .btn-sign {
      background: linear-gradient(135deg, #8B5CF6, #a78bfa);
      color: white;
    }
    .btn-sign:hover { box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); transform: translateY(-1px); }
    .btn-decline {
      background: rgba(245, 166, 35, 0.1);
      color: #D97706;
    }
    .btn-decline:hover { background: rgba(245, 166, 35, 0.18); }

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
      border-radius: 12px;
      transition: background 0.15s ease-out;
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
      color: #4B5563;
      line-height: 1.4;
    }
    .activity-text strong {
      color: #1F2937;
      font-weight: 600;
    }
    .activity-target {
      color: #0D9488;
      font-weight: 500;
    }
    .activity-time {
      font-size: 11px;
      color: #9CA3AF;
      margin-top: 2px;
    }

    /* ── Quick Actions ─────────────────────────── */
    .quick-actions-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease-out;
      text-decoration: none;
      border: none;
      font-family: inherit;
    }
    .quick-action-btn:hover {
      transform: translateY(-1px);
    }
    .quick-action-btn.primary {
      background: linear-gradient(135deg, #0ABAB5, #14b8a6);
      color: white;
      box-shadow: 0 4px 16px rgba(10, 186, 181, 0.25);
    }
    .quick-action-btn.primary:hover {
      box-shadow: 0 6px 20px rgba(10, 186, 181, 0.35);
    }
    .quick-action-btn.secondary {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      color: #1F2937;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .quick-action-btn.secondary:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    .quick-action-btn.tertiary {
      background: rgba(245, 166, 35, 0.08);
      color: #D97706;
    }
    .quick-action-btn.tertiary:hover {
      background: rgba(245, 166, 35, 0.15);
    }

    /* ── Empty State ───────────────────────────── */
    .empty-state {
      padding: 24px;
      text-align: center;
      color: #9CA3AF;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    /* ── Responsive ────────────────────────────── */
    @media (max-width: 1200px) {
      .two-col {
        grid-template-columns: 1fr;
      }
    }
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
  private store = inject(EdoclinkStoreService);

  private contracts = MOCK_CONTRACTS;

  firstName = computed(() => {
    const name = this.authService.user()?.name ?? 'User';
    return name.split(' ')[0] || 'User';
  });

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  currentDay = computed(() => {
    return new Date().getDate().toString();
  });

  currentDateFormatted = computed(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  // Stats
  activeCount = computed(() =>
    this.contracts.filter(c => c.status === ContractStatus.ACTIVE).length
  );

  pendingApprovalCount = computed(() =>
    this.contracts.filter(c =>
      c.status === ContractStatus.PENDING_APPROVAL || c.status === ContractStatus.IN_REVIEW
    ).length
  );

  pendingSignatureCount = computed(() =>
    this.contracts.filter(c => c.status === ContractStatus.PENDING_SIGNATURE || c.status === ContractStatus.PARTIALLY_SIGNED).length
  );

  portfolioValue = computed(() => {
    const total = this.contracts
      .filter(c => c.status === ContractStatus.ACTIVE || c.status === ContractStatus.SIGNED || c.status === ContractStatus.PENDING_APPROVAL || c.status === ContractStatus.PENDING_SIGNATURE)
      .reduce((sum, c) => sum + c.value, 0);
    return this.formatCurrency(total);
  });

  pendingTaskCount = computed(() => this.pendingTasks().length);

  // Pending tasks: contracts requiring approval or signature
  pendingTasks = computed<PendingTask[]>(() => {
    const now = new Date();
    return this.contracts
      .filter(c =>
        c.status === ContractStatus.PENDING_APPROVAL ||
        c.status === ContractStatus.IN_REVIEW ||
        c.status === ContractStatus.PENDING_SIGNATURE ||
        c.status === ContractStatus.PARTIALLY_SIGNED
      )
      .map(c => {
        const daysRemaining = Math.ceil((c.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const isSignature = c.status === ContractStatus.PENDING_SIGNATURE || c.status === ContractStatus.PARTIALLY_SIGNED;
        return {
          id: c.id,
          title: c.title,
          code: c.edoclinkRef ?? c.id,
          type: c.type,
          typeLabel: CONTRACT_TYPE_LABELS[c.type] ?? c.type,
          deadline: c.endDate,
          daysRemaining,
          isUrgent: daysRemaining <= 7,
          actionType: isSignature ? 'signature' as const : 'approval' as const,
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  });

  // Contracts expiring within 30 days
  expiringContracts = computed<ExpiringContract[]>(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this.contracts
      .filter(c => c.status === ContractStatus.ACTIVE && c.endDate >= now && c.endDate <= thirtyDaysFromNow)
      .map(c => ({
        id: c.id,
        title: c.title,
        code: c.edoclinkRef ?? c.id,
        expiryDate: c.endDate,
        daysRemaining: Math.ceil((c.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  });

  // Recent activity from the store, translated to English
  recentActivities = computed<ActivityItem[]>(() => {
    return this.store.activities.map(a => {
      const user = this.store.getUser(a.userId);
      return {
        id: a.id,
        userName: user.name,
        initials: user.initials,
        gradient: user.gradient,
        action: this.translateAction(a.action),
        target: a.target,
        timeAgo: this.formatRelativeTime(new Date(a.time)),
      };
    });
  });

  // Translate activity actions to English
  private translateAction(action: string): string {
    const translations: Record<string, string> = {
      'enviou etapa "Parecer" de': 'sent review stage of',
      'registou': 'registered',
      'terminou pasta': 'completed folder',
      'adicionou ficheiro a': 'added file to',
      'aprovou etapa de': 'approved stage of',
      'criou pasta': 'created folder',
      'assinou': 'signed',
      'devolveu etapa de': 'returned stage of',
    };
    return translations[action] ?? action;
  }

  // Format relative time in English
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  }

  // Format currency
  private formatCurrency(value: number): string {
    if (value >= 1_000_000) {
      return '\u20AC' + (value / 1_000_000).toFixed(1) + 'M';
    }
    if (value >= 1_000) {
      return '\u20AC' + (value / 1_000).toFixed(0) + 'K';
    }
    return '\u20AC' + value.toLocaleString('en-US');
  }

  // Action handlers
  onApprove(task: PendingTask): void {
    console.log('Approve contract:', task.id, task.title);
  }

  onReject(task: PendingTask): void {
    console.log('Reject contract:', task.id, task.title);
  }

  onSign(task: PendingTask): void {
    console.log('Sign contract:', task.id, task.title);
  }

  onDecline(task: PendingTask): void {
    console.log('Decline contract:', task.id, task.title);
  }
}
