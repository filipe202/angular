import { User } from './user.model';

export type SignatureStatus = 'pending' | 'signed' | 'declined';
export type SignatureType = 'qualified' | 'advanced';

export interface SignatureRequest {
  id: string;
  contractId: string;
  contractTitle: string;
  contractType: string;
  contractValue: number;
  signer: User;
  requestedBy: User;
  status: SignatureStatus;
  requestedAt: Date;
  signedAt?: Date;
  declinedAt?: Date;
  declineReason?: string;
  signatureType: SignatureType;
}
