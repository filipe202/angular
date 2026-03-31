import { Injectable, inject, computed } from '@angular/core';
import { DashboardKPIs, ActivityItem, MonthlyTrend, StatusCount, TypeCount } from '../models/dashboard.model';
import { ContractService } from './contract.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private contractService = inject(ContractService);

  dashboardKPIs = computed<DashboardKPIs>(() => {
    const contracts = this.contractService.allContracts();
    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const total = contracts.length;
    const pendingApproval = contracts.filter(c => c.rawStatus === 'Pending').length;
    const signed = contracts.filter(c => c.rawStatus === 'Dispatched').length;
    const expiring = contracts.filter(c => c.endDate <= in30 && c.endDate >= now).length;
    const totalValue = contracts.reduce((sum, c) => sum + (c.value ?? 0), 0);

    // By status — dynamic from actual data
    const statusMap = new Map<string, number>();
    for (const c of contracts) {
      const s = c.rawStatus ?? 'Unknown';
      statusMap.set(s, (statusMap.get(s) ?? 0) + 1);
    }
    const contractsByStatus: StatusCount[] = [...statusMap.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // By type — dynamic from actual rawType
    const typeMap = new Map<string, number>();
    for (const c of contracts) {
      const t = c.rawType ?? 'Unknown';
      typeMap.set(t, (typeMap.get(t) ?? 0) + 1);
    }
    const contractsByType: TypeCount[] = [...typeMap.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Monthly trend — last 6 months
    const monthlyTrend: MonthlyTrend[] = this.buildMonthlyTrend(contracts);

    // Recent activity — last 10 contracts sorted by updatedAt
    const recentActivity: ActivityItem[] = contracts
      .slice()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        user: c.createdBy.name,
        action: this.actionLabel(c.rawStatus ?? ''),
        contractTitle: c.title,
        contractId: c.id,
        timestamp: c.updatedAt,
        icon: this.actionIcon(c.rawStatus ?? ''),
      }));

    return {
      totalContracts: total,
      activeContracts: signed,
      pendingApproval,
      pendingSignature: 0,
      expiringIn30Days: expiring,
      totalValue,
      avgApprovalTimeDays: 0,
      contractsByStatus,
      contractsByType,
      monthlyTrend,
      recentActivity,
    };
  });

  private buildMonthlyTrend(contracts: ReturnType<ContractService['allContracts']>): MonthlyTrend[] {
    const months: MonthlyTrend[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const created = contracts.filter(
        c => c.createdAt >= monthStart && c.createdAt <= monthEnd
      ).length;
      const dispatched = contracts.filter(
        c => c.rawStatus === 'Dispatched' && c.updatedAt >= monthStart && c.updatedAt <= monthEnd
      ).length;

      months.push({ month: label, created, signed: dispatched });
    }
    return months;
  }

  private actionLabel(rawStatus: string): string {
    const map: Record<string, string> = {
      'Pending': 'submitted for approval',
      'Dispatched': 'dispatched',
      'Canceled': 'cancelled',
      'Suspended': 'suspended',
      'Edition': 'created draft',
    };
    return map[rawStatus] ?? 'updated';
  }

  private actionIcon(rawStatus: string): string {
    const map: Record<string, string> = {
      'Pending': 'hourglass_empty',
      'Dispatched': 'check_circle',
      'Canceled': 'cancel',
      'Suspended': 'block',
      'Edition': 'edit',
    };
    return map[rawStatus] ?? 'info';
  }
}
