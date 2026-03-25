import { Injectable, signal, computed } from '@angular/core';
import { Workflow } from '../models/workflow.model';
import { MOCK_WORKFLOWS } from '../mock/workflow.mock';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private workflows = signal<Record<string, Workflow>>(MOCK_WORKFLOWS);

  getWorkflow(contractId: string) {
    return computed(() => this.workflows()[contractId] ?? null);
  }

  getWorkflowProgress(contractId: string) {
    return computed(() => {
      const workflow = this.workflows()[contractId];
      if (!workflow) return 0;
      const completed = workflow.steps.filter(s => s.status === 'approved').length;
      return Math.round((completed / workflow.steps.length) * 100);
    });
  }
}
