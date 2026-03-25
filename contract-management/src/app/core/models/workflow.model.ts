import { User } from './user.model';

export type WorkflowStepStatus = 'pending' | 'active' | 'approved' | 'rejected';

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  status: WorkflowStepStatus;
  assignedTo: User;
  comments?: string;
  completedAt?: Date;
}

export interface Workflow {
  id: string;
  contractId: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  startedAt: Date;
  completedAt?: Date;
}
