import { Injectable, inject, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Workflow, WorkflowStep, WorkflowStepStatus, WorkflowStepField } from '../models/workflow.model';
import { EdoclinkApiService } from './edoclink-api.service';
import { ContractService } from './contract.service';
import { EdocFlowStageDTO, EdocFlowStageStatus } from '../models/edoclink.types';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private api = inject(EdoclinkApiService);
  private contractService = inject(ContractService);

  // Cache: contractId → Workflow
  private cache = new Map<string, Workflow>();

  getWorkflow(contractId: string) {
    return computed(() => {
      // Return from cache if available
      if (this.cache.has(contractId)) return this.cache.get(contractId)!;
      // Trigger async load — returns null until data arrives
      this.loadWorkflow(contractId);
      return null;
    });
  }

  getWorkflowProgress(contractId: string) {
    return computed(() => {
      const wf = this.cache.get(contractId);
      if (!wf || !wf.steps.length) return 0;
      const done = wf.steps.filter(s => s.status === 'approved').length;
      return Math.round((done / wf.steps.length) * 100);
    });
  }

  private async loadWorkflow(contractId: string): Promise<void> {
    if (this.cache.has(contractId)) return;
    // Check if it's a flow ID (contracts from edoclink flows have edoclinkRef = flow ID)
    const contract = this.contractService.allContracts().find(c => c.id === contractId);
    const flowId = contract?.edoclinkRef ?? contractId;

    try {
      const stagesResult = await firstValueFrom(this.api.getFlowStages(flowId));
      const stages = stagesResult.Result ?? [];
      const workflow = this.mapStagesToWorkflow(contractId, stages);
      this.cache.set(contractId, workflow);
    } catch {
      // No workflow available for this contract
    }
  }

  private mapStagesToWorkflow(contractId: string, stages: EdocFlowStageDTO[]): Workflow {
    const steps: WorkflowStep[] = stages.map((stage, i) => ({
      id: stage.Key?.ID ?? `step-${i}`,
      name: stage.Name ?? `Step ${i + 1}`,
      order: i,
      status: this.mapStageStatus(stage.Status),
      assignedTo: {
        id: stage.Intervenient?.ID ?? 'unknown',
        name: stage.Intervenient?.Name ?? stage.Intervenient?.Login ?? 'Unknown',
        email: stage.Intervenient?.Login ?? '',
      },
      completedAt: stage.OutDate ? new Date(stage.OutDate) : undefined,
      comments: stage.Text ?? stage.FormattedText ?? undefined,
      fields: (stage.Fields ?? [])
        .filter(f => f.Value || f.FormattedValue)
        .map(f => ({
          name: f.Name ?? '',
          label: f.Label ?? f.Name ?? '',
          value: f.Value,
          formattedValue: f.FormattedValue,
        } satisfies WorkflowStepField)),
    }));

    const activeIdx = steps.findIndex(s => s.status === 'active');
    const startedAt = stages[0]?.InDate ? new Date(stages[0].InDate) : new Date();
    const allDone = steps.every(s => s.status === 'approved');

    return {
      id: contractId,
      contractId,
      steps,
      currentStepIndex: activeIdx >= 0 ? activeIdx : steps.length - 1,
      startedAt,
      completedAt: allDone ? new Date() : undefined,
    };
  }

  private mapStageStatus(status?: EdocFlowStageStatus): WorkflowStepStatus {
    switch (status) {
      case 'Dispatched':  return 'approved';
      case 'Pending':     return 'active';
      case 'Canceled':    return 'rejected';
      case 'Future':      return 'pending';
      case 'Suspended':   return 'pending';
      case 'ReturnedBack':return 'rejected';
      default:            return 'pending';
    }
  }
}
