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
          <div class="step-indicator">
            @switch (step.status) {
              @case ('approved') { <mat-icon>check_circle</mat-icon> }
              @case ('active') { <mat-icon>radio_button_checked</mat-icon> }
              @case ('rejected') { <mat-icon>cancel</mat-icon> }
              @default { <mat-icon>radio_button_unchecked</mat-icon> }
            }
          </div>
          <div class="step-content">
            <span class="step-name">{{ step.name }}</span>
            <span class="step-assignee">{{ step.assignedTo.name }}</span>
            @if (step.completedAt) {
              <span class="step-date">{{ step.completedAt | date:'dd/MM/yyyy' }}</span>
            }
            @if (step.status === 'active') {
              <span class="step-current">Atual</span>
            }
          </div>
          @if (!$last) {
            <div class="connector" [class.completed]="step.status === 'approved'"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline {
      position: relative;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      position: relative;
      padding-bottom: 24px;
    }

    .step:last-child {
      padding-bottom: 0;
    }

    .step-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .step.approved .step-indicator mat-icon { color: #4CAF50; }
    .step.active .step-indicator mat-icon { color: #2196F3; }
    .step.rejected .step-indicator mat-icon { color: #F44336; }
    .step.pending .step-indicator mat-icon { color: #BDBDBD; }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .step-name {
      font-weight: 500;
      font-size: 14px;
    }

    .step-assignee {
      font-size: 12px;
      color: #666;
    }

    .step-date {
      font-size: 11px;
      color: #999;
    }

    .step-current {
      font-size: 11px;
      color: #2196F3;
      font-weight: 500;
    }

    .connector {
      position: absolute;
      left: 11px;
      top: 28px;
      bottom: 0;
      width: 2px;
      background: #E0E0E0;
    }

    .connector.completed {
      background: #4CAF50;
    }
  `]
})
export class WorkflowTimelineComponent {
  steps = input.required<WorkflowStep[]>();
}
