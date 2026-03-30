import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AuthService } from './core/auth/auth.service';

const rootRedirect = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return router.parseUrl(auth.isAuthenticated() ? '/app/dashboard' : '/login');
};

export const routes: Routes = [
  { path: '', canActivate: [rootRedirect], children: [] },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',      loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      {
        path: 'contracts',
        children: [
          { path: '', loadComponent: () => import('./features/contracts/contract-list/contract-list.component').then(m => m.ContractListComponent) },
          { path: 'new', loadComponent: () => import('./features/creator/contract-new/contract-new.component').then(m => m.ContractNewComponent) },
          { path: ':id', loadComponent: () => import('./features/contracts/contract-detail/contract-detail.component').then(m => m.ContractDetailComponent) },
        ]
      },
      { path: 'approvals',      loadComponent: () => import('./features/manager/approval-queue/approval-queue.component').then(m => m.ApprovalQueueComponent) },
      { path: 'pending',        loadComponent: () => import('./features/signer/pending-signatures/pending-signatures.component').then(m => m.PendingSignaturesComponent) },
      { path: 'sign/:id',       loadComponent: () => import('./features/signer/sign-contract/sign-contract.component').then(m => m.SignContractComponent) },
      { path: 'history',        loadComponent: () => import('./features/signer/signature-history/signature-history.component').then(m => m.SignatureHistoryComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
