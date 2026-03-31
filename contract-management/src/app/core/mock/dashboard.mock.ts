import { ContractStatus, ContractType } from '../models/contract.model';
import { DashboardKPIs } from '../models/dashboard.model';

export const MOCK_DASHBOARD_KPIS: DashboardKPIs = {
  totalContracts: 47,
  activeContracts: 23,
  pendingApproval: 12,
  pendingSignature: 4,
  expiringIn30Days: 8,
  totalValue: 2400000,
  avgApprovalTimeDays: 3.5,
  contractsByStatus: [
    { status: ContractStatus.ACTIVE, count: 23 },
    { status: ContractStatus.PENDING_APPROVAL, count: 12 },
    { status: ContractStatus.PENDING_SIGNATURE, count: 4 },
    { status: ContractStatus.DRAFT, count: 3 },
    { status: ContractStatus.SIGNED, count: 2 },
    { status: ContractStatus.EXPIRED, count: 2 },
    { status: ContractStatus.REJECTED, count: 1 }
  ],
  contractsByType: [
    { type: ContractType.SERVICE, count: 18 },
    { type: ContractType.SUPPLY, count: 12 },
    { type: ContractType.NDA, count: 8 },
    { type: ContractType.PARTNERSHIP, count: 5 },
    { type: ContractType.CONSULTING, count: 3 },
    { type: ContractType.LEASE, count: 1 }
  ],
  monthlyTrend: [
    { month: 'Out', created: 8, signed: 5 },
    { month: 'Nov', created: 12, signed: 9 },
    { month: 'Dez', created: 6, signed: 7 },
    { month: 'Jan', created: 10, signed: 8 },
    { month: 'Fev', created: 14, signed: 10 },
    { month: 'Mar', created: 9, signed: 6 }
  ],
  recentActivity: [
    { id: 'a1', user: 'João Silva', action: 'criou', contractTitle: 'Contrato Fornec. XYZ', contractId: 'c1', timestamp: new Date(Date.now() - 2 * 3600000), icon: 'add_circle' },
    { id: 'a2', user: 'Ana Costa', action: 'aprovou', contractTitle: 'NDA TechPartner', contractId: 'c2', timestamp: new Date(Date.now() - 4 * 3600000), icon: 'check_circle' },
    { id: 'a3', user: 'Pedro Nunes', action: 'assinou', contractTitle: 'Serviço Consultoria', contractId: 'c9', timestamp: new Date(Date.now() - 24 * 3600000), icon: 'draw' },
    { id: 'a4', user: 'Maria Santos', action: 'rejeitou', contractTitle: 'Contrato Marketing', contractId: 'c12', timestamp: new Date(Date.now() - 26 * 3600000), icon: 'cancel' },
    { id: 'a5', user: 'João Silva', action: 'submeteu para aprovação', contractTitle: 'Serviço Limpeza', contractId: 'c7', timestamp: new Date(Date.now() - 48 * 3600000), icon: 'send' },
    { id: 'a6', user: 'Ana Costa', action: 'criou', contractTitle: 'Parceria XYZ', contractId: 'c4', timestamp: new Date(Date.now() - 72 * 3600000), icon: 'add_circle' }
  ]
};
