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
      <div class="search-wrap">
        <mat-icon class="search-icon">search</mat-icon>
        <input type="text" placeholder="Pesquisar contratos...">
        <div class="search-shortcut">
          <kbd>/</kbd>
        </div>
      </div>
      <div class="topbar-right">
        <button mat-icon-button class="notif-btn" matBadge="3" matBadgeColor="warn" matBadgeSize="small">
          <mat-icon>notifications_none</mat-icon>
        </button>
        <div class="sep"></div>
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-trigger">
          <div class="user-avatar">{{ initials() }}</div>
          <div class="user-meta">
            <span class="user-name">{{ userName() }}</span>
            <span class="user-dept">{{ userDept() }}</span>
          </div>
          <mat-icon class="caret">unfold_more</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="menu-head">
            <div class="menu-head-avatar">{{ initials() }}</div>
            <div>
              <div class="menu-head-name">{{ userName() }}</div>
              <div class="menu-head-email">{{ userEmail() }}</div>
            </div>
          </div>
          <mat-divider />
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon><span>Terminar sessão</span>
          </button>
        </mat-menu>
      </div>
    </div>
  `,
  styles: [`
    .topbar {
      display: flex; align-items: center; height: 56px; padding: 0 24px;
      background: var(--surface-card);
      border-bottom: 1px solid var(--border-subtle);
      gap: 16px;
    }
    .search-wrap {
      display: flex; align-items: center; gap: 8px;
      flex: 1; max-width: 400px; height: 36px; padding: 0 12px;
      background: var(--surface-bg); border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      transition: all var(--t-fast);
    }
    .search-wrap:focus-within {
      border-color: var(--ch-teal);
      box-shadow: 0 0 0 3px rgba(13,148,136,0.08);
      background: var(--surface-card);
    }
    .search-icon { font-size: 17px; width: 17px; height: 17px; color: var(--text-tertiary); }
    .search-wrap input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 13px; color: var(--text-primary); font-family: var(--font-sans);
    }
    .search-wrap input::placeholder { color: var(--text-tertiary); }
    .search-shortcut kbd {
      font-size: 11px; padding: 1px 6px;
      background: var(--surface-card); border: 1px solid var(--border-light);
      border-radius: 4px; color: var(--text-tertiary);
      font-family: var(--font-sans); font-weight: 500;
    }

    .topbar-right { display: flex; align-items: center; gap: 6px; margin-left: auto; }
    .notif-btn { color: var(--text-tertiary); }
    .notif-btn:hover { color: var(--text-secondary); }
    .sep { width: 1px; height: 20px; background: var(--border-light); margin: 0 4px; }

    .user-trigger {
      display: flex !important; align-items: center; gap: 8px;
      padding: 4px 8px 4px 4px !important; border-radius: var(--radius-sm) !important;
      height: auto !important; line-height: normal !important;
    }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--ch-navy);
      color: var(--ch-teal-light); font-size: 11px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      letter-spacing: 0.5px;
    }
    .user-meta { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; }
    .user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .user-dept { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
    .caret { font-size: 16px !important; width: 16px !important; height: 16px !important; color: var(--text-tertiary); }

    .menu-head { display: flex; gap: 10px; align-items: center; padding: 12px 16px; }
    .menu-head-avatar {
      width: 36px; height: 36px; border-radius: 8px;
      background: var(--ch-navy); color: var(--ch-teal-light);
      font-size: 12px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .menu-head-name { font-weight: 600; font-size: 14px; color: var(--text-primary); }
    .menu-head-email { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }
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
