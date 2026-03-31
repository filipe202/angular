import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EdocFlowDTO,
  EdocFlowListResultDTO,
  EdocFlowStageDTO,
  EdocDocumentDTO,
  EdocDocumentListResultDTO,
  EdocFileDTO,
  EdocPagedResult,
  EdocFlowsFilterDTO,
  EdocDocumentsFilterDTO,
  EdocFlowStageOperationExecutionDTO,
  EdocFlowCreateDTO,
} from '../models/edoclink.types';

@Injectable({ providedIn: 'root' })
export class EdoclinkApiService {
  private http = inject(HttpClient);
  private base = environment.edoclink.apiUrl;

  // ── Flows ──────────────────────────────────────────────────────────────────

  // Columns to request when listing flows
  static readonly CONTRACT_FIELD_COLUMNS = [
    'FirstDocument.Key.ID', 'FirstDocument.Key.Code',
    'FirstFolder.Key.ID', 'FirstFolder.Key.Code',
    'Label.Key.ID', 'Label.Description',
    'Key.ID', 'Key.Code', 'Subject', 'CreatedOn', 'FlowTypeKey.Name', 'Comments',
    'Status', 'Author.Name', 'AuthorDepartment',
    'CurrentStages.Key.ID', 'CurrentStages.Name', 'CurrentStages.Status', 'CurrentStages.SignatureRequired',
    // Folder field IDs: 26=AnnualContractValue, 27=TotalContractValue, 29=EndDate,
    // 36=ContractObject, 37=Summary, 38=ContractManager, 39=LegalManager,
    // 52=Department, 53=ContractType
    'FirstFolder.Fields.26', 'FirstFolder.Fields.38', 'FirstFolder.Fields.52',
    'FirstFolder.Fields.29', 'FirstFolder.Fields.39', 'FirstFolder.Fields.37',
    'FirstFolder.Fields.53', 'FirstFolder.Fields.27', 'FirstFolder.Fields.36',
  ];

  listFlows(
    filter: EdocFlowsFilterDTO = {},
    page = 1,
    pagesize = 50,
    orderby?: string,
    columns?: string[]
  ): Observable<EdocPagedResult<EdocFlowListResultDTO>> {
    let params = new HttpParams()
      .set('filter', JSON.stringify(filter))
      .set('page', page)
      .set('pagesize', pagesize)
      .set('count', true);
    if (orderby) params = params.set('orderby', orderby);
    if (columns?.length) params = params.set('select', columns.join(','));
    return this.http.get<EdocPagedResult<EdocFlowListResultDTO>>(
      `${this.base}/publicapi/flows`,
      { params }
    );
  }

  getFlow(id: string, includeFields = true): Observable<EdocFlowDTO> {
    const params = new HttpParams()
      .set('includeAdditionalFields', includeFields)
      .set('loadPermissions', true);
    return this.http.get<EdocFlowDTO>(`${this.base}/publicapi/flows/${id}`, { params });
  }

  createFlow(data: EdocFlowCreateDTO): Observable<EdocFlowDTO> {
    return this.http.post<EdocFlowDTO>(`${this.base}/publicapi/flows`, data);
  }

  getFlowStages(flowId: string): Observable<EdocPagedResult<EdocFlowStageDTO>> {
    return this.http.get<EdocPagedResult<EdocFlowStageDTO>>(
      `${this.base}/publicapi/flows/${flowId}/stages`
    );
  }

  getFlowStage(flowId: string, stageId: string): Observable<EdocFlowStageDTO> {
    return this.http.get<EdocFlowStageDTO>(
      `${this.base}/publicapi/flows/${flowId}/stages/${stageId}`
    );
  }

  /**
   * Perform a stage operation (SEND = despachar/aprovar, CANCEL = rejeitar/cancelar, ACCEPT = aceitar)
   */
  executeStageOperation(
    flowId: string,
    stageId: string,
    body: EdocFlowStageOperationExecutionDTO
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.base}/publicapi/flows/${flowId}/stages/${stageId}`,
      body
    );
  }

  getFlowFiles(flowId: string): Observable<EdocPagedResult<EdocFileDTO>> {
    return this.http.get<EdocPagedResult<EdocFileDTO>>(
      `${this.base}/publicapi/flows/${flowId}/files`
    );
  }

  // ── Documents ──────────────────────────────────────────────────────────────

  listDocuments(
    filter: EdocDocumentsFilterDTO = {},
    page = 1,
    pagesize = 50,
    orderby?: string
  ): Observable<EdocPagedResult<EdocDocumentListResultDTO>> {
    let params = new HttpParams()
      .set('filter', JSON.stringify(filter))
      .set('page', page)
      .set('pagesize', pagesize)
      .set('count', true);
    if (orderby) params = params.set('orderby', orderby);
    return this.http.get<EdocPagedResult<EdocDocumentListResultDTO>>(
      `${this.base}/publicapi/documents`,
      { params }
    );
  }

  getDocument(id: string, includeFields = true): Observable<EdocDocumentDTO> {
    const params = new HttpParams()
      .set('includeAdditionalFields', includeFields)
      .set('loadPermissions', true);
    return this.http.get<EdocDocumentDTO>(
      `${this.base}/publicapi/documents/${id}`,
      { params }
    );
  }

  getDocumentFlows(documentId: string): Observable<EdocPagedResult<EdocFlowDTO>> {
    return this.http.get<EdocPagedResult<EdocFlowDTO>>(
      `${this.base}/publicapi/documents/${documentId}/flows`
    );
  }

  getDocumentFiles(documentId: string): Observable<EdocPagedResult<EdocFileDTO>> {
    return this.http.get<EdocPagedResult<EdocFileDTO>>(
      `${this.base}/publicapi/documents/${documentId}/files`
    );
  }

  // ── File content ───────────────────────────────────────────────────────────

  getFileContent(fileId: string): Observable<Blob> {
    return this.http.get(`${this.base}/publicapi/files/${fileId}/content`, {
      responseType: 'blob'
    });
  }

  // ── Field values (list options) ────────────────────────────────────────────

  /**
   * Returns the possible values for a folder List field by field ID.
   * e.g. fieldId=52 → Department options, fieldId=53 → ContractType options
   */
  getFieldValues(fieldIdOrName: string | number): Observable<{ Result: { Key: { ID: string; Code: string }; Description?: string; Value?: string }[] }> {
    return this.http.get<any>(`${this.base}/publicapi/fields/${fieldIdOrName}/values`);
  }

  // ── Personal / Session ─────────────────────────────────────────────────────

  /**
   * Returns a JWT session token for the edoclink iframe viewer.
   * The Keycloak bearer token is automatically added by the interceptor.
   */
  getSessionToken(): Observable<string> {
    return this.http.get<string>(`${this.base}/publicapi/personal/sessionToken`);
  }
}
