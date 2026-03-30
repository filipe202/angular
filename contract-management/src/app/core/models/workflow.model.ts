import { User } from './user.model';

export type WorkflowStepStatus = 'pending' | 'active' | 'approved' | 'rejected';

export interface WorkflowStepField {
  name: string;
  label?: string;
  value?: string;
  formattedValue?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  status: WorkflowStepStatus;
  assignedTo: User;
  comments?: string;
  completedAt?: Date;
  fields?: WorkflowStepField[];
}

export interface Workflow {
  id: string;
  contractId: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  startedAt: Date;
  completedAt?: Date;
}
