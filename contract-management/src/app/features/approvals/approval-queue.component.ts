import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

interface ApprovalItem {
  id: number;
  title: string;
  code: string;
  type: string;
  value: string;
  department: string;
  parties: string;
  startDate: string;
  endDate: string;
  description: string;
  documents: { name: string; size: string }[];
  comment: string;
  expanded: boolean;
}

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>
            Approval Queue
            <span class="count-badge" *ngIf="items.length">{{ items.length }}</span>
          </h1>
          <p class="subtitle">Contracts waiting for your decision - approve or reject quickly</p>
        </div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="items.length === 0">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2>All caught up!</h2>
        <p>No contracts pending your approval.</p>
      </div>

      <!-- Approval Cards -->
      <div class="card-list">
        <div class="glass-card" *ngFor="let item of items; let i = index">
          <!-- Card Header -->
          <div class="card-top">
            <div class="card-title-block">
              <span class="code-badge">{{ item.code }}</span>
              <h3 class="card-title">{{ item.title }}</h3>
            </div>
            <span class="type-badge">{{ item.type }}</span>
          </div>

          <!-- Info Grid -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Value</span>
              <span class="info-val value-strong">{{ item.value }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Department</span>
              <span class="info-val">{{ item.department }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Parties</span>
              <span class="info-val">{{ item.parties }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Period</span>
              <span class="info-val">{{ item.startDate }} - {{ item.endDate }}</span>
            </div>
          </div>

          <!-- Expandable Details -->
          <div class="details-toggle" (click)="item.expanded = !item.expanded">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 [style.transform]="item.expanded ? 'rotate(180deg)' : 'rotate(0)'"
                 style="transition: transform 200ms">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ item.expanded ? 'Hide Details' : 'View Details' }}
          </div>

          <div class="details-panel" *ngIf="item.expanded">
            <div class="detail-section" *ngIf="item.description">
              <span class="detail-label">Description</span>
              <p class="detail-text">{{ item.description }}</p>
            </div>
            <div class="detail-section" *ngIf="item.documents.length > 0">
              <span class="detail-label">Documents</span>
              <div class="doc-list">
                <div class="doc-item" *ngFor="let doc of item.documents">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>{{ doc.name }}</span>
                  <span class="doc-size">{{ doc.size }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Comment + Actions -->
          <div class="card-actions">
            <input type="text" class="comment-input" [(ngModel)]="item.comment"
                   placeholder="Add a comment (optional)..." />
            <div class="action-btns">
              <a class="btn btn-gray" [routerLink]="'/app/contracts/' + item.id">View Full Details</a>
              <button class="btn btn-reject" (click)="reject(item, i)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Reject
              </button>
              <button class="btn btn-approve" (click)="approve(item, i)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --glass-bg: rgba(255, 255, 255, 0.65);
      --glass-blur: 16px;
      --glass-border: rgba(255, 255, 255, 0.35);
      --teal-400: #2dd4bf;
      --teal-500: #14b8a6;
      --teal-600: #0d9488;
      --teal-700: #0f766e;
      --teal-50: rgba(20, 184, 166, 0.06);
      --teal-100: rgba(20, 184, 166, 0.12);
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --gray-900: #111827;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
      --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-xl: 18px;
      --radius-full: 9999px;
      --hero-gradient: linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf);
      display: block;
    }

    .page { max-width: 880px; margin: 0 auto; padding: 0 0 40px; }

    /* Header */
    .page-header { margin-bottom: 28px; }
    h1 {
      margin: 0; font-size: 26px; font-weight: 800;
      color: var(--gray-900); letter-spacing: -0.03em;
      display: flex; align-items: center; gap: 10px;
    }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--gray-400); }
    .count-badge {
      font-size: 13px; font-weight: 800; padding: 3px 12px;
      border-radius: var(--radius-full);
      background: rgba(245,158,11,0.1); color: #b45309;
    }

    /* Empty */
    .empty-state {
      text-align: center; padding: 80px 24px;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
    }
    .empty-icon {
      width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 16px;
      background: rgba(16,185,129,0.08); color: #059669;
      display: flex; align-items: center; justify-content: center;
    }
    .empty-state h2 { margin: 0 0 6px; font-size: 18px; font-weight: 700; color: #059669; }
    .empty-state p { margin: 0; font-size: 14px; color: var(--gray-400); }

    /* Cards */
    .card-list { display: flex; flex-direction: column; gap: 14px; }

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 250ms, border-color 250ms;
    }
    .glass-card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--teal-400);
    }

    /* Card Top */
    .card-top {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px; margin-bottom: 16px;
    }
    .card-title-block {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap; min-width: 0;
    }
    .code-badge {
      font-size: 11px; font-weight: 700; font-family: monospace;
      color: var(--gray-500); background: var(--gray-100);
      border: 1px solid var(--gray-200);
      padding: 2px 8px; border-radius: var(--radius-full); flex-shrink: 0;
    }
    .card-title {
      margin: 0; font-size: 16px; font-weight: 700; color: var(--gray-800);
      line-height: 1.3;
    }
    .type-badge {
      font-size: 10px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--teal-600);
      background: var(--teal-50); border: 1px solid var(--teal-100);
      padding: 4px 10px; border-radius: var(--radius-full);
      flex-shrink: 0; white-space: nowrap;
    }

    /* Info Grid */
    .info-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 12px; margin-bottom: 14px;
    }
    .info-item { display: flex; flex-direction: column; gap: 3px; }
    .info-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--gray-400);
    }
    .info-val { font-size: 13px; color: var(--gray-700); font-weight: 500; }
    .value-strong { font-weight: 800; color: var(--gray-900); }

    /* Details Toggle */
    .details-toggle {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; color: var(--gray-400);
      cursor: pointer; padding: 4px 0; margin-bottom: 6px;
      transition: color 200ms;
    }
    .details-toggle:hover { color: var(--teal-600); }

    /* Details Panel */
    .details-panel {
      padding: 14px 16px; margin-bottom: 14px;
      background: rgba(255,255,255,0.5);
      border: 1px solid var(--gray-100);
      border-radius: var(--radius-lg);
    }
    .detail-section { margin-bottom: 12px; }
    .detail-section:last-child { margin-bottom: 0; }
    .detail-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--gray-400);
      display: block; margin-bottom: 4px;
    }
    .detail-text { margin: 0; font-size: 13px; color: var(--gray-600); line-height: 1.5; }
    .doc-list { display: flex; flex-direction: column; gap: 4px; }
    .doc-item {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--gray-600);
    }
    .doc-item svg { color: var(--teal-500); flex-shrink: 0; }
    .doc-size { font-size: 11px; color: var(--gray-400); }

    /* Actions */
    .card-actions {
      display: flex; align-items: center; gap: 12px;
      padding-top: 14px; border-top: 1px solid var(--gray-100);
    }
    .comment-input {
      flex: 1; min-width: 0;
      padding: 9px 14px;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: 13px; color: var(--gray-700);
      background: rgba(255,255,255,0.6);
      outline: none; transition: border-color 200ms, box-shadow 200ms;
      font-family: inherit;
    }
    .comment-input:focus {
      border-color: var(--teal-400);
      box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
    }
    .comment-input::placeholder { color: var(--gray-300); }

    .action-btns { display: flex; gap: 8px; flex-shrink: 0; }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 18px; border-radius: var(--radius-md);
      font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 200ms;
      border: none; text-decoration: none;
    }
    .btn-gray {
      background: transparent; border: 1px solid var(--gray-200);
      color: var(--gray-500);
    }
    .btn-gray:hover { background: var(--gray-50); border-color: var(--gray-300); }

    .btn-reject {
      background: transparent; border: 1px solid rgba(239,68,68,0.25);
      color: #ef4444;
    }
    .btn-reject:hover { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.4); }

    .btn-approve {
      background: linear-gradient(135deg, #059669, #10b981);
      color: #fff; border: none;
      box-shadow: 0 2px 8px rgba(5,150,105,0.3);
      padding: 10px 24px; font-size: 14px;
    }
    .btn-approve:hover {
      box-shadow: 0 4px 16px rgba(5,150,105,0.4);
      transform: translateY(-1px);
    }

    @media (max-width: 700px) {
      .info-grid { grid-template-columns: 1fr 1fr; }
      .card-actions { flex-direction: column; align-items: stretch; }
      .action-btns { justify-content: flex-end; }
    }
  `]
})
export class ApprovalQueueComponent {
  items: ApprovalItem[] = [];

  constructor(private store: EdoclinkStoreService) {
    this.items = this.buildApprovalItems();
  }

  private buildApprovalItems(): ApprovalItem[] {
    const pendingFlows = this.store.getPendingTasks();
    return pendingFlows.map(flow => {
      const doc = this.store.documents.find(d => d.ref === flow.ref || d.title.includes(flow.title.split(' ')[0]));
      return {
        id: flow.id,
        title: flow.title,
        code: flow.ref,
        type: flow.type,
        value: doc?.additionalFields?.['value'] || 'N/A',
        department: doc?.additionalFields?.['department'] || 'General',
        parties: doc?.entityName || 'Internal',
        startDate: flow.date,
        endDate: flow.deadline || 'Open-ended',
        description: doc ? `${doc.type} - ${doc.classificationPath}` : flow.title,
        documents: doc?.files?.map(f => ({ name: f.name, size: f.size })) || [],
        comment: '',
        expanded: false
      };
    });
  }

  approve(item: ApprovalItem, index: number): void {
    console.log('Approved:', { id: item.id, title: item.title, comment: item.comment });
    this.items.splice(index, 1);
  }

  reject(item: ApprovalItem, index: number): void {
    console.log('Rejected:', { id: item.id, title: item.title, comment: item.comment });
    this.items.splice(index, 1);
  }
}
