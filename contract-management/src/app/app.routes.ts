import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { Role } from './core/models/user.model';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'creator',
    canActivate: [authGuard, roleGuard([Role.CREATOR])],
    loadComponent: () => import('./shared/components/layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/creator/dashboard/creator-dashboard.component').then(m => m.CreatorDashboardComponent) },
      { path: 'contracts', loadComponent: () => import('./features/creator/contract-list/creator-contract-list.component').then(m => m.CreatorContractListComponent) },
      { path: 'contracts/new', loadComponent: () => import('./features/creator/contract-new/contract-new.component').then(m => m.ContractNewComponent) },
      { path: 'contracts/:id', loadComponent: () => import('./features/creator/contract-detail/creator-contract-detail.component').then(m => m.CreatorContractDetailComponent) }
    ]
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard([Role.MANAGER])],
    loadComponent: () => import('./shared/components/layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/manager/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent) },
      { path: 'approvals', loadComponent: () => import('./features/manager/approval-queue/approval-queue.component').then(m => m.ApprovalQueueComponent) },
      { path: 'contracts', loadComponent: () => import('./features/manager/contract-list/manager-contract-list.component').then(m => m.ManagerContractListComponent) },
      { path: 'contracts/:id', loadComponent: () => import('./features/manager/contract-detail/manager-contract-detail.component').then(m => m.ManagerContractDetailComponent) }
    ]
  },
  {
    path: 'signer',
    canActivate: [authGuard, roleGuard([Role.SIGNER])],
    loadComponent: () => import('./shared/components/layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'pending', pathMatch: 'full' },
      { path: 'pending', loadComponent: () => import('./features/signer/pending-signatures/pending-signatures.component').then(m => m.PendingSignaturesComponent) },
      { path: 'sign/:id', loadComponent: () => import('./features/signer/sign-contract/sign-contract.component').then(m => m.SignContractComponent) },
      { path: 'history', loadComponent: () => import('./features/signer/signature-history/signature-history.component').then(m => m.SignatureHistoryComponent) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
