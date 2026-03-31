import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { EdoclinkStoreService, EdocContract } from '../../../core/services/edoclink-store.service';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (contract(); as c) {
      <div class="detail-page">

        <!-- ── HEADER ── -->
        <div class="header-bar">
          <a routerLink="/app/contracts" class="breadcrumb">
            <span class="back-arrow">&#8592;</span>
            <span>Contracts / {{ c.code }}</span>
          </a>
          <div class="header-main">
            <div class="header-left">
              <h1 class="contract-title">{{ c.title }}</h1>
              <span class="status-badge" [style.background]="statusColor(c.status)">
                {{ c.status }}
              </span>
            </div>
            <div class="header-actions">
              @if (canApprove()) {
                <button class="btn btn-approve" (click)="handleApprove()">
                  <span class="btn-icon">&#10003;</span> Approve
                </button>
                <button class="btn btn-reject" (click)="handleReject()">
                  <span class="btn-icon">&#10007;</span> Reject
                </button>
              }
              @if (canSign()) {
                <button class="btn btn-sign" (click)="handleSign()">
                  <span class="btn-icon">&#9998;</span> Sign
                </button>
                <button class="btn btn-reject" (click)="handleDecline()">
                  <span class="btn-icon">&#10007;</span> Decline
                </button>
              }
            </div>
          </div>
        </div>

        <!-- ── TABS ── -->
        <div class="tabs-bar">
          <button class="tab" [class.active]="activeTab() === 'details'" (click)="activeTab.set('details')">Details</button>
          <button class="tab" [class.active]="activeTab() === 'documents'" (click)="activeTab.set('documents')">Documents</button>
          <button class="tab" [class.active]="activeTab() === 'workflow'" (click)="activeTab.set('workflow')">Workflow</button>
        </div>

        <!-- ═══════════════════ DETAILS TAB ═══════════════════ -->
        @if (activeTab() === 'details') {
          <div class="tab-content">
            <div class="info-grid-2col">

              <!-- General Card -->
              <div class="glass-card">
                <h3 class="card-title">General</h3>
                <div class="field-grid">
                  <div class="field">
                    <span class="field-label">Code</span>
                    <span class="field-value mono">{{ c.code }}</span>
                  </div>
                  <div class="field">
                    <span class="field-label">Type</span>
                    <span class="type-badge">{{ c.type }}</span>
                  </div>
                  <div class="field">
                    <span class="field-label">Department</span>
                    <span class="field-value">{{ c.department }}</span>
                  </div>
                  <div class="field">
                    <span class="field-label">Payment Terms</span>
                    <span class="field-value">{{ c.paymentTerms || 'N/A' }}</span>
                  </div>
                  <div class="field">
                    <span class="field-label">Auto-Renew</span>
                    <span class="field-value">{{ c.autoRenew ? 'Yes' : 'No' }}</span>
                  </div>
                  <div class="field full-width">
                    <span class="field-label">Tags</span>
                    <div class="tags-row">
                      @for (tag of c.tags; track tag) {
                        <span class="tag-pill">{{ tag }}</span>
                      }
                      @if (!c.tags.length) {
                        <span class="field-value muted">No tags</span>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <!-- Value & Dates Card -->
              <div class="glass-card">
                <h3 class="card-title">Value & Dates</h3>
                <div class="field-grid">
                  <div class="field">
                    <span class="field-label">Contract Value</span>
                    <span class="field-value strong">{{ formattedValue() }}</span>
                  </div>
                  <div class="field">
                    <span class="field-label">Currency</span>
                    <span class="field-value">{{ c.currency }}</span>
                  </div>
                  <div class="field">
                    <span class="field-label">Start Date</span>
                    <span class="field-value">{{ c.startDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="field">
                    <span class="field-label">End Date</span>
                    <span class="field-value">{{ c.endDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="field full-width">
                    <span class="field-label">Days Until Expiry</span>
                    <span class="field-value" [class.expiry-warning]="daysLeft() <= 30" [class.expiry-danger]="daysLeft() <= 0">
                      {{ daysLeft() > 0 ? daysLeft() + ' days' : (daysLeft() === 0 ? 'Expires today' : 'Expired ' + (daysLeft() * -1) + ' days ago') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Parties -->
            @if (c.parties.length) {
              <div class="glass-card section-card">
                <h3 class="card-title">Parties</h3>
                <div class="parties-grid">
                  @for (party of c.parties; track party.name) {
                    <div class="party-card">
                      <div class="party-avatar">{{ party.name[0] }}</div>
                      <div class="party-info">
                        <span class="party-name">{{ party.name }}</span>
                        <span class="party-role">{{ party.role }}</span>
                        <div class="party-details">
                          <span class="party-detail">
                            <span class="detail-icon">&#128196;</span> {{ party.taxId || 'N/A' }}
                          </span>
                          <span class="party-detail">
                            <span class="detail-icon">&#9993;</span> {{ party.contact }}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Description -->
            @if (c.description) {
              <div class="glass-card section-card">
                <h3 class="card-title">Description</h3>
                <p class="text-content">{{ c.description }}</p>
              </div>
            }

            <!-- Notes -->
            @if (c.notes) {
              <div class="glass-card section-card">
                <h3 class="card-title">Notes</h3>
                <p class="text-content notes-text">{{ c.notes }}</p>
              </div>
            }
          </div>
        }

        <!-- ═══════════════════ DOCUMENTS TAB ═══════════════════ -->
        @if (activeTab() === 'documents') {
          <div class="tab-content">
            <div class="docs-header">
              <button class="btn btn-upload" (click)="uploadDocument()">
                <span class="btn-icon">&#8683;</span> Upload Document
              </button>
            </div>

            @if (c.documents.length) {
              <div class="docs-list">
                @for (doc of c.documents; track doc.id) {
                  <div class="doc-row">
                    <div class="doc-icon" [style.background]="fileTypeColor(doc.type)" [style.color]="'white'">
                      {{ fileTypeLabel(doc.type) }}
                    </div>
                    <div class="doc-info">
                      <span class="doc-name">{{ doc.name }}</span>
                      <span class="doc-meta">
                        {{ doc.size }} &middot; {{ doc.uploadedAt | date:'mediumDate' }} &middot; {{ getUploaderName(doc.uploadedBy) }}
                      </span>
                    </div>
                    <div class="doc-actions">
                      <button class="btn-icon-action" title="View" (click)="viewDocument(doc)">
                        <span>&#128065;</span>
                      </button>
                      <button class="btn-icon-action" title="Download" (click)="downloadDocument(doc)">
                        <span>&#8681;</span>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <p>No documents attached to this contract.</p>
              </div>
            }
          </div>
        }

        <!-- ═══════════════════ WORKFLOW TAB ═══════════════════ -->
        @if (activeTab() === 'workflow') {
          <div class="tab-content">
            <div class="timeline">
              @for (step of c.workflow; track step.id; let i = $index; let last = $last) {
                <div class="timeline-item">
                  <div class="timeline-connector">
                    <div class="timeline-circle"
                         [class.completed]="step.status === 'completed'"
                         [class.current]="step.status === 'current'"
                         [class.pending]="step.status === 'pending'"
                         [class.rejected]="step.status === 'rejected'">
                      {{ i + 1 }}
                    </div>
                    @if (!last) {
                      <div class="timeline-line"
                           [class.completed]="step.status === 'completed'">
                      </div>
                    }
                  </div>
                  <div class="timeline-content">
                    <div class="step-header">
                      <span class="step-name">{{ step.name }}</span>
                      <span class="step-type-badge"
                            [class.type-approval]="step.type === 'approval'"
                            [class.type-review]="step.type === 'review'"
                            [class.type-signature]="step.type === 'signature'">
                        {{ step.type === 'approval' ? 'Approval' : step.type === 'review' ? 'Review' : 'Signature' }}
                      </span>
                    </div>
                    <div class="step-assignee">
                      <div class="assignee-avatar"
                           [style.background]="store.getUser(step.assigneeId).gradient">
                        {{ store.getUser(step.assigneeId).initials }}
                      </div>
                      <span class="assignee-name">{{ store.getUser(step.assigneeId).name }}</span>
                    </div>
                    @if (step.status === 'completed' || step.status === 'rejected') {
                      <div class="step-details">
                        @if (step.completedAt) {
                          <span class="step-date">{{ step.completedAt | date:'mediumDate' }}</span>
                        }
                        @if (step.comments) {
                          <p class="step-comments">{{ step.comments }}</p>
                        }
                      </div>
                    }
                    @if (step.status === 'current' && step.assigneeId === 1) {
                      <div class="action-form">
                        <textarea
                          class="comment-textarea"
                          [(ngModel)]="actionComment"
                          placeholder="Add a comment..."
                          rows="3">
                        </textarea>
                        <div class="form-actions">
                          @if (c.status === 'Pending Approval') {
                            <button class="btn btn-approve btn-sm" (click)="handleApprove()">
                              <span class="btn-icon">&#10003;</span> Approve
                            </button>
                            <button class="btn btn-reject btn-sm" (click)="handleReject()">
                              <span class="btn-icon">&#10007;</span> Reject
                            </button>
                          }
                          @if (c.status === 'Pending Signature') {
                            <button class="btn btn-sign btn-sm" (click)="handleSign()">
                              <span class="btn-icon">&#9998;</span> Sign
                            </button>
                            <button class="btn btn-reject btn-sm" (click)="handleDecline()">
                              <span class="btn-icon">&#10007;</span> Decline
                            </button>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }

      </div>
    } @else {
      <div class="not-found">
        <div class="not-found-icon">&#128270;</div>
        <h2>Contract Not Found</h2>
        <p>The contract you are looking for does not exist or has been removed.</p>
        <a routerLink="/app/contracts" class="btn btn-back">Back to Contracts</a>
      </div>
    }
  `,
  styles: [`
    /* ── BASE ── */
    .detail-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px;
    }

    /* ── HEADER ── */
    .header-bar {
      margin-bottom: 24px;
    }

    .breadcrumb {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--gray-400, #9CA3AF);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 12px;
      transition: color 200ms;
    }
    .breadcrumb:hover {
      color: var(--teal-400, #0ABAB5);
    }
    .back-arrow {
      font-size: 16px;
    }

    .header-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .contract-title {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: var(--gray-100, #F3F4F6);
      letter-spacing: -0.02em;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: var(--radius-full, 9999px);
      font-size: 12px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    /* ── BUTTONS ── */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border: none;
      border-radius: var(--radius-md, 8px);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms;
      white-space: nowrap;
    }
    .btn-icon {
      font-size: 14px;
    }

    .btn-approve {
      background: #10B981;
      color: white;
    }
    .btn-approve:hover {
      background: #059669;
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.15));
    }

    .btn-reject {
      background: #EF4444;
      color: white;
    }
    .btn-reject:hover {
      background: #DC2626;
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.15));
    }

    .btn-sign {
      background: var(--teal-500, #0ABAB5);
      color: white;
    }
    .btn-sign:hover {
      background: var(--teal-600, #089E9A);
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.15));
    }

    .btn-upload {
      background: var(--glass-bg, rgba(255,255,255,0.06));
      color: var(--teal-400, #0ABAB5);
      border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
      backdrop-filter: var(--glass-blur, blur(12px));
    }
    .btn-upload:hover {
      background: rgba(10, 186, 181, 0.1);
      border-color: var(--teal-400, #0ABAB5);
    }

    .btn-back {
      background: var(--glass-bg, rgba(255,255,255,0.06));
      color: var(--gray-300, #D1D5DB);
      border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
      text-decoration: none;
      padding: 10px 24px;
      border-radius: var(--radius-md, 8px);
      font-size: 14px;
      font-weight: 600;
      transition: all 200ms;
    }
    .btn-back:hover {
      background: rgba(255,255,255,0.1);
    }

    .btn-sm {
      padding: 6px 14px;
      font-size: 12px;
    }

    /* ── TABS ── */
    .tabs-bar {
      display: flex;
      gap: 4px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.1));
      padding-bottom: 0;
    }
    .tab {
      padding: 10px 20px;
      border: none;
      background: none;
      color: var(--gray-400, #9CA3AF);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 200ms;
      margin-bottom: -1px;
    }
    .tab:hover {
      color: var(--gray-200, #E5E7EB);
    }
    .tab.active {
      color: var(--teal-400, #0ABAB5);
      border-bottom-color: var(--teal-400, #0ABAB5);
    }

    .tab-content {
      animation: fadeIn 250ms ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

    /* ── GLASS CARDS ── */
    .glass-card {
      background: var(--glass-bg, rgba(255,255,255,0.06));
      backdrop-filter: var(--glass-blur, blur(12px));
      border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
      border-radius: var(--radius-lg, 12px);
      padding: 22px 24px;
      box-shadow: var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.12));
    }

    .section-card {
      margin-top: 16px;
    }

    .card-title {
      margin: 0 0 18px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--gray-400, #9CA3AF);
    }

    /* ── INFO GRID ── */
    .info-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .field-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .field.full-width {
      grid-column: 1 / -1;
    }
    .field-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--gray-500, #6B7280);
    }
    .field-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-100, #F3F4F6);
    }
    .field-value.strong {
      font-size: 18px;
      font-weight: 800;
      color: var(--teal-400, #0ABAB5);
    }
    .field-value.mono {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: var(--gray-300, #D1D5DB);
    }
    .field-value.muted {
      color: var(--gray-500, #6B7280);
    }

    .type-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: var(--radius-full, 9999px);
      background: rgba(10, 186, 181, 0.12);
      color: var(--teal-400, #0ABAB5);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      width: fit-content;
    }

    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tag-pill {
      display: inline-block;
      padding: 3px 10px;
      border-radius: var(--radius-full, 9999px);
      background: rgba(99, 102, 241, 0.12);
      color: #A5B4FC;
      font-size: 11px;
      font-weight: 600;
    }

    .expiry-warning {
      color: #F59E0B !important;
      font-weight: 700 !important;
    }
    .expiry-danger {
      color: #EF4444 !important;
      font-weight: 700 !important;
    }

    /* ── PARTIES ── */
    .parties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }
    .party-card {
      display: flex;
      gap: 14px;
      padding: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
      border-radius: var(--radius-md, 8px);
      transition: background 200ms;
    }
    .party-card:hover {
      background: rgba(255,255,255,0.06);
    }
    .party-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--teal-500, #0ABAB5), var(--teal-600, #089E9A));
      color: white;
      font-size: 16px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .party-info {
      flex: 1;
      min-width: 0;
    }
    .party-name {
      display: block;
      font-size: 14px;
      font-weight: 700;
      color: var(--gray-100, #F3F4F6);
      margin-bottom: 2px;
    }
    .party-role {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--teal-400, #0ABAB5);
      margin-bottom: 8px;
    }
    .party-details {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .party-detail {
      font-size: 12px;
      color: var(--gray-400, #9CA3AF);
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .detail-icon {
      font-size: 12px;
    }

    /* ── TEXT CONTENT ── */
    .text-content {
      margin: 0;
      font-size: 14px;
      line-height: 1.7;
      color: var(--gray-300, #D1D5DB);
    }
    .notes-text {
      padding: 14px 16px;
      background: rgba(245, 158, 11, 0.06);
      border-left: 3px solid rgba(245, 158, 11, 0.4);
      border-radius: 0 var(--radius-sm, 6px) var(--radius-sm, 6px) 0;
      color: var(--gray-300, #D1D5DB);
    }

    /* ── DOCUMENTS ── */
    .docs-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }
    .docs-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .doc-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: var(--glass-bg, rgba(255,255,255,0.06));
      backdrop-filter: var(--glass-blur, blur(12px));
      border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
      border-radius: var(--radius-md, 8px);
      transition: all 200ms;
    }
    .doc-row:hover {
      background: rgba(255,255,255,0.09);
      border-color: rgba(255,255,255,0.15);
    }

    .doc-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      flex-shrink: 0;
    }

    .doc-info {
      flex: 1;
      min-width: 0;
    }
    .doc-name {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--gray-100, #F3F4F6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .doc-meta {
      font-size: 11px;
      color: var(--gray-500, #6B7280);
    }

    .doc-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
    .btn-icon-action {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
      background: transparent;
      color: var(--gray-400, #9CA3AF);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 200ms;
    }
    .btn-icon-action:hover {
      background: rgba(10, 186, 181, 0.1);
      border-color: var(--teal-400, #0ABAB5);
      color: var(--teal-400, #0ABAB5);
    }

    /* ── WORKFLOW TIMELINE ── */
    .timeline {
      padding: 8px 0;
    }
    .timeline-item {
      display: flex;
      gap: 18px;
    }

    .timeline-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 36px;
      flex-shrink: 0;
    }
    .timeline-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      flex-shrink: 0;
      z-index: 1;
      transition: all 300ms;
    }
    .timeline-circle.completed {
      background: #10B981;
      color: white;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
    }
    .timeline-circle.current {
      background: var(--teal-500, #0ABAB5);
      color: white;
      box-shadow: 0 0 0 4px rgba(10, 186, 181, 0.2);
      animation: pulse 2s infinite;
    }
    .timeline-circle.pending {
      background: var(--gray-700, #374151);
      color: var(--gray-400, #9CA3AF);
      border: 2px solid var(--gray-600, #4B5563);
    }
    .timeline-circle.rejected {
      background: #EF4444;
      color: white;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 4px rgba(10, 186, 181, 0.2); }
      50% { box-shadow: 0 0 0 8px rgba(10, 186, 181, 0.08); }
    }

    .timeline-line {
      width: 2px;
      flex: 1;
      min-height: 24px;
      background: var(--gray-700, #374151);
      margin: 4px 0;
    }
    .timeline-line.completed {
      background: #10B981;
    }

    .timeline-content {
      flex: 1;
      padding-bottom: 28px;
      min-width: 0;
    }
    .timeline-item:last-child .timeline-content {
      padding-bottom: 8px;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    .step-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--gray-100, #F3F4F6);
    }
    .step-type-badge {
      display: inline-block;
      padding: 2px 9px;
      border-radius: var(--radius-full, 9999px);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .type-approval {
      background: rgba(245, 158, 11, 0.12);
      color: #F59E0B;
    }
    .type-review {
      background: rgba(99, 102, 241, 0.12);
      color: #818CF8;
    }
    .type-signature {
      background: rgba(10, 186, 181, 0.12);
      color: var(--teal-400, #0ABAB5);
    }

    .step-assignee {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .assignee-avatar {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
    }
    .assignee-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-300, #D1D5DB);
    }

    .step-details {
      margin-top: 4px;
    }
    .step-date {
      font-size: 11px;
      color: var(--gray-500, #6B7280);
    }
    .step-comments {
      margin: 4px 0 0;
      padding: 8px 12px;
      font-size: 12px;
      color: var(--gray-300, #D1D5DB);
      background: rgba(255,255,255,0.03);
      border-left: 2px solid var(--glass-border, rgba(255,255,255,0.12));
      border-radius: 0 var(--radius-sm, 6px) var(--radius-sm, 6px) 0;
      line-height: 1.5;
    }

    /* ── ACTION FORM ── */
    .action-form {
      margin-top: 10px;
      padding: 14px 16px;
      background: var(--glass-bg, rgba(255,255,255,0.04));
      border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
      border-radius: var(--radius-md, 8px);
    }
    .comment-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--glass-border, rgba(255,255,255,0.12));
      border-radius: var(--radius-sm, 6px);
      background: rgba(0,0,0,0.2);
      color: var(--gray-100, #F3F4F6);
      font-size: 13px;
      font-family: inherit;
      resize: vertical;
      outline: none;
      transition: border-color 200ms;
      box-sizing: border-box;
    }
    .comment-textarea::placeholder {
      color: var(--gray-500, #6B7280);
    }
    .comment-textarea:focus {
      border-color: var(--teal-400, #0ABAB5);
    }

    .form-actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }

    /* ── EMPTY / NOT FOUND ── */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--gray-500, #6B7280);
      font-size: 14px;
    }

    .not-found {
      text-align: center;
      padding: 80px 24px;
      max-width: 400px;
      margin: 0 auto;
    }
    .not-found-icon {
      font-size: 56px;
      margin-bottom: 16px;
      opacity: 0.3;
    }
    .not-found h2 {
      margin: 0 0 8px;
      font-size: 22px;
      font-weight: 700;
      color: var(--gray-200, #E5E7EB);
    }
    .not-found p {
      margin: 0 0 24px;
      font-size: 14px;
      color: var(--gray-400, #9CA3AF);
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .detail-page {
        padding: 16px;
      }
      .info-grid-2col {
        grid-template-columns: 1fr;
      }
      .header-main {
        flex-direction: column;
      }
      .header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .contract-title {
        font-size: 20px;
      }
      .parties-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContractDetailComponent {
  readonly store = inject(EdoclinkStoreService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeTab = signal<'details' | 'documents' | 'workflow'>('details');
  actionComment = '';

  contract = computed<EdocContract | undefined>(() => {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return undefined;
    return this.store.getContract(parseInt(idParam, 10));
  });

  formattedValue = computed(() => {
    const c = this.contract();
    if (!c) return '';
    return this.store.formatCurrency(c.value, c.currency);
  });

  daysLeft = computed(() => {
    const c = this.contract();
    if (!c) return 0;
    return this.store.daysUntilExpiry(c.endDate);
  });

  canApprove = computed(() => {
    const c = this.contract();
    if (!c || c.status !== 'Pending Approval') return false;
    const currentStep = c.workflow.find(s => s.status === 'current');
    return currentStep?.assigneeId === 1;
  });

  canSign = computed(() => {
    const c = this.contract();
    if (!c || c.status !== 'Pending Signature') return false;
    const currentStep = c.workflow.find(s => s.status === 'current');
    return currentStep?.assigneeId === 1;
  });

  statusColor(status: string): string {
    const colors: Record<string, string> = {
      'Draft': '#94A3B8',
      'Pending Approval': '#F59E0B',
      'Active': '#10B981',
      'Pending Signature': '#8B5CF6',
      'Signed': '#0ABAB5',
      'Expired': '#EF4444',
      'Rejected': '#EF4444',
      'Cancelled': '#64748B',
    };
    return colors[status] ?? '#94A3B8';
  }

  fileTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'pdf': '#EF4444',
      'docx': '#3B82F6',
      'doc': '#3B82F6',
      'xlsx': '#10B981',
      'xls': '#10B981',
    };
    return colors[type.toLowerCase()] ?? '#6B7280';
  }

  fileTypeLabel(type: string): string {
    return type.toUpperCase();
  }

  getUploaderName(userId: number): string {
    return this.store.getUser(userId).name;
  }

  uploadDocument(): void {
    // Placeholder for upload functionality
    console.log('Upload document triggered');
  }

  viewDocument(doc: { id: number; name: string }): void {
    console.log('View document:', doc.name);
  }

  downloadDocument(doc: { id: number; name: string }): void {
    console.log('Download document:', doc.name);
  }

  handleApprove(): void {
    const c = this.contract();
    if (!c) return;
    console.log('Approved contract:', c.id, 'Comment:', this.actionComment);
    this.actionComment = '';
  }

  handleReject(): void {
    const c = this.contract();
    if (!c) return;
    console.log('Rejected contract:', c.id, 'Comment:', this.actionComment);
    this.actionComment = '';
  }

  handleSign(): void {
    const c = this.contract();
    if (!c) return;
    console.log('Signed contract:', c.id, 'Comment:', this.actionComment);
    this.actionComment = '';
  }

  handleDecline(): void {
    const c = this.contract();
    if (!c) return;
    console.log('Declined contract:', c.id, 'Comment:', this.actionComment);
    this.actionComment = '';
  }
}
