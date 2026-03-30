// ─────────────────────────────────────────────────────────────────────────────
// edoclink Public API – TypeScript DTOs
// Based on: https://edocdevservice.capwatt.com/swagger/public/v1/swagger.json
// ─────────────────────────────────────────────────────────────────────────────

// ── Keys ──────────────────────────────────────────────────────────────────────

export interface EdocProfileKeyDTO {
  ID?: string;         // uuid
  Name?: string;
  Login?: string;
  Domain?: string;
  ExternalId?: string;
}

export interface EdocFlowKeyDTO {
  ID?: string;         // uuid
  Code?: string;
}

export interface EdocDocumentKeyDTO {
  ID?: string;         // uuid
  Code?: string;
}

export interface EdocFlowStageKeyDTO {
  ID?: string;         // uuid
  FlowKey?: EdocFlowKeyDTO;
  Order?: string;
}

export interface EdocFlowTypeKeyDTO {
  ID?: number;
  Name?: string;
}

export interface EdocUnitKeyDTO {
  ID?: string;
  Name?: string;
}

export interface EdocDocumentTypeKeyDTO {
  ID?: number;
  Name?: string;
}

// ── Enums ─────────────────────────────────────────────────────────────────────

export type EdocFlowStatus = 'Canceled' | 'Dispatched' | 'Edition' | 'Pending' | 'Suspended';
export type EdocFlowStageStatus = 'ReturnedBack' | 'Canceled' | 'Dispatched' | 'Future' | 'Pending' | 'Redirected' | 'Suspended';
export type EdocDocumentStatus = 'NotReady' | 'Ready' | 'Canceled' | 'Closed';
export type EdocFlowStageOperationType = 'SEND' | 'SUSPEND' | 'RESUME' | 'RECALL' | 'CANCEL' | 'REASSIGN' | 'RETURNTOSTAGE' | 'RETURNTOINTERVENIENT' | 'UPDATE' | 'ACCEPT' | 'MOVE' | 'REOPEN';

// ── Fields ────────────────────────────────────────────────────────────────────

export interface EdocFieldValueDTO {
  ID?: string;
  Value?: string;
  Label?: string;
}

export interface EdocFlowFieldDTO {
  ID?: string;
  Name?: string;
  Label?: string;
  Value?: string;
  FormattedValue?: string;
  DataType?: string;
  Required?: boolean;
  ReadOnly?: boolean;
  Multiple?: boolean;
  Values?: EdocFieldValueDTO[];
}

export interface EdocDocumentFieldDTO {
  ID?: string;
  Name?: string;
  Label?: string;
  Value?: string;
  FormattedValue?: string;
  DataType?: string;
}

// ── Files ─────────────────────────────────────────────────────────────────────

export interface EdocFileDTO {
  ID?: string;
  Name?: string;
  Extension?: string;
  Size?: number;
  CreatedOn?: string;
  UpdatedOn?: string;
  Version?: number;
  MimeType?: string;
}

// ── Stages ────────────────────────────────────────────────────────────────────

export interface EdocFlowStageDTO {
  Key?: EdocFlowStageKeyDTO;
  Name?: string;
  Description?: string;
  Status?: EdocFlowStageStatus;
  Intervenient?: EdocProfileKeyDTO;
  Executant?: EdocProfileKeyDTO;
  ExecutantDepartment?: string;
  IntervenientDepartment?: string;
  InDate?: string;
  OutDate?: string;
  CreatedOn?: string;
  UpdateDate?: string;
  IsFirstStage?: boolean;
  IsLastStage?: boolean;
  SignatureRequired?: boolean;
  FormattedText?: string;
  Text?: string;
  Fields?: EdocFlowFieldDTO[];
  Files?: EdocFileDTO[];
  PreviousStages?: EdocFlowStageDTO[];
  NextStages?: EdocFlowStageDTO[];
  HasFiles?: boolean;
}

// ── Flow ──────────────────────────────────────────────────────────────────────

export interface EdocFlowDTO {
  Key?: EdocFlowKeyDTO;
  Subject?: string;
  Comments?: string;
  Status?: EdocFlowStatus;
  CreatedOn?: string;
  ReadyOn?: string;
  LastUpdate?: string;
  Ready?: boolean;
  Active?: boolean;
  Confidential?: boolean;
  Author?: EdocProfileKeyDTO;
  AuthorDepartment?: string;
  FlowTypeKey?: EdocFlowTypeKeyDTO;
  OwnerUnit?: EdocUnitKeyDTO;
  Year?: number;
  Number?: number;
  CurrentStages?: EdocFlowStageDTO[];
  FirstStageKey?: EdocFlowStageKeyDTO;
  Fields?: EdocFlowFieldDTO[];
  MainFile?: EdocFileDTO;
  CountFiles?: number;
  HasDocuments?: boolean;
  HasFolders?: boolean;
  LastIntervenient?: EdocProfileKeyDTO;
  LastExecutant?: EdocProfileKeyDTO;
  CurrentPhase?: string;
}

// Folder field item returned in the Fields array
export interface EdocFolderFieldItemDTO {
  Key?: { ID?: string; Name?: string; Code?: string };
  Instance?: { DataType?: string; Value?: unknown; FormattedValue?: string };
}

export interface EdocFolderDTO {
  Key?: { ID?: number | string; Code?: string };
  Fields?: EdocFolderFieldItemDTO[];
  [key: string]: unknown;
}

export interface EdocFlowListResultDTO extends EdocFlowDTO {
  FirstDocument?: EdocDocumentDTO;
  FirstFolder?: EdocFolderDTO;
}

// ── Document ──────────────────────────────────────────────────────────────────

export interface EdocDocumentDTO {
  Key?: EdocDocumentKeyDTO;
  Subject?: string;
  Comments?: string;
  Status?: EdocDocumentStatus;
  CreatedOn?: string;
  UpdatedOn?: string;
  ReadyOn?: string;
  LastUpdate?: string;
  Ready?: boolean;
  Active?: boolean;
  Cancelled?: boolean;
  Author?: EdocProfileKeyDTO;
  AuthorDepartment?: string;
  DocumentTypeKey?: EdocDocumentTypeKeyDTO;
  OwnerUnit?: EdocUnitKeyDTO;
  Year?: number;
  Number?: number;
  Fields?: EdocDocumentFieldDTO[];
  HasFlows?: boolean;
  HasFiles?: boolean;
  HasEntities?: boolean;
}

export interface EdocDocumentListResultDTO extends EdocDocumentDTO {
  FirstFlow?: EdocFlowDTO;
}

// ── Paged Lists ───────────────────────────────────────────────────────────────

export interface EdocListMetadata {
  next?: string;
  previous?: string;
  totalCount?: number;
}

export interface EdocPagedResult<T> {
  Result: T[];
  _Metadata?: EdocListMetadata;
}

// ── Filter / Search ───────────────────────────────────────────────────────────

export type EdocConditionalOperator =
  | 'Equal' | 'NotEqual'
  | 'Contains' | 'NotContains'
  | 'StartsWith' | 'EndsWith'
  | 'Greater' | 'GreaterOrEqual'
  | 'Less' | 'LessOrEqual'
  | 'IsNull' | 'IsNotNull'
  | 'In' | 'NotIn';

export interface EdocConditionDTO {
  Field?: string;
  Condition_operator?: EdocConditionalOperator;
  Value?: string;
  Logical_operator?: 'AND' | 'OR';
  Conditions?: EdocConditionDTO[];
}

export interface EdocConditionsFilterDTO {
  Logical_operator?: 'AND' | 'OR';
  Conditions?: EdocConditionDTO[];
}

export interface EdocFlowsFilterDTO {
  Criteria?: EdocConditionsFilterDTO;
  AdminSearch?: boolean;
}

export interface EdocDocumentsFilterDTO {
  Criteria?: EdocConditionsFilterDTO;
  AdminSearch?: boolean;
  WritePermissionOnly?: boolean;
}

// ── Stage Operation ───────────────────────────────────────────────────────────

export interface EdocFlowStageSendParametersDTO {
  OutDate?: string;
}

export interface EdocFlowStageCancelParametersDTO {
  OutDate?: string;
}

export interface EdocFlowStageAcceptParametersDTO {}

export interface EdocFlowStageOperationExecutionDTO {
  Operations: EdocFlowStageOperationType[];
  SendParameters?: EdocFlowStageSendParametersDTO;
  CancelParameters?: EdocFlowStageCancelParametersDTO;
  AcceptParameters?: EdocFlowStageAcceptParametersDTO;
}

// ── Flow Create ───────────────────────────────────────────────────────────────

export interface EdocFlowCreateDTO {
  Subject?: string;
  Comments?: string;
  FlowTypeKey?: EdocFlowTypeKeyDTO;
  OwnerUnit?: EdocUnitKeyDTO;
  Fields?: EdocFlowFieldDTO[];
}
