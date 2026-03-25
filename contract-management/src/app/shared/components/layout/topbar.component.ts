import { Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule, MatButtonModule, MatBadgeModule, MatMenuModule, MatDividerModule],
  template: `
    <div class="topbar">
      <div class="search-bar">
        <mat-icon>search</mat-icon>
        <input type="text" placeholder="Pesquisar contratos, partes, documentos...">
        <span class="shortcut">⌘K</span>
      </div>
      <div class="topbar-actions">
        <button mat-icon-button class="action-btn" matBadge="3" matBadgeColor="warn" matBadgeSize="small">
          <mat-icon>notifications_none</mat-icon>
        </button>
        <div class="divider-v"></div>
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
          <div class="avatar">{{ initials() }}</div>
          <div class="user-info">
            <span class="user-name">{{ userName() }}</span>
            <span class="user-dept">{{ userDept() }}</span>
          </div>
          <mat-icon class="chevron">expand_more</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="menu-header">
            <div class="menu-avatar">{{ initials() }}</div>
            <div><div class="menu-name">{{ userName() }}</div><div class="menu-email">{{ userEmail() }}</div></div>
          </div>
          <mat-divider />
          <button mat-menu-item (click)="logout()"><mat-icon>logout</mat-icon><span>Terminar sessão</span></button>
        </mat-menu>
      </div>
    </div>
  `,
  styles: [`
    .topbar { display: flex; align-items: center; height: 64px; padding: 0 24px; background: var(--surface-card); border-bottom: 1px solid var(--border-subtle); gap: 16px; }
    .search-bar {
      display: flex; align-items: center; gap: 10px; flex: 1; max-width: 480px; height: 40px; padding: 0 14px;
      background: var(--surface-bg); border: 1px solid var(--border-light); border-radius: 10px; transition: all var(--transition-fast);
    }
    .search-bar:focus-within { border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
    .search-bar mat-icon { font-size: 18px; color: var(--text-tertiary); }
    .search-bar input { flex: 1; border: none; outline: none; background: transparent; font-size: 14px; color: var(--text-primary); }
    .search-bar input::placeholder { color: var(--text-tertiary); }
    .shortcut { font-size: 11px; padding: 2px 6px; background: var(--surface-card); border: 1px solid var(--border-light); border-radius: 4px; color: var(--text-tertiary); font-family: monospace; }
    .topbar-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .action-btn { color: var(--text-secondary); }
    .divider-v { width: 1px; height: 24px; background: var(--border-light); margin: 0 4px; }
    .user-btn { display: flex; align-items: center; gap: 10px; padding: 4px 8px 4px 4px; border-radius: 10px; }
    .avatar {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center;
    }
    .user-info { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; }
    .user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .user-dept { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
    .chevron { font-size: 18px !important; width: 18px !important; height: 18px !important; color: var(--text-tertiary); }
    .menu-header { display: flex; gap: 12px; align-items: center; padding: 12px 16px; }
    .menu-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .menu-name { font-weight: 600; font-size: 14px; }
    .menu-email { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }
  `]
})
export class TopbarComponent {
  constructor(private authService: AuthService) {}
  userName = computed(() => this.authService.user()?.name ?? '');
  userEmail = computed(() => this.authService.user()?.email ?? '');
  userDept = computed(() => this.authService.user()?.department ?? '');
  initials = computed(() => this.userName().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());
  logout() { this.authService.logout(); }
}
