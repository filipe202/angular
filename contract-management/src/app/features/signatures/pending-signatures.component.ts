import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EdoclinkStoreService } from '../../core/services/edoclink-store.service';

interface SignatureItem {
  id: number;
  title: string;
  code: string;
  type: string;
  value: string;
  parties: string;
  department: string;
  documents: { name: string; size: string; type: string }[];
  declining: boolean;
  declineReason: string;
}

@Component({
  selector: 'app-pending-signatures',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>
            Pending Signatures
            <span class="count-badge" *ngIf="items.length">{{ items.length }}</span>
          </h1>
          <p class="subtitle">Contracts waiting for your signature</p>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="items.length === 0">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2>All signed!</h2>
        <p>No contracts pending your signature.</p>
      </div>

      <!-- Signature Cards -->
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

          <!-- Key Info -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Value</span>
              <span class="info-val value-strong">{{ item.value }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Parties</span>
              <span class="info-val">{{ item.parties }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Department</span>
              <span class="info-val">{{ item.department }}</span>
            </div>
          </div>

          <!-- Documents to review -->
          <div class="docs-section" *ngIf="item.documents.length > 0">
            <span class="docs-label">Documents to review</span>
            <div class="doc-list">
              <div class="doc-item" *ngFor="let doc of item.documents">
                <div class="doc-icon" [ngClass]="'doc-icon-' + doc.type">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span class="doc-name">{{ doc.name }}</span>
                <span class="doc-size">{{ doc.size }}</span>
              </div>
            </div>
          </div>

          <!-- Decline reason (shown when declining) -->
          <div class="decline-area" *ngIf="item.declining">
            <textarea
              class="decline-input"
              [(ngModel)]="item.declineReason"
              placeholder="Please provide a reason for declining..."
              rows="2"
            ></textarea>
            <div class="decline-actions">
              <button class="btn btn-cancel-sm" (click)="item.declining = false; item.declineReason = ''">Cancel</button>
              <button class="btn btn-confirm-decline" (click)="confirmDecline(item, i)">Confirm Decline</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="card-actions" *ngIf="!item.declining">
            <button class="btn btn-decline" (click)="item.declining = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Decline
            </button>
            <a class="btn btn-view" [routerLink]="'/app/contracts/' + item.id">
              View Full Contract
            </a>
            <button class="btn btn-sign" (click)="sign(item, i)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              Sign Contract
            </button>
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
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 12px; margin-bottom: 16px;
    }
    .info-item { display: flex; flex-direction: column; gap: 3px; }
    .info-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--gray-400);
    }
    .info-val { font-size: 13px; color: var(--gray-700); font-weight: 500; }
    .value-strong { font-weight: 800; color: var(--gray-900); }

    /* Documents Section */
    .docs-section { margin-bottom: 16px; }
    .docs-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--gray-400);
      display: block; margin-bottom: 8px;
    }
    .doc-list {
      display: flex; flex-direction: column; gap: 4px;
      padding: 12px 14px;
      background: rgba(255,255,255,0.5);
      border: 1px solid var(--gray-100);
      border-radius: var(--radius-lg);
    }
    .doc-item {
      display: flex; align-items: center; gap: 8px;
      padding: 4px 0;
    }
    .doc-icon {
      width: 26px; height: 26px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      background: var(--teal-50); color: var(--teal-500);
    }
    .doc-icon-pdf { background: rgba(239,68,68,0.06); color: #ef4444; }
    .doc-icon-docx { background: rgba(59,130,246,0.06); color: #3b82f6; }
    .doc-icon-xlsx { background: rgba(16,185,129,0.06); color: #10b981; }
    .doc-name { font-size: 13px; font-weight: 500; color: var(--gray-700); flex: 1; min-width: 0; }
    .doc-size { font-size: 11px; color: var(--gray-400); flex-shrink: 0; }

    /* Decline Area */
    .decline-area {
      padding: 14px 16px; margin-bottom: 14px;
      background: rgba(239,68,68,0.03);
      border: 1px solid rgba(239,68,68,0.12);
      border-radius: var(--radius-lg);
    }
    .decline-input {
      width: 100%; box-sizing: border-box;
      padding: 10px 14px;
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: var(--radius-md);
      font-size: 13px; color: var(--gray-700);
      background: rgba(255,255,255,0.8);
      outline: none; resize: vertical;
      font-family: inherit;
      transition: border-color 200ms;
    }
    .decline-input:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
    }
    .decline-input::placeholder { color: var(--gray-300); }
    .decline-actions {
      display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;
    }
    .btn-cancel-sm {
      background: transparent; border: 1px solid var(--gray-200);
      color: var(--gray-500); padding: 7px 16px;
      border-radius: var(--radius-md); font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 200ms;
    }
    .btn-cancel-sm:hover { background: var(--gray-50); }
    .btn-confirm-decline {
      background: #ef4444; color: #fff; border: none;
      padding: 7px 16px; border-radius: var(--radius-md);
      font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 200ms;
    }
    .btn-confirm-decline:hover { background: #dc2626; }

    /* Card Actions */
    .card-actions {
      display: flex; align-items: center; gap: 10px;
      padding-top: 16px; border-top: 1px solid var(--gray-100);
    }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 18px; border-radius: var(--radius-md);
      font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 200ms;
      border: none; text-decoration: none;
    }

    .btn-decline {
      background: transparent; border: 1px solid rgba(239,68,68,0.25);
      color: #ef4444;
    }
    .btn-decline:hover { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.4); }

    .btn-view {
      background: transparent; border: 1px solid var(--gray-200);
      color: var(--gray-500);
    }
    .btn-view:hover { background: var(--gray-50); border-color: var(--gray-300); }

    .btn-sign {
      margin-left: auto;
      background: var(--hero-gradient);
      color: #fff; border: none;
      box-shadow: 0 2px 10px rgba(13,148,136,0.35);
      padding: 14px 32px; font-size: 15px; font-weight: 700;
      border-radius: var(--radius-lg);
    }
    .btn-sign:hover {
      box-shadow: 0 6px 20px rgba(13,148,136,0.45);
      transform: translateY(-2px);
    }

    @media (max-width: 640px) {
      .info-grid { grid-template-columns: 1fr; }
      .card-actions { flex-direction: column; align-items: stretch; }
      .btn-sign { margin-left: 0; text-align: center; justify-content: center; }
    }
  `]
})
export class PendingSignaturesComponent {
  items: SignatureItem[] = [];

  constructor(private store: EdoclinkStoreService) {
    this.items = this.buildSignatureItems();
  }

  private buildSignatureItems(): SignatureItem[] {
    // Get flows that are at an "Assinatura" (Signature) stage and pending for current user
    const signatureFlows = this.store.flows.filter(f => {
      if (f.status !== 'Pendente') return false;
      const currentStage = f.stages.find(s => s.status === 'current');
      return currentStage && (currentStage.name === 'Assinatura' || currentStage.name === 'Assinatura Digital');
    });

    return signatureFlows.map(flow => {
      const doc = this.store.documents.find(d =>
        d.ref === flow.ref || d.title.includes(flow.title.split(' ').slice(-1)[0])
      );
      return {
        id: flow.id,
        title: flow.title,
        code: flow.ref,
        type: flow.type,
        value: doc?.additionalFields?.['value'] || 'N/A',
        parties: doc?.entityName || 'Internal',
        department: doc?.additionalFields?.['department'] || 'General',
        documents: doc?.files || [],
        declining: false,
        declineReason: ''
      };
    });
  }

  sign(item: SignatureItem, index: number): void {
    console.log('Signed:', { id: item.id, title: item.title, code: item.code });
    this.items.splice(index, 1);
  }

  confirmDecline(item: SignatureItem, index: number): void {
    console.log('Declined:', { id: item.id, title: item.title, reason: item.declineReason });
    this.items.splice(index, 1);
  }
}
