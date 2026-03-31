import { Component, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WorkflowStep } from '../../../core/models/workflow.model';

@Component({
  selector: 'app-workflow-timeline',
  imports: [DatePipe, MatIconModule],
  template: `
    <div class="timeline">
      @for (step of steps(); track step.id; let i = $index) {
        <div class="step" [class]="step.status" (mouseenter)="hover.set(step.id)" (mouseleave)="hover.set(null)">

          <!-- Step number + status indicator -->
          <div class="step-num-wrap">
            <div class="step-num" [class]="step.status">
              @switch (step.status) {
                @case ('approved') { <mat-icon>check</mat-icon> }
                @case ('rejected') { <mat-icon>close</mat-icon> }
                @case ('active') { <span class="pulse-num">{{ i + 1 }}</span> }
                @default { <span>{{ i + 1 }}</span> }
              }
            </div>
            @if (!$last) {
              <div class="step-line" [class.done]="step.status === 'approved'"></div>
            }
          </div>

          <!-- Step body -->
          <div class="step-body">
            <div class="step-header-row">
              <span class="step-name">{{ step.name }}</span>
              @if (step.status === 'active') {
                <span class="badge-active">In progress</span>
              } @else if (step.status === 'approved') {
                <span class="badge-done">Done</span>
              } @else if (step.status === 'rejected') {
                <span class="badge-rejected">Rejected</span>
              }
            </div>
            <span class="step-assignee">{{ step.assignedTo.name }}</span>
            @if (step.completedAt) {
              <span class="step-date">{{ step.completedAt | date:'dd/MM/yyyy HH:mm' }}</span>
            }

            <!-- Tooltip with fields + comments, shown on hover -->
            @if (hover() === step.id && hasDetails(step)) {
              <div class="step-tooltip">
                @if (step.comments) {
                  <div class="tt-section">
                    <span class="tt-label">Comments</span>
                    <span class="tt-value">{{ step.comments }}</span>
                  </div>
                }
                @if (step.fields?.length) {
                  <div class="tt-section">
                    <span class="tt-label">Fields</span>
                    @for (f of step.fields; track f.name) {
                      <div class="tt-field">
                        <span class="tt-fname">{{ f.label || f.name }}</span>
                        <span class="tt-fval">{{ f.formattedValue || f.value }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .timeline { position: relative; }

    .step {
      display: flex; align-items: flex-start; gap: 10px;
      position: relative; padding-bottom: 4px;
    }
    .step:last-child { padding-bottom: 0; }

    /* Number column */
    .step-num-wrap {
      display: flex; flex-direction: column; align-items: center;
      flex-shrink: 0; width: 26px;
    }
    .step-num {
      width: 26px; height: 26px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; flex-shrink: 0; z-index: 1;
      transition: transform 200ms;
    }
    .step:hover .step-num { transform: scale(1.1); }

    .step-num mat-icon { font-size: 13px; width: 13px; height: 13px; }

    .step-num.approved { background: rgba(5,150,105,0.1); color: var(--ch-emerald); }
    .step-num.active   { background: rgba(13,148,136,0.12); color: var(--ch-teal); }
    .step-num.rejected { background: rgba(232,93,74,0.08); color: var(--ch-coral); }
    .step-num.pending  { background: var(--surface-muted); color: var(--text-tertiary); }

    .pulse-num {
      animation: pulse-scale 2s ease-in-out infinite;
    }
    @keyframes pulse-scale {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .step-line {
      width: 2px; flex: 1; min-height: 18px; background: var(--border-light);
      margin: 3px 0 3px;
    }
    .step-line.done { background: var(--ch-emerald); }

    /* Body */
    .step-body {
      flex: 1; padding: 2px 0 20px; position: relative; min-width: 0;
    }
    .step:last-child .step-body { padding-bottom: 0; }

    .step-header-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .step-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .step.pending .step-name { color: var(--text-tertiary); font-weight: 500; }

    .badge-active {
      font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 2px 6px; border-radius: 99px;
    }
    .badge-done {
      font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-emerald); background: rgba(5,150,105,0.07); padding: 2px 6px; border-radius: 99px;
    }
    .badge-rejected {
      font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--ch-coral); background: rgba(232,93,74,0.07); padding: 2px 6px; border-radius: 99px;
    }

    .step-assignee { font-size: 11px; color: var(--text-tertiary); display: block; }
    .step-date { font-size: 10px; color: var(--text-tertiary); display: block; margin-top: 1px; }

    /* Tooltip */
    .step-tooltip {
      position: absolute; left: 0; top: calc(100% - 16px); z-index: 100;
      width: 240px;
      background: var(--ch-navy, #0f1b30); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 12px 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      animation: fadeUp 150ms ease;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: none; }
    }

    .tt-section { margin-bottom: 10px; }
    .tt-section:last-child { margin-bottom: 0; }
    .tt-label {
      font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
      color: rgba(255,255,255,0.3); display: block; margin-bottom: 5px;
    }
    .tt-value { font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.4; }
    .tt-field { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
    .tt-fname { font-size: 11px; color: rgba(255,255,255,0.4); flex-shrink: 0; }
    .tt-fval  { font-size: 11px; color: rgba(255,255,255,0.85); font-weight: 600; text-align: right; }
  `]
})
export class WorkflowTimelineComponent {
  steps = input.required<WorkflowStep[]>();
  hover = signal<string | null>(null);

  hasDetails(step: WorkflowStep): boolean {
    return !!(step.comments || step.fields?.length);
  }
}
