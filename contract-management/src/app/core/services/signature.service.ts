import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SignatureRequest, SignatureStatus } from '../models/signature.model';
import { User } from '../models/user.model';
import { EdoclinkApiService } from './edoclink-api.service';
import {
  EdocFlowListResultDTO,
  EdocFlowStageDTO,
  EdocFlowStageOperationExecutionDTO,
} from '../models/edoclink.types';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class SignatureService {
  private api = inject(EdoclinkApiService);
  private authService = inject(AuthService);

  private signatures = signal<SignatureRequest[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  allSignatures = this.signatures.asReadonly();
  isLoading = this.loading.asReadonly();
  hasError = this.error.asReadonly();

  // ── Load ───────────────────────────────────────────────────────────────────

  /**
   * Load flows that have stages requiring signature (SignatureRequired = true)
   * and belong to the current user as Intervenient.
   */
  async loadForCurrentUser(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      // Load all pending flows — filter to signature stages client-side
      const result = await firstValueFrom(
        this.api.listFlows({ Criteria: { Logical_operator: 'AND', Conditions: [] } }, 1, 100)
      );

      const requests: SignatureRequest[] = [];
      const currentUser = this.authService.user();

      for (const flow of result.Result ?? []) {
        const sigStages = (flow.CurrentStages ?? []).filter(
          s => s.SignatureRequired && (s.Status === 'Pending' || s.Status === 'Dispatched')
        );

        for (const stage of sigStages) {
          requests.push(this.mapStageToSignatureRequest(flow, stage, currentUser));
        }
      }

      this.signatures.set(requests);
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.message : 'Error loading signatures.';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }

  // ── Queries ────────────────────────────────────────────────────────────────

  getPendingByUser(userId: string) {
    return computed(() =>
      this.signatures().filter(s => s.signer.id === userId && s.status === 'pending')
    );
  }

  getHistoryByUser(userId: string) {
    return computed(() =>
      this.signatures().filter(s => s.signer.id === userId && s.status !== 'pending')
    );
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  async sign(signatureId: string): Promise<void> {
    const sig = this.signatures().find(s => s.id === signatureId);
    if (!sig) return;

    const body: EdocFlowStageOperationExecutionDTO = {
      Operations: ['SEND'],
      SendParameters: {},
    };
    await firstValueFrom(
      this.api.executeStageOperation(sig.contractId, signatureId, body)
    );

    this.signatures.update(list =>
      list.map(s =>
        s.id === signatureId
          ? { ...s, status: 'signed' as SignatureStatus, signedAt: new Date() }
          : s
      )
    );
  }

  async decline(signatureId: string, reason: string): Promise<void> {
    const sig = this.signatures().find(s => s.id === signatureId);
    if (!sig) return;

    const body: EdocFlowStageOperationExecutionDTO = {
      Operations: ['CANCEL'],
      CancelParameters: {},
    };
    await firstValueFrom(
      this.api.executeStageOperation(sig.contractId, signatureId, body)
    );

    this.signatures.update(list =>
      list.map(s =>
        s.id === signatureId
          ? {
              ...s,
              status: 'declined' as SignatureStatus,
              declinedAt: new Date(),
              declineReason: reason,
            }
          : s
      )
    );
  }

  // ── Mapping ────────────────────────────────────────────────────────────────

  private mapStageToSignatureRequest(
    flow: EdocFlowListResultDTO,
    stage: EdocFlowStageDTO,
    currentUser: User | null
  ): SignatureRequest {
    const signer = stage.Intervenient
      ? this.mapProfile(stage.Intervenient)
      : (currentUser ?? this.unknownUser());

    const requestedBy = flow.Author
      ? this.mapProfile(flow.Author)
      : this.unknownUser();

    const status: SignatureStatus =
      stage.Status === 'Dispatched'
        ? 'signed'
        : stage.Status === 'Canceled'
          ? 'declined'
          : 'pending';

    return {
      id: stage.Key?.ID ?? '',
      contractId: flow.Key?.ID ?? '',
      contractTitle: flow.Subject ?? `Flow ${flow.Number ?? ''}`,
      contractType: flow.FlowTypeKey?.Name ?? 'Contract',
      contractValue: 0,
      signer,
      requestedBy,
      status,
      requestedAt: stage.InDate ? new Date(stage.InDate) : new Date(),
      signedAt: stage.OutDate && status === 'signed' ? new Date(stage.OutDate) : undefined,
      declinedAt: stage.OutDate && status === 'declined' ? new Date(stage.OutDate) : undefined,
      signatureType: 'qualified',
    };
  }

  private mapProfile(p: { ID?: string; Name?: string; Login?: string }): User {
    return {
      id: p.ID ?? p.Login ?? 'unknown',
      name: p.Name ?? p.Login ?? 'Unknown',
      email: p.Login ?? '',
    };
  }

  private unknownUser(): User {
    return { id: 'unknown', name: 'Unknown', email: '' };
  }
}
