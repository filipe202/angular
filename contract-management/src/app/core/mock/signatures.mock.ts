import { SignatureRequest } from '../models/signature.model';
import { MOCK_USERS } from './contracts.mock';

export const MOCK_SIGNATURE_REQUESTS: SignatureRequest[] = [
  {
    id: 's1', contractId: 'c8', contractTitle: 'Contrato Arrendamento Armazém Norte',
    contractType: 'Arrendamento', contractValue: 36000,
    signer: MOCK_USERS[2], requestedBy: MOCK_USERS[1],
    status: 'pending', requestedAt: new Date(Date.now() - 2 * 3600000), signatureType: 'qualified'
  },
  {
    id: 's2', contractId: 'c9', contractTitle: 'Consultoria Jurídica Especializada',
    contractType: 'Consultoria', contractValue: 25000,
    signer: MOCK_USERS[2], requestedBy: MOCK_USERS[1],
    status: 'signed', requestedAt: new Date(Date.now() - 48 * 3600000),
    signedAt: new Date(Date.now() - 24 * 3600000), signatureType: 'qualified'
  },
  {
    id: 's3', contractId: 'c5', contractTitle: 'Manutenção Equipamentos Industriais',
    contractType: 'Serviço', contractValue: 15000,
    signer: MOCK_USERS[2], requestedBy: MOCK_USERS[1],
    status: 'pending', requestedAt: new Date(Date.now() - 24 * 3600000), signatureType: 'advanced'
  }
];
