import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WorkflowStep } from '../../../core/models/workflow.model';

@Component({
  selector: 'app-workflow-timeline',
  imports: [DatePipe, MatIconModule],
  template: `
    <div class="timeline">
      @for (step of steps(); track step.id) {
        <div class="step" [class]="step.status">
          <div class="step-dot">
            @switch (step.status) {
              @case ('approved') { <mat-icon>check</mat-icon> }
              @case ('active') { <div class="pulse-ring"></div> }
              @case ('rejected') { <mat-icon>close</mat-icon> }
              @default { <div class="empty-dot"></div> }
            }
          </div>
          <div class="step-body">
            <span class="step-name">{{ step.name }}</span>
            <span class="step-assignee">{{ step.assignedTo.name }}</span>
            @if (step.completedAt) {
              <span class="step-date">{{ step.completedAt | date:'dd/MM/yyyy' }}</span>
            }
            @if (step.status === 'active') {
              <span class="step-tag">Em curso</span>
            }
          </div>
          @if (!$last) {
            <div class="line" [class.done]="step.status === 'approved'"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline { position: relative; }

    .step { display: flex; align-items: flex-start; gap: 12px; position: relative; padding-bottom: 22px; }
    .step:last-child { padding-bottom: 0; }

    .step-dot {
      width: 26px; height: 26px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      z-index: 1; flex-shrink: 0; position: relative;
    }
    .step-dot mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .empty-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-light); }

    .step.approved .step-dot { background: rgba(5,150,105,0.1); }
    .step.approved .step-dot mat-icon { color: var(--ch-emerald); }
    .step.active .step-dot { background: rgba(13,148,136,0.1); }
    .step.rejected .step-dot { background: rgba(232,93,74,0.08); }
    .step.rejected .step-dot mat-icon { color: var(--ch-coral); }
    .step.pending .step-dot { background: var(--surface-muted); }

    .pulse-ring {
      width: 8px; height: 8px; border-radius: 50%; background: var(--ch-teal);
      box-shadow: 0 0 0 0 rgba(13,148,136,0.4);
      animation: pulse-dot 2s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0% { box-shadow: 0 0 0 0 rgba(13,148,136,0.4); }
      70% { box-shadow: 0 0 0 8px rgba(13,148,136,0); }
      100% { box-shadow: 0 0 0 0 rgba(13,148,136,0); }
    }

    .step-body { display: flex; flex-direction: column; gap: 1px; padding-top: 2px; }
    .step-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .step.pending .step-name { color: var(--text-tertiary); }
    .step-assignee { font-size: 11px; color: var(--text-tertiary); }
    .step-date { font-size: 10px; color: var(--text-tertiary); }
    .step-tag {
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-teal); margin-top: 2px;
    }

    .line {
      position: absolute; left: 12px; top: 28px; bottom: 0; width: 2px;
      background: var(--border-light);
    }
    .line.done { background: var(--ch-emerald); }
  `]
})
export class WorkflowTimelineComponent {
  steps = input.required<WorkflowStep[]>();
}
