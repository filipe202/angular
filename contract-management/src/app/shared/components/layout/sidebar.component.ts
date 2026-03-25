import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/user.model';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-mark"><mat-icon>hub</mat-icon></div>
        <div class="logo-text">
          <span class="brand">ContractHub</span>
          <span class="sub">Gestão de Contratos</span>
        </div>
      </div>

      <div class="sidebar-role">
        <div class="role-dot"></div>
        {{ roleLabel() }}
      </div>

      <nav class="nav">
        @for (item of navItems(); track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" class="nav-item">
            <div class="nav-icon"><mat-icon>{{ item.icon }}</mat-icon></div>
            <span>{{ item.label }}</span>
            <div class="active-bar"></div>
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="footer-line"></div>
        <span class="powered">powered by</span>
        <span class="edoclink">edoclink</span>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px; min-width: 260px; height: 100%;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      color: white; display: flex; flex-direction: column;
      position: relative; overflow: hidden;
    }
    .sidebar::before {
      content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
      background: radial-gradient(circle at 30% 20%, rgba(99,102,241,0.08) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(139,92,246,0.06) 0%, transparent 50%);
      pointer-events: none;
    }
    .sidebar-header { display: flex; align-items: center; gap: 14px; padding: 24px 20px; position: relative; }
    .logo-mark {
      width: 40px; height: 40px; border-radius: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(99,102,241,0.4);
    }
    .logo-mark mat-icon { font-size: 22px; width: 22px; height: 22px; }
    .logo-text { display: flex; flex-direction: column; }
    .brand { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; color: #f8fafc; }
    .sub { font-size: 11px; color: #64748b; margin-top: 1px; }
    .sidebar-role {
      display: flex; align-items: center; gap: 8px; padding: 10px 20px; margin: 0 12px;
      border-radius: 8px; background: rgba(255,255,255,0.04);
      font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; position: relative;
    }
    .role-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.6); }
    .nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; position: relative; }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px;
      color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500;
      transition: all 200ms cubic-bezier(0.4,0,0.2,1); position: relative; overflow: hidden;
    }
    .nav-item:hover { color: #e2e8f0; background: rgba(255,255,255,0.06); }
    .nav-item.active { color: white; background: rgba(99,102,241,0.15); }
    .nav-item.active .nav-icon {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      box-shadow: 0 2px 8px rgba(99,102,241,0.35);
    }
    .nav-item.active .nav-icon mat-icon { color: white; }
    .active-bar {
      position: absolute; right: -12px; top: 50%; transform: translateY(-50%);
      width: 3px; height: 0; background: #6366f1; border-radius: 3px; transition: height 200ms ease;
    }
    .nav-item.active .active-bar { height: 24px; }
    .nav-icon {
      width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.05); transition: all 200ms ease; flex-shrink: 0;
    }
    .nav-icon mat-icon { font-size: 18px; width: 18px; height: 18px; color: #94a3b8; transition: color 200ms ease; }
    .nav-item:hover .nav-icon { background: rgba(255,255,255,0.08); }
    .nav-item:hover .nav-icon mat-icon { color: #e2e8f0; }
    .sidebar-footer { padding: 16px 20px 20px; text-align: center; position: relative; }
    .footer-line { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); margin-bottom: 16px; }
    .powered { font-size: 10px; color: #475569; letter-spacing: 0.5px; }
    .edoclink {
      font-size: 12px; font-weight: 600; margin-left: 4px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}
  roleLabel = computed(() => {
    switch (this.authService.userRole()) {
      case Role.CREATOR: return 'Criador'; case Role.MANAGER: return 'Gestão'; case Role.SIGNER: return 'Assinatura'; default: return '';
    }
  });
  navItems = computed<NavItem[]>(() => {
    switch (this.authService.userRole()) {
      case Role.CREATOR: return [
        { label: 'Painel', icon: 'space_dashboard', route: '/creator/dashboard' },
        { label: 'Meus Contratos', icon: 'folder_copy', route: '/creator/contracts' },
        { label: 'Novo Contrato', icon: 'note_add', route: '/creator/contracts/new' }
      ];
      case Role.MANAGER: return [
        { label: 'Painel', icon: 'space_dashboard', route: '/manager/dashboard' },
        { label: 'Aprovações', icon: 'task_alt', route: '/manager/approvals' },
        { label: 'Contratos', icon: 'folder_copy', route: '/manager/contracts' }
      ];
      case Role.SIGNER: return [
        { label: 'Pendentes', icon: 'pending_actions', route: '/signer/pending' },
        { label: 'Histórico', icon: 'history', route: '/signer/history' }
      ];
      default: return [];
    }
  });
}
