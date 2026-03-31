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
      { path: 'home',       loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'documents',  loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent) },
      { path: 'folders',    loadComponent: () => import('./features/folders/folders.component').then(m => m.FoldersComponent) },
      { path: 'flows',      loadComponent: () => import('./features/flows/flows.component').then(m => m.FlowsComponent) },
      { path: 'dashboard',  loadComponent: () => import('./features/edoc-dashboard/edoc-dashboard.component').then(m => m.EdocDashboardComponent) },
      { path: 'search',     loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent) },
      { path: 'settings',   loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      // Legacy routes - redirect to new structure
      { path: 'contracts',  redirectTo: 'documents', pathMatch: 'full' },
      { path: 'approvals',  redirectTo: 'flows', pathMatch: 'full' },
      { path: 'pending',    redirectTo: 'flows', pathMatch: 'full' },
      { path: 'history',    redirectTo: 'flows', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
