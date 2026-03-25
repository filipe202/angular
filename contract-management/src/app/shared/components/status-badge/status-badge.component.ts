import { Component, input, computed } from '@angular/core';
import { ContractStatus, CONTRACT_STATUS_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [style.background]="bgColor()" [style.color]="fgColor()">{{ label() }}</span>`,
  styles: [`
    .badge {
      display: inline-flex; align-items: center;
      padding: 4px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 600; white-space: nowrap;
      letter-spacing: 0.01em;
    }
  `]
})
export class StatusBadgeComponent {
  status = input.required<ContractStatus>();
  label = computed(() => CONTRACT_STATUS_LABELS[this.status()] ?? this.status());

  private colorMap: Record<string, { bg: string; fg: string }> = {
    [ContractStatus.DRAFT]: { bg: '#f1f5f9', fg: '#475569' },
    [ContractStatus.PENDING_APPROVAL]: { bg: '#fff7ed', fg: '#c2410c' },
    [ContractStatus.IN_REVIEW]: { bg: '#eff6ff', fg: '#1d4ed8' },
    [ContractStatus.APPROVED]: { bg: '#ecfdf5', fg: '#059669' },
    [ContractStatus.PENDING_SIGNATURE]: { bg: '#fefce8', fg: '#a16207' },
    [ContractStatus.PARTIALLY_SIGNED]: { bg: '#fffbeb', fg: '#b45309' },
    [ContractStatus.SIGNED]: { bg: '#ecfdf5', fg: '#059669' },
    [ContractStatus.ACTIVE]: { bg: '#f0fdf4', fg: '#15803d' },
    [ContractStatus.EXPIRED]: { bg: '#fef2f2', fg: '#dc2626' },
    [ContractStatus.CANCELLED]: { bg: '#f1f5f9', fg: '#64748b' },
    [ContractStatus.RENEWED]: { bg: '#eff6ff', fg: '#2563eb' },
    [ContractStatus.REJECTED]: { bg: '#fef2f2', fg: '#dc2626' }
  };

  bgColor = computed(() => this.colorMap[this.status()]?.bg ?? '#f1f5f9');
  fgColor = computed(() => this.colorMap[this.status()]?.fg ?? '#475569');
}
