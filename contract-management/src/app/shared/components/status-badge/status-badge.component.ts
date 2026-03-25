import { Component, input } from '@angular/core';
import { ContractStatus, CONTRACT_STATUS_LABELS, CONTRACT_STATUS_COLORS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-status-badge',
  template: `
    <span class="badge" [style.background]="color()" [style.color]="'white'">
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
  `]
})
export class StatusBadgeComponent {
  status = input.required<ContractStatus>();

  label = () => CONTRACT_STATUS_LABELS[this.status()] ?? this.status();
  color = () => CONTRACT_STATUS_COLORS[this.status()] ?? '#9E9E9E';
}
