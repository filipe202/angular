import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AuthService } from './core/auth/auth.service';

const rootRedirect = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return router.parseUrl(auth.isAuthenticated() ? '/app/home' : '/login');
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
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home',        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      {
        path: 'contracts',
        children: [
          { path: '',    loadComponent: () => import('./features/contracts/contract-list/contract-list.component').then(m => m.ContractListComponent) },
          { path: 'new', loadComponent: () => import('./features/contracts/contract-new/contract-new.component').then(m => m.ContractNewComponent) },
          { path: ':id', loadComponent: () => import('./features/contracts/contract-detail/contract-detail.component').then(m => m.ContractDetailComponent) },
        ]
      },
      { path: 'approvals',   loadComponent: () => import('./features/approvals/approval-queue.component').then(m => m.ApprovalQueueComponent) },
      { path: 'signatures',  loadComponent: () => import('./features/signatures/pending-signatures.component').then(m => m.PendingSignaturesComponent) },
      { path: 'dashboard',   loadComponent: () => import('./features/edoc-dashboard/edoc-dashboard.component').then(m => m.EdocDashboardComponent) },
      { path: 'settings',    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
