import { User } from './user.model';

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PENDING_SIGNATURE = 'pending_signature',
  PARTIALLY_SIGNED = 'partially_signed',
  SIGNED = 'signed',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  RENEWED = 'renewed',
  REJECTED = 'rejected'
}

export enum ContractType {
  SERVICE = 'service',
  SUPPLY = 'supply',
  NDA = 'nda',
  PARTNERSHIP = 'partnership',
  LEASE = 'lease',
  CONSULTING = 'consulting',
  OTHER = 'other'
}

export interface ContractParty {
  id: string;
  name: string;
  role: string;
  email: string;
  taxId?: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  url: string;
  edoclinkDocId?: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  type: ContractType;
  status: ContractStatus;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  parties: ContractParty[];
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  value: number;
  currency: string;
  paymentTerms?: string;
  documents: ContractDocument[];
  workflowId?: string;
  currentWorkflowStep?: string;
  tags?: string[];
  department?: string;
  edoclinkRef?: string;   // flow/doc UUID
  edoclinkCode?: string;  // flow/doc human code (e.g. "FLX/2024/001")
  rejectionReason?: string;
  fields?: { Name?: string; Label?: string; Value?: string; FormattedValue?: string; DataType?: string }[];
  flowTypeName?: string;  // raw name from FlowTypeKey.Name / DocumentTypeKey.Name
  currentStageName?: string; // name of the current active stage
  rawStatus?: string;   // raw status string directly from API (e.g. "Pending", "Dispatched")
  rawType?: string;     // raw contract type code from folder field (e.g. "NDA", "ContractingServices_AcquisitionGoods")
}

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: 'Rascunho',
  [ContractStatus.PENDING_APPROVAL]: 'Pendente Aprovação',
  [ContractStatus.IN_REVIEW]: 'Em Revisão',
  [ContractStatus.APPROVED]: 'Aprovado',
  [ContractStatus.PENDING_SIGNATURE]: 'Pendente Assinatura',
  [ContractStatus.PARTIALLY_SIGNED]: 'Parcialmente Assinado',
  [ContractStatus.SIGNED]: 'Assinado',
  [ContractStatus.ACTIVE]: 'Ativo',
  [ContractStatus.EXPIRED]: 'Expirado',
  [ContractStatus.CANCELLED]: 'Cancelado',
  [ContractStatus.RENEWED]: 'Renovado',
  [ContractStatus.REJECTED]: 'Rejeitado'
};

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  [ContractType.SERVICE]: 'Prestação de Serviços',
  [ContractType.SUPPLY]: 'Fornecimento',
  [ContractType.NDA]: 'NDA',
  [ContractType.PARTNERSHIP]: 'Parceria',
  [ContractType.LEASE]: 'Arrendamento',
  [ContractType.CONSULTING]: 'Consultoria',
  [ContractType.OTHER]: 'Outro'
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: '#9E9E9E',
  [ContractStatus.PENDING_APPROVAL]: '#FF9800',
  [ContractStatus.IN_REVIEW]: '#2196F3',
  [ContractStatus.APPROVED]: '#4CAF50',
  [ContractStatus.PENDING_SIGNATURE]: '#FF9800',
  [ContractStatus.PARTIALLY_SIGNED]: '#FFC107',
  [ContractStatus.SIGNED]: '#4CAF50',
  [ContractStatus.ACTIVE]: '#4CAF50',
  [ContractStatus.EXPIRED]: '#F44336',
  [ContractStatus.CANCELLED]: '#9E9E9E',
  [ContractStatus.RENEWED]: '#2196F3',
  [ContractStatus.REJECTED]: '#F44336'
};
