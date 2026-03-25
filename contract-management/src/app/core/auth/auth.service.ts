import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Role, User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => this.currentUser() !== null);
  userRole = computed(() => this.currentUser()?.role ?? null);
  token = signal<string | null>(null);

  // Mock users for demo mode (when Keycloak is not available)
  private mockUsers: Record<string, User> = {
    'creator': { id: 'u1', name: 'João Silva', email: 'joao.silva@capwatt.com', role: Role.CREATOR, department: 'Compras' },
    'manager': { id: 'u2', name: 'Maria Santos', email: 'maria.santos@capwatt.com', role: Role.MANAGER, department: 'Jurídico' },
    'signer': { id: 'u3', name: 'Pedro Nunes', email: 'pedro.nunes@capwatt.com', role: Role.SIGNER, department: 'Direção' }
  };

  constructor(private router: Router, private keycloakService: KeycloakService) {}

  /**
   * Initialize from Keycloak session if available.
   * Called during APP_INITIALIZER.
   */
  async initFromKeycloak(): Promise<void> {
    try {
      const isLoggedIn = this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const profile = await this.keycloakService.loadUserProfile();
        const roles = this.keycloakService.getUserRoles();
        const token = await this.keycloakService.getToken();

        const role = this.mapKeycloakRole(roles);
        const user: User = {
          id: profile.id ?? profile.username ?? '',
          name: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim(),
          email: profile.email ?? '',
          role,
          department: (profile.attributes as any)?.['department']?.[0] ?? undefined
        };

        this.currentUser.set(user);
        this.token.set(token);
      }
    } catch (e) {
      console.warn('Keycloak not available, using demo mode:', e);
      // Fallback to demo mode - load from localStorage
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        this.currentUser.set(JSON.parse(saved));
      }
    }
  }

  /**
   * Map Keycloak client roles to application roles.
   * Expected roles on the 'edoc' client: 'creator', 'manager', 'signer'
   */
  private mapKeycloakRole(roles: string[]): Role {
    if (roles.includes('manager') || roles.includes('gestor')) return Role.MANAGER;
    if (roles.includes('signer') || roles.includes('signatario')) return Role.SIGNER;
    if (roles.includes('creator') || roles.includes('criador')) return Role.CREATOR;
    // Default: if user has no specific role, treat as signer (read-only)
    return Role.SIGNER;
  }

  /**
   * Keycloak login - redirects to Keycloak login page
   */
  async keycloakLogin(): Promise<void> {
    await this.keycloakService.login({
      redirectUri: window.location.origin + '/auth-callback'
    });
  }

  /**
   * Keycloak logout
   */
  async keycloakLogout(): Promise<void> {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('currentUser');
    await this.keycloakService.logout(window.location.origin + '/login');
  }

  // === Demo mode methods (when Keycloak unavailable) ===

  login(email: string, _password: string): boolean {
    const role = email.includes('criador') || email.includes('joao') ? 'creator'
      : email.includes('gestor') || email.includes('maria') ? 'manager'
      : email.includes('signatario') || email.includes('pedro') ? 'signer'
      : null;

    if (role && this.mockUsers[role]) {
      const user = this.mockUsers[role];
      this.currentUser.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  loginAs(role: Role): void {
    const roleKey = role === Role.CREATOR ? 'creator' : role === Role.MANAGER ? 'manager' : 'signer';
    const user = this.mockUsers[roleKey];
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    if (environment.keycloak.enabled) {
      this.keycloakLogout();
    } else {
      this.currentUser.set(null);
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
  }

  getRedirectRoute(): string {
    const role = this.currentUser()?.role;
    switch (role) {
      case Role.CREATOR: return '/creator/dashboard';
      case Role.MANAGER: return '/manager/dashboard';
      case Role.SIGNER: return '/signer/dashboard';
      default: return '/login';
    }
  }
}
