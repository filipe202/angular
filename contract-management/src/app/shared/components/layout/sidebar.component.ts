import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem { label: string; icon: string; route: string; }

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
          <span class="sidebar-logo-text">edoclink</span>
        </a>
      </div>

      <nav class="sidebar-nav">
        @for (item of mainNav; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{exact: item.route === '/app/home'}" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @switch (item.icon) {
                @case ('home') { <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/> }
                @case ('documents') { <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/> }
                @case ('folders') { <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/> }
                @case ('flows') { <circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="14"/><circle cx="12" cy="19" r="3"/><path d="M12 14l-6 2m6-2l6 2"/> }
                @case ('dashboard') { <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/> }
                @case ('search') { <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/> }
              }
            </svg>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        }
        <div class="nav-separator"></div>
        <a routerLink="/app/search" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span class="nav-label">Pesquisa</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <a routerLink="/app/settings" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span class="nav-label">Definições</span>
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
      padding: 0 22px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .sidebar-logo-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: white;
    }
    .sidebar-logo-icon { width: 28px; height: 28px; }
    .sidebar-logo-text {
      font-size: 18px;
      font-weight: 800;
      color: white;
      letter-spacing: -0.02em;
    }
    .sidebar-nav {
      flex: 1;
      padding: 16px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: var(--radius-md);
      color: rgba(255,255,255,0.75);
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.15);
      color: white;
    }
    .nav-item.active {
      background: rgba(255,255,255,0.2);
      color: white;
      font-weight: 600;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
    }
    .nav-icon { width: 20px; height: 20px; flex-shrink: 0; }
    .nav-label { white-space: nowrap; }
    .nav-separator {
      height: 1px;
      background: rgba(255,255,255,0.12);
      margin: 10px 14px;
    }
    .sidebar-footer {
      padding: 10px;
      border-top: 1px solid rgba(255,255,255,0.12);
    }
  `]
})
export class SidebarComponent {
  mainNav: NavItem[] = [
    { label: 'Início',      icon: 'home',      route: '/app/home' },
    { label: 'Documentos',  icon: 'documents', route: '/app/documents' },
    { label: 'Pastas',      icon: 'folders',   route: '/app/folders' },
    { label: 'Fluxos',      icon: 'flows',     route: '/app/flows' },
    { label: 'Dashboard',   icon: 'dashboard', route: '/app/dashboard' },
  ];
}
