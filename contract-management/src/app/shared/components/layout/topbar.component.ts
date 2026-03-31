import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { EdoclinkStoreService } from '../../../core/services/edoclink-store.service';

@Component({
  selector: 'app-topbar',
  template: `
    <header class="header">
      <div class="search-bar">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Pesquisar documentos, pastas, fluxos..." class="search-input">
        <kbd class="search-kbd">Ctrl+K</kbd>
      </div>
      <div class="header-actions">
        <button class="header-btn notification-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          @if (unreadCount() > 0) {
            <span class="notif-badge">{{ unreadCount() }}</span>
          }
        </button>
        <div class="avatar-area">
          <div class="avatar">{{ initials() }}</div>
          <span class="avatar-name">{{ userName() }}</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: var(--header-height);
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      gap: 16px;
      flex-shrink: 0;
    }
    .search-bar {
      flex: 1;
      max-width: 520px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      width: 18px; height: 18px;
      position: absolute; left: 14px;
      color: var(--teal-500);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 42px;
      border: 2px solid rgba(10, 186, 181, 0.12);
      border-radius: var(--radius-pill);
      font-size: 14px;
      font-family: inherit;
      background: rgba(255,255,255,0.6);
      transition: all 0.25s;
      outline: none;
    }
    .search-input:focus {
      border-color: var(--teal-400);
      background: white;
      box-shadow: 0 0 0 4px rgba(10, 186, 181, 0.08);
    }
    .search-input::placeholder { color: var(--gray-400); }
    .search-kbd {
      position: absolute; right: 12px;
      padding: 3px 8px;
      background: rgba(10, 186, 181, 0.08);
      border: 1px solid rgba(10, 186, 181, 0.15);
      border-radius: 6px;
      font-size: 11px; color: var(--teal-600);
      font-family: inherit; pointer-events: none;
      font-weight: 500;
    }
    .header-actions {
      display: flex; align-items: center; gap: 10px; margin-left: auto;
    }
    .header-btn {
      background: none; border: none; cursor: pointer;
      color: var(--gray-500); position: relative;
      padding: 8px; border-radius: var(--radius-sm);
      transition: all 0.15s;
    }
    .header-btn:hover { background: rgba(10, 186, 181, 0.08); color: var(--teal-600); }
    .notif-badge {
      position: absolute; top: 2px; right: 2px;
      background: linear-gradient(135deg, var(--orange-400), var(--error));
      color: white; font-size: 10px; font-weight: 700;
      padding: 1px 5px; border-radius: 10px;
      min-width: 16px; text-align: center;
      animation: pulse 2s infinite;
    }
    .avatar-area {
      display: flex; align-items: center; gap: 10px;
      cursor: pointer; padding: 5px 10px 5px 5px;
      border-radius: var(--radius-pill);
      transition: background 0.15s;
    }
    .avatar-area:hover { background: rgba(10, 186, 181, 0.08); }
    .avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, var(--teal-400), var(--orange-400));
      color: white; font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 10px rgba(10, 186, 181, 0.25);
    }
    .avatar-name { font-size: 13px; font-weight: 600; color: var(--gray-700); }
  `]
})
export class TopbarComponent {
  private authService = inject(AuthService);
  private store = inject(EdoclinkStoreService);

  userName = computed(() => this.authService.user()?.name ?? 'Filipe Correia');
  initials = computed(() => {
    const name = this.userName();
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  });
  unreadCount = computed(() => this.store.getUnreadNotifications());
}
