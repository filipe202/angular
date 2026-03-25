import { Injectable, signal, computed } from '@angular/core';
import { Contract, ContractStatus } from '../models/contract.model';
import { MOCK_CONTRACTS } from '../mock/contracts.mock';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private contracts = signal<Contract[]>(MOCK_CONTRACTS);

  allContracts = this.contracts.asReadonly();

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
    return computed(() => this.contracts().filter(c =>
      c.status === ContractStatus.PENDING_APPROVAL || c.status === ContractStatus.IN_REVIEW
    ));
  }

  getExpiringContracts(days: number) {
    return computed(() => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      return this.contracts().filter(c =>
        c.status === ContractStatus.ACTIVE && c.endDate <= futureDate && c.endDate >= now
      );
    });
  }

  approveContract(id: string, comments?: string): void {
    this.contracts.update(contracts =>
      contracts.map(c => c.id === id ? { ...c, status: ContractStatus.APPROVED, updatedAt: new Date() } : c)
    );
  }

  rejectContract(id: string, reason: string): void {
    this.contracts.update(contracts =>
      contracts.map(c => c.id === id ? { ...c, status: ContractStatus.REJECTED, rejectionReason: reason, updatedAt: new Date() } : c)
    );
  }
}
