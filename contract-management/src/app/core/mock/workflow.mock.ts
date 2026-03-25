import { Workflow } from '../models/workflow.model';
import { MOCK_USERS } from './contracts.mock';

export const MOCK_WORKFLOWS: Record<string, Workflow> = {
  'c1': {
    id: 'w1', contractId: 'c1', currentStepIndex: 2, startedAt: new Date(Date.now() - 2 * 24 * 3600000),
    steps: [
      { id: 'ws1', name: 'Criação', order: 0, status: 'approved', assignedTo: MOCK_USERS[0], completedAt: new Date(Date.now() - 2 * 24 * 3600000) },
      { id: 'ws2', name: 'Gestor de Área', order: 1, status: 'approved', assignedTo: MOCK_USERS[1], completedAt: new Date(Date.now() - 1 * 24 * 3600000) },
      { id: 'ws3', name: 'Jurídico', order: 2, status: 'active', assignedTo: MOCK_USERS[4] },
      { id: 'ws4', name: 'Direção', order: 3, status: 'pending', assignedTo: MOCK_USERS[2] },
      { id: 'ws5', name: 'Assinatura', order: 4, status: 'pending', assignedTo: MOCK_USERS[2] }
    ]
  },
  'c8': {
    id: 'w2', contractId: 'c8', currentStepIndex: 4, startedAt: new Date(Date.now() - 20 * 24 * 3600000),
    steps: [
      { id: 'ws6', name: 'Criação', order: 0, status: 'approved', assignedTo: MOCK_USERS[3], completedAt: new Date(Date.now() - 20 * 24 * 3600000) },
      { id: 'ws7', name: 'Gestor de Área', order: 1, status: 'approved', assignedTo: MOCK_USERS[1], completedAt: new Date(Date.now() - 15 * 24 * 3600000) },
      { id: 'ws8', name: 'Jurídico', order: 2, status: 'approved', assignedTo: MOCK_USERS[4], completedAt: new Date(Date.now() - 10 * 24 * 3600000) },
      { id: 'ws9', name: 'Direção', order: 3, status: 'approved', assignedTo: MOCK_USERS[2], completedAt: new Date(Date.now() - 5 * 24 * 3600000) },
      { id: 'ws10', name: 'Assinatura', order: 4, status: 'active', assignedTo: MOCK_USERS[2] }
    ]
  }
};
