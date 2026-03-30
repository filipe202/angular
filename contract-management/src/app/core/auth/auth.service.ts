import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { EdoclinkApiService } from '../services/edoclink-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private edoclinkApi = inject(EdoclinkApiService);
  private keycloak = environment.keycloak.enabled ? inject(Keycloak) : null;

  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => this.currentUser() !== null);
  token = signal<string | null>(null);
  edoclinkToken = signal<string | null>(null);

  async init(): Promise<void> {
    const kc = this.keycloak;

    if (kc) {
      try {
        const authenticated = await kc.init({
          onLoad: 'login-required',
          checkLoginIframe: false,
        });
        if (authenticated) {
          await this.loadKeycloakUser(kc);
        }
      } catch (e) {
        console.warn('Keycloak init failed:', e);
      }
    }

    // Fallback: restore from localStorage (demo mode)
    if (!this.currentUser()) {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        try { this.currentUser.set(JSON.parse(saved)); } catch { /* ignore */ }
      }
    }
  }

  private async loadKeycloakUser(kc: Keycloak): Promise<void> {
    await kc.loadUserProfile();
    const profile = kc.profile ?? {};

    const user: User = {
      id: kc.subject ?? profile.id ?? '',
      name: (`${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || (profile as any).username) ?? kc.subject ?? '',
      email: profile.email ?? '',
      department: (profile.attributes as any)?.['department']?.[0],
    };

    console.log('[AuthService] logged in:', user.name, user.email);
    this.currentUser.set(user);
    this.token.set(kc.token ?? null);

    try {
      const edocToken = await firstValueFrom(this.edoclinkApi.getSessionToken());
      this.edoclinkToken.set(edocToken);
    } catch (e) {
      console.warn('Could not fetch edoclink session token:', e);
    }
  }

  async keycloakLogout(): Promise<void> {
    this.currentUser.set(null);
    this.token.set(null);
    this.edoclinkToken.set(null);
    localStorage.removeItem('currentUser');
    await this.keycloak?.logout({ redirectUri: window.location.origin + '/login' });
  }

  // Demo mode — quick login without Keycloak
  loginDemo(name: string): void {
    const user: User = { id: 'demo', name, email: name + '@demo.local' };
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    if (environment.keycloak.enabled && this.keycloak?.authenticated) {
      this.keycloakLogout();
    } else {
      this.currentUser.set(null);
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
  }

  getRedirectRoute(): string {
    return this.currentUser() ? '/app/dashboard' : '/login';
  }
}
