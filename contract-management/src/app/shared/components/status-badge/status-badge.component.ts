import { Component, input, computed } from '@angular/core';
import { ContractStatus, CONTRACT_STATUS_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [style.background]="bgColor()" [style.color]="fgColor()">{{ label() }}</span>`,
  styles: [`
    .badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 9999px;
      font-size: 11px; font-weight: 700; white-space: nowrap;
      letter-spacing: 0.02em;
    }
  `]
})
export class StatusBadgeComponent {
  status = input.required<ContractStatus>();
  label = computed(() => CONTRACT_STATUS_LABELS[this.status()] ?? this.status());

  private colorMap: Record<string, { bg: string; fg: string }> = {
    [ContractStatus.DRAFT]: { bg: 'rgba(122,139,165,0.1)', fg: '#7a8ba5' },
    [ContractStatus.PENDING_APPROVAL]: { bg: 'rgba(212,160,23,0.08)', fg: '#a07c14' },
    [ContractStatus.IN_REVIEW]: { bg: 'rgba(59,130,246,0.08)', fg: '#2563eb' },
    [ContractStatus.APPROVED]: { bg: 'rgba(5,150,105,0.08)', fg: '#059669' },
    [ContractStatus.PENDING_SIGNATURE]: { bg: 'rgba(212,160,23,0.08)', fg: '#a07c14' },
    [ContractStatus.PARTIALLY_SIGNED]: { bg: 'rgba(212,160,23,0.08)', fg: '#a07c14' },
    [ContractStatus.SIGNED]: { bg: 'rgba(5,150,105,0.08)', fg: '#059669' },
    [ContractStatus.ACTIVE]: { bg: 'rgba(13,148,136,0.08)', fg: '#0d9488' },
    [ContractStatus.EXPIRED]: { bg: 'rgba(232,93,74,0.06)', fg: '#e85d4a' },
    [ContractStatus.CANCELLED]: { bg: 'rgba(122,139,165,0.1)', fg: '#7a8ba5' },
    [ContractStatus.RENEWED]: { bg: 'rgba(59,130,246,0.08)', fg: '#2563eb' },
    [ContractStatus.REJECTED]: { bg: 'rgba(232,93,74,0.06)', fg: '#e85d4a' }
  };

  bgColor = computed(() => this.colorMap[this.status()]?.bg ?? 'rgba(122,139,165,0.1)');
  fgColor = computed(() => this.colorMap[this.status()]?.fg ?? '#7a8ba5');
}
