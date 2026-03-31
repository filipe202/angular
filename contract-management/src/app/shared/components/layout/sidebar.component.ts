import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem { label: string; icon: string; route: string; badge?: string; }

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <a routerLink="/app/home" class="sidebar-logo-link">
          <svg class="sidebar-logo-icon" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="2" width="18" height="24" rx="2" stroke="white" stroke-width="1.5" fill="none"/>
            <rect x="10" y="6" width="18" height="24" rx="2" stroke="white" stroke-width="1.5" fill="rgba(255,255,255,0.15)"/>
            <path d="M14 14h10M14 18h7M14 22h10" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
            <circle cx="24" cy="26" r="5" fill="#067A77" stroke="white" stroke-width="1.5"/>
            <path d="M22 26l1.5 1.5L26 25" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="sidebar-logo-text">
            <span class="brand-name">ContractHub</span>
            <span class="brand-sub">powered by edoclink</span>
          </div>
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Main</div>
        @for (item of mainNav; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{exact: item.route === '/app/home'}" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @switch (item.icon) {
                @case ('home') { <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/> }
                @case ('contracts') { <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/> }
                @case ('new') { <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/> }
              }
            </svg>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        }

        <div class="nav-separator"></div>
        <div class="nav-section-label">Tasks</div>

        @for (item of taskNav; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @switch (item.icon) {
                @case ('approvals') { <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/> }
                @case ('signatures') { <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/> }
              }
            </svg>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        }

        <div class="nav-separator"></div>
        <div class="nav-section-label">Analytics</div>
        <a routerLink="/app/dashboard" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span class="nav-label">Dashboard</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <a routerLink="/app/settings" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span class="nav-label">Settings</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      background: var(--sidebar-gradient);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      z-index: 100;
      box-shadow: 4px 0 30px rgba(10, 186, 181, 0.15);
    }
    .sidebar-header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      padding: 0 18px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .sidebar-logo-link {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; color: white;
    }
    .sidebar-logo-icon { width: 28px; height: 28px; flex-shrink: 0; }
    .sidebar-logo-text { display: flex; flex-direction: column; line-height: 1; }
    .brand-name { font-size: 16px; font-weight: 800; color: white; letter-spacing: -0.02em; }
    .brand-sub { font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.5); margin-top: 3px; letter-spacing: 0.5px; }
    .sidebar-nav {
      flex: 1; padding: 12px 10px; display: flex;
      flex-direction: column; gap: 2px; overflow-y: auto;
    }
    .nav-section-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1.5px; color: rgba(255,255,255,0.25);
      padding: 10px 14px 4px; margin-top: 2px;
    }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px; border-radius: var(--radius-md);
      color: rgba(255,255,255,0.7); font-size: 13.5px;
      font-weight: 500; transition: all 0.2s; text-decoration: none;
    }
    .nav-item:hover { background: rgba(255,255,255,0.12); color: white; }
    .nav-item.active {
      background: rgba(255,255,255,0.18); color: white;
      font-weight: 600; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
    }
    .nav-icon { width: 19px; height: 19px; flex-shrink: 0; }
    .nav-label { white-space: nowrap; }
    .nav-separator { height: 1px; background: rgba(255,255,255,0.1); margin: 6px 14px; }
    .sidebar-footer { padding: 10px; border-top: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class SidebarComponent {
  mainNav: NavItem[] = [
    { label: 'Home',        icon: 'home',      route: '/app/home' },
    { label: 'Contracts',   icon: 'contracts',  route: '/app/contracts' },
    { label: 'New Contract', icon: 'new',       route: '/app/contracts/new' },
  ];
  taskNav: NavItem[] = [
    { label: 'Approvals',   icon: 'approvals',  route: '/app/approvals' },
    { label: 'Signatures',  icon: 'signatures', route: '/app/signatures' },
  ];
}
