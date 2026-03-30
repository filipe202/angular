import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavItem { label: string; icon: string; route: string; }

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  icon: 'space_dashboard',  route: '/app/dashboard' },
  { label: 'Contracts',  icon: 'folder_copy',      route: '/app/contracts' },
  { label: 'Approvals',  icon: 'task_alt',          route: '/app/approvals' },
  { label: 'Pending',    icon: 'pending_actions',   route: '/app/pending' },
  { label: 'History',    icon: 'history',           route: '/app/history' },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-top">
        <a routerLink="/app/dashboard" class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 28 28" fill="none">
              <rect x="3" y="1" width="15" height="21" rx="2" stroke="white" stroke-width="1.4" fill="none"/>
              <rect x="8" y="5" width="15" height="21" rx="2" stroke="white" stroke-width="1.4" fill="rgba(255,255,255,0.15)"/>
              <path d="M12 12h8M12 15.5h5.5M12 19h8" stroke="white" stroke-width="1" stroke-linecap="round"/>
              <circle cx="21" cy="22" r="4.5" fill="#0d9488" stroke="white" stroke-width="1.3"/>
              <path d="M19.2 22l1.2 1.2L22.8 21" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">ContractHub</span>
            <span class="logo-sub">edoclink</span>
          </div>
        </a>
      </div>

      <nav class="nav">
        <div class="nav-label">Menu</div>
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" class="nav-item">
            <mat-icon>{{ item.icon }}</mat-icon>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="sidebar-bottom">
        <div class="env-badge">
          <div class="env-dot"></div>
          Live
        </div>
        <div class="powered-by">
          <span class="by-text">powered by</span>
          <span class="by-brand">edoclink</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar { width: 240px; min-width: 240px; height: 100%; background: var(--ch-navy); color: white; display: flex; flex-direction: column; border-right: 1px solid rgba(255,255,255,0.04); }
    .sidebar-top { padding: 20px 16px 16px; }
    .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; color: white; padding: 6px 8px; border-radius: var(--radius-md); transition: background var(--t-fast); }
    .logo:hover { background: rgba(255,255,255,0.04); }
    .logo-icon { width: 36px; height: 36px; flex-shrink: 0; }
    .logo-icon svg { width: 100%; height: 100%; }
    .logo-text { display: flex; flex-direction: column; line-height: 1; }
    .logo-name { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: #f1f5f9; }
    .logo-sub { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--ch-teal); margin-top: 3px; }
    .nav { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
    .nav-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.2); padding: 8px 10px 6px; margin-bottom: 2px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--radius-sm); color: rgba(255,255,255,0.45); text-decoration: none; font-size: 13.5px; font-weight: 500; transition: all 200ms var(--ease-out); position: relative; }
    .nav-item mat-icon { font-size: 19px; width: 19px; height: 19px; transition: color 200ms; }
    .nav-item:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
    .nav-item.active { color: white; background: rgba(13,148,136,0.15); }
    .nav-item.active mat-icon { color: var(--ch-teal-light); }
    .nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 18px; border-radius: 0 3px 3px 0; background: var(--ch-teal); }
    .sidebar-bottom { padding: 16px 20px 20px; border-top: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .env-badge { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.25); padding: 4px 10px; border-radius: var(--radius-full); background: rgba(255,255,255,0.03); }
    .env-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ch-teal); box-shadow: 0 0 6px rgba(13,148,136,0.5); }
    .powered-by { display: flex; align-items: center; gap: 5px; }
    .by-text { font-size: 10px; color: rgba(255,255,255,0.15); }
    .by-brand { font-size: 11px; font-weight: 700; color: var(--ch-teal); opacity: 0.7; }
  `]
})
export class SidebarComponent {
  navItems = NAV_ITEMS;
}
