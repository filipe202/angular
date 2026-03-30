
export interface KpiCard {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: string;
  color: string;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface TypeCount {
  type: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  created: number;
  signed: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  contractTitle: string;
  contractId: string;
  timestamp: Date;
  icon: string;
}

export interface DashboardKPIs {
  totalContracts: number;
  activeContracts: number;
  pendingApproval: number;
  pendingSignature: number;
  expiringIn30Days: number;
  totalValue: number;
  avgApprovalTimeDays: number;
  contractsByStatus: StatusCount[];
  contractsByType: TypeCount[];
  monthlyTrend: MonthlyTrend[];
  recentActivity: ActivityItem[];
}
