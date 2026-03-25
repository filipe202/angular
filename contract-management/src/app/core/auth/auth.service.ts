import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Role, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => this.currentUser() !== null);
  userRole = computed(() => this.currentUser()?.role ?? null);

  private mockUsers: Record<string, User> = {
    'creator': { id: 'u1', name: 'João Silva', email: 'joao.silva@empresa.pt', role: Role.CREATOR, department: 'Compras' },
    'manager': { id: 'u2', name: 'Maria Santos', email: 'maria.santos@empresa.pt', role: Role.MANAGER, department: 'Jurídico' },
    'signer': { id: 'u3', name: 'Pedro Nunes', email: 'pedro.nunes@empresa.pt', role: Role.SIGNER, department: 'Direção' }
  };

  constructor(private router: Router) {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUser.set(JSON.parse(saved));
    }
  }

  login(email: string, _password: string): boolean {
    // Mock login - in production, this would call edoclink auth API
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
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getRedirectRoute(): string {
    const role = this.currentUser()?.role;
    switch (role) {
      case Role.CREATOR: return '/creator/dashboard';
      case Role.MANAGER: return '/manager/dashboard';
      case Role.SIGNER: return '/signer/pending';
      default: return '/login';
    }
  }
}
