import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Contract, ContractStatus, ContractType, ContractDocument } from '../models/contract.model';
import { User } from '../models/user.model';
import { EdoclinkApiService } from './edoclink-api.service';
import {
  EdocFlowListResultDTO,
  EdocFlowStageDTO,
  EdocDocumentListResultDTO,
  EdocFileDTO,
  EdocFlowStatus,
  EdocFlowStageStatus,
  EdocFlowStageOperationExecutionDTO,
  EdocFolderFieldItemDTO,
} from '../models/edoclink.types';
import { AuthService } from '../auth/auth.service';
import { FieldValuesService } from './field-values.service';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private api = inject(EdoclinkApiService);
  private authService = inject(AuthService);
  private fieldValues = inject(FieldValuesService);

  private contracts = signal<Contract[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  allContracts = this.contracts.asReadonly();
  isLoading = this.loading.asReadonly();
  hasError = this.error.asReadonly();

  // ── Load ───────────────────────────────────────────────────────────────────

  async loadAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      // Preload field value labels by name
      await this.fieldValues.preload(['Department', 'ContractType']);

      const filter = {
        Criteria: {
          Logical_operator: 'AND',
          Conditions: [
            {
              Logical_operator: 'AND',
              Conditions: [
                { Condition_operator: 'EQUAL', Field: 'FlowTypeKey.Name', Value: 'GEST_CONT' },
                {
                  Logical_operator: 'OR',
                  Conditions: [
                    { Condition_operator: 'EQUAL', Field: 'Status', Value: 'Pending' },
                    { Condition_operator: 'EQUAL', Field: 'Status', Value: 'Suspended' },
                    { Condition_operator: 'EQUAL', Field: 'Status', Value: 'Canceled' },
                    { Condition_operator: 'EQUAL', Field: 'Status', Value: 'Dispatched' },
                  ],
                },
              ],
            },
            {
              Logical_operator: 'AND',
              Conditions: [{ Field: 'Ready', Condition_operator: 'EQUAL', Value: '1' }],
            },
          ],
        },
      };
      const flowsResult = await firstValueFrom(
        this.api.listFlows(filter as any, 1, 200, 'CreatedOn desc', EdoclinkApiService.CONTRACT_FIELD_COLUMNS)
      );
      const contracts = (flowsResult.Result ?? []).map(f => this.mapFlowToContract(f));
      this.contracts.set(contracts);
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.message : 'Error loading contracts.';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }

  async loadById(id: string): Promise<Contract | null> {
    try {
      const flow = await firstValueFrom(this.api.getFlow(id, true));
      return this.mapFlowToContract(flow as EdocFlowListResultDTO);
    } catch {
      return null;
    }
  }

  // ── Queries ────────────────────────────────────────────────────────────────

  getContractById(id: string) {
    return computed(() => this.contracts().find(c => c.id === id) ?? null);
  }

  getContractsByCreator(userId: string) {
    return computed(() => this.contracts().filter(c => c.createdBy.id === userId));
  }

  getContractsByStatus(status: ContractStatus) {
    return computed(() => this.contracts().filter(c => c.status === status));
  }

  getPendingApproval() {
    return computed(() =>
      this.contracts().filter(
        c => c.status === ContractStatus.PENDING_APPROVAL || c.status === ContractStatus.IN_REVIEW
      )
    );
  }

  getExpiringContracts(days: number) {
    return computed(() => {
      const now = new Date();
      const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      return this.contracts().filter(
        c => c.status === ContractStatus.ACTIVE && c.endDate <= future && c.endDate >= now
      );
    });
  }

  // ── Mutations (via edoclink stage operations) ──────────────────────────────

  async approveContract(contractId: string, comments?: string): Promise<void> {
    const contract = this.contracts().find(c => c.id === contractId);
    if (!contract?.edoclinkRef || !contract.currentWorkflowStep) return;

    const body: EdocFlowStageOperationExecutionDTO = {
      Operations: ['SEND'],
      SendParameters: comments ? { OutDate: new Date().toISOString() } : {},
    };
    await firstValueFrom(
      this.api.executeStageOperation(contract.edoclinkRef, contract.currentWorkflowStep, body)
    );
    await this.refreshContract(contractId);
  }

  async rejectContract(contractId: string, _reason: string): Promise<void> {
    const contract = this.contracts().find(c => c.id === contractId);
    if (!contract?.edoclinkRef || !contract.currentWorkflowStep) return;

    const body: EdocFlowStageOperationExecutionDTO = {
      Operations: ['CANCEL'],
      CancelParameters: {},
    };
    await firstValueFrom(
      this.api.executeStageOperation(contract.edoclinkRef, contract.currentWorkflowStep, body)
    );
    await this.refreshContract(contractId);
  }

  private async refreshContract(contractId: string): Promise<void> {
    const updated = await this.loadById(contractId);
    if (updated) {
      this.contracts.update(list => list.map(c => (c.id === contractId ? updated : c)));
    }
  }

  // ── Folder field helpers ───────────────────────────────────────────────────

  /**
   * Get a raw Instance.Value from the folder Fields array by field Name (e.g. "EndDate")
   */
  private folderField(fields: EdocFolderFieldItemDTO[] | undefined, name: string): unknown {
    return fields?.find(f => f.Key?.Name === name)?.Instance?.Value ?? undefined;
  }

  /** Get a string value from folder field */
  private folderStr(fields: EdocFolderFieldItemDTO[] | undefined, name: string): string | undefined {
    const v = this.folderField(fields, name);
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'object') {
      // Profile field: { ID, Name, Login }
      const p = v as any;
      return p.Name ?? p.Login ?? undefined;
    }
    return String(v);
  }

  /** Get a numeric value from folder field */
  private folderNum(fields: EdocFolderFieldItemDTO[] | undefined, name: string): number | null {
    const v = this.folderField(fields, name);
    if (v === undefined || v === null) return null;
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^\d.,-]/g, '').replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  /** Get a date from folder field */
  private folderDate(fields: EdocFolderFieldItemDTO[] | undefined, name: string): Date | null {
    const v = this.folderField(fields, name);
    if (!v) return null;
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? null : d;
  }

  /** Get Code from a List field (array of {ID, Code}) */
  private folderListCode(fields: EdocFolderFieldItemDTO[] | undefined, name: string): string | undefined {
    const v = this.folderField(fields, name);
    if (!v) return undefined;
    if (Array.isArray(v) && v.length > 0) return (v[0] as any).Code ?? undefined;
    return undefined;
  }

  // ── Mapping: edoclink Flow → Contract ─────────────────────────────────────

  private mapFlowToContract(flow: EdocFlowListResultDTO): Contract {
    const currentStage = flow.CurrentStages?.[0];
    const ff = flow.FirstFolder?.Fields as EdocFolderFieldItemDTO[] | undefined;

    const contractTypeCode = this.folderListCode(ff, 'ContractType');
    const departmentCode   = this.folderListCode(ff, 'Department');
    const contractType = contractTypeCode
      ? this.fieldValues.resolve('ContractType', contractTypeCode)
      : undefined;
    const department   = departmentCode
      ? this.fieldValues.resolve('Department', departmentCode)
      : undefined;
    const endDate        = this.folderDate(ff, 'EndDate');
    const totalValue     = this.folderNum(ff, 'TotalContractValue');
    const annualValue    = this.folderNum(ff, 'AnnualContractValue');
    const summary        = this.folderStr(ff, 'Summary');
    const contractObject = this.folderStr(ff, 'ContractObject');
    const contractMgr    = this.folderStr(ff, 'ContractManager');
    const legalMgr       = this.folderStr(ff, 'LegalManager');

    return {
      id: flow.Key?.ID ?? flow.Key?.Code ?? '',
      title: flow.Subject ?? `Flow ${flow.Number ?? ''}`,
      description: summary ?? contractObject ?? flow.Comments ?? '',
      type: this.inferContractType(contractType ?? flow.FlowTypeKey?.Name),
      status: this.mapFlowStatus(flow.Status, currentStage),
      createdBy: this.mapProfile(flow.Author),
      createdAt: flow.CreatedOn ? new Date(flow.CreatedOn) : new Date(),
      updatedAt: flow.LastUpdate ? new Date(flow.LastUpdate) : new Date(),
      parties: this.extractParties(contractMgr, legalMgr),
      startDate: flow.CreatedOn ? new Date(flow.CreatedOn) : new Date(),
      endDate: endDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: false,
      value: totalValue ?? annualValue ?? 0,
      currency: 'EUR',
      documents: this.mapFlowFiles(flow.MainFile),
      workflowId: flow.Key?.ID,
      currentWorkflowStep: currentStage?.Key?.ID,
      tags: [contractType, flow.FlowTypeKey?.Name].filter(Boolean) as string[],
      department: department ?? flow.AuthorDepartment ?? flow.OwnerUnit?.Name,
      edoclinkRef: flow.Key?.ID,
      edoclinkCode: flow.Key?.Code,
      fields: this.buildFieldsFromFolderArray(ff),
      flowTypeName: contractType ?? flow.FlowTypeKey?.Name,
      currentStageName: currentStage?.Name,
      rawStatus: flow.Status,
      rawType: contractType,
    };
  }

  // ── Mapping: edoclink Document → Contract ─────────────────────────────────

  private mapDocumentToContract(doc: EdocDocumentListResultDTO): Contract {
    return {
      id: doc.Key?.ID ?? doc.Key?.Code ?? '',
      title: doc.Subject ?? `Doc ${doc.Number ?? ''}`,
      description: doc.Comments ?? '',
      type: ContractType.OTHER,
      status: this.mapDocumentStatus(doc.Status),
      createdBy: this.mapProfile(doc.Author),
      createdAt: doc.CreatedOn ? new Date(doc.CreatedOn) : new Date(),
      updatedAt: doc.LastUpdate ? new Date(doc.LastUpdate) : new Date(),
      parties: [],
      startDate: doc.CreatedOn ? new Date(doc.CreatedOn) : new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: false,
      value: 0,
      currency: 'EUR',
      documents: [],
      workflowId: doc.FirstFlow?.Key?.ID,
      currentWorkflowStep: undefined,
      tags: doc.DocumentTypeKey?.Name ? [doc.DocumentTypeKey.Name] : [],
      department: doc.AuthorDepartment ?? doc.OwnerUnit?.Name,
      edoclinkRef: doc.Key?.ID,
      edoclinkCode: doc.Key?.Code,
      fields: [],
      flowTypeName: doc.DocumentTypeKey?.Name,
      currentStageName: undefined,
    };
  }

  // ── Status mapping ─────────────────────────────────────────────────────────

  private mapFlowStatus(
    flowStatus?: EdocFlowStatus,
    currentStage?: EdocFlowStageDTO
  ): ContractStatus {
    if (flowStatus === 'Canceled') return ContractStatus.CANCELLED;
    if (flowStatus === 'Dispatched') return ContractStatus.SIGNED;
    if (flowStatus === 'Suspended') return ContractStatus.CANCELLED;
    if (flowStatus === 'Edition') return ContractStatus.DRAFT;

    if (currentStage) {
      const stageStatus = currentStage.Status as EdocFlowStageStatus;
      if (stageStatus === 'Pending') {
        return currentStage.SignatureRequired
          ? ContractStatus.PENDING_SIGNATURE
          : ContractStatus.PENDING_APPROVAL;
      }
      if (stageStatus === 'Dispatched') return ContractStatus.APPROVED;
      if (stageStatus === 'Canceled') return ContractStatus.REJECTED;
      if (stageStatus === 'Suspended') return ContractStatus.CANCELLED;
      if (stageStatus === 'Future') return ContractStatus.IN_REVIEW;
    }

    // No stage info — map directly from flow status
    if (flowStatus === 'Pending') return ContractStatus.PENDING_APPROVAL;

    return ContractStatus.PENDING_APPROVAL;
  }

  private mapDocumentStatus(status?: string): ContractStatus {
    switch (status) {
      case 'Ready':    return ContractStatus.ACTIVE;
      case 'Closed':   return ContractStatus.SIGNED;
      case 'Canceled': return ContractStatus.CANCELLED;
      default:         return ContractStatus.DRAFT;
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private mapProfile(profile?: { ID?: string; Name?: string; Login?: string; ExternalId?: string }): User {
    return {
      id: profile?.ID ?? profile?.Login ?? 'unknown',
      name: profile?.Name ?? profile?.Login ?? 'Unknown',
      email: profile?.Login ?? '',
    };
  }

  private inferContractType(typeName?: string): ContractType {
    if (!typeName) return ContractType.OTHER;
    const n = typeName.toLowerCase();
    if (n.includes('serv') || n.includes('contracting')) return ContractType.SERVICE;
    if (n.includes('forn') || n.includes('supply') || n.includes('acquisition')) return ContractType.SUPPLY;
    if (n.includes('nda') || n.includes('confidencial')) return ContractType.NDA;
    if (n.includes('parcer') || n.includes('partner')) return ContractType.PARTNERSHIP;
    if (n.includes('arrend') || n.includes('lease')) return ContractType.LEASE;
    if (n.includes('consul')) return ContractType.CONSULTING;
    return ContractType.OTHER;
  }

  private extractParties(contractManager?: string, legalManager?: string): import('../models/contract.model').ContractParty[] {
    const parties: import('../models/contract.model').ContractParty[] = [];
    if (contractManager) parties.push({ id: 'contract-mgr', name: contractManager, role: 'Contract Manager', email: '' });
    if (legalManager) parties.push({ id: 'legal-mgr', name: legalManager, role: 'Legal Manager', email: '' });
    return parties;
  }

  private buildFieldsFromFolderArray(
    fields?: EdocFolderFieldItemDTO[]
  ): { Name?: string; Label?: string; Value?: string }[] {
    if (!fields) return [];
    const result: { Name: string; Label: string; Value: string }[] = [];
    for (const f of fields) {
      const name = f.Key?.Name ?? f.Key?.ID ?? '';
      const label = f.Key?.Name ?? name;
      const val = f.Instance?.Value;
      if (val === undefined || val === null || val === '') continue;

      let displayValue: string;
      if (Array.isArray(val)) {
        // List field — show Code values joined
        displayValue = (val as any[]).map(v => v.Code ?? v.ID ?? '').filter(Boolean).join(', ');
      } else if (typeof val === 'object') {
        // Profile field
        const p = val as any;
        displayValue = p.Name ?? p.Login ?? JSON.stringify(val);
      } else {
        displayValue = String(val);
      }

      if (displayValue) result.push({ Name: name, Label: label, Value: displayValue });
    }
    return result;
  }

  private mapFlowFiles(mainFile?: EdocFileDTO): ContractDocument[] {
    if (!mainFile?.ID) return [];
    return [
      {
        id: mainFile.ID,
        name: mainFile.Name ?? 'File',
        type: mainFile.MimeType ?? mainFile.Extension ?? 'application/octet-stream',
        size: mainFile.Size ?? 0,
        uploadedAt: mainFile.CreatedOn ? new Date(mainFile.CreatedOn) : new Date(),
        url: `${this.api['base']}/publicapi/files/${mainFile.ID}/content`,
        edoclinkDocId: mainFile.ID,
      },
    ];
  }
}
