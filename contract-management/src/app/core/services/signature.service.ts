import { Injectable, signal, computed } from '@angular/core';
import { SignatureRequest } from '../models/signature.model';
import { MOCK_SIGNATURE_REQUESTS } from '../mock/signatures.mock';

@Injectable({ providedIn: 'root' })
export class SignatureService {
  private signatures = signal<SignatureRequest[]>(MOCK_SIGNATURE_REQUESTS);

  allSignatures = this.signatures.asReadonly();

  getPendingByUser(userId: string) {
    return computed(() => this.signatures().filter(s => s.signer.id === userId && s.status === 'pending'));
  }

  getHistoryByUser(userId: string) {
    return computed(() => this.signatures().filter(s => s.signer.id === userId && s.status !== 'pending'));
  }

  sign(signatureId: string): void {
    this.signatures.update(sigs =>
      sigs.map(s => s.id === signatureId ? { ...s, status: 'signed' as const, signedAt: new Date() } : s)
    );
  }

  decline(signatureId: string, reason: string): void {
    this.signatures.update(sigs =>
      sigs.map(s => s.id === signatureId ? { ...s, status: 'declined' as const, declinedAt: new Date(), declineReason: reason } : s)
    );
  }
}
