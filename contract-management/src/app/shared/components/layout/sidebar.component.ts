import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <mat-icon class="logo">description</mat-icon>
        <span class="brand">Contratos</span>
      </div>

      <div class="sidebar-role">
        {{ roleLabel() }}
      </div>

      <mat-nav-list>
        @for (item of navItems(); track item.route) {
          <a mat-list-item [routerLink]="item.route" routerLinkActive="active">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        }
      </mat-nav-list>

      <div class="sidebar-footer">
        <span class="powered">powered by</span>
        <strong>edoclink</strong>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      min-width: 240px;
      background: #1a237e;
      color: white;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #90caf9;
    }

    .brand {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .sidebar-role {
      padding: 12px 16px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255, 255, 255, 0.5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    mat-nav-list {
      flex: 1;
      padding-top: 8px;
    }

    a[mat-list-item] {
      color: rgba(255, 255, 255, 0.7);
      margin: 4px 8px;
      border-radius: 8px;
    }

    a[mat-list-item]:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    a[mat-list-item].active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }

    .sidebar-footer {
      padding: 16px;
      text-align: center;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-footer strong {
      color: #90caf9;
    }
  `]
})
export class SidebarComponent {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  roleLabel = computed(() => {
    const role = this.authService.userRole();
    switch (role) {
      case Role.CREATOR: return 'Criador';
      case Role.MANAGER: return 'Gestão';
      case Role.SIGNER: return 'Assinatura';
      default: return '';
    }
  });

  navItems = computed<NavItem[]>(() => {
    const role = this.authService.userRole();
    switch (role) {
      case Role.CREATOR:
        return [
          { label: 'Painel', icon: 'dashboard', route: '/creator/dashboard' },
          { label: 'Meus Contratos', icon: 'folder', route: '/creator/contracts' },
          { label: 'Novo Contrato', icon: 'add_circle', route: '/creator/contracts/new' }
        ];
      case Role.MANAGER:
        return [
          { label: 'Painel', icon: 'dashboard', route: '/manager/dashboard' },
          { label: 'Aprovações', icon: 'fact_check', route: '/manager/approvals' },
          { label: 'Contratos', icon: 'folder', route: '/manager/contracts' }
        ];
      case Role.SIGNER:
        return [
          { label: 'Pendentes', icon: 'pending_actions', route: '/signer/pending' },
          { label: 'Histórico', icon: 'history', route: '/signer/history' }
        ];
      default: return [];
    }
  });
}
