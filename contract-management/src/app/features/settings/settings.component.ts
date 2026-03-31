import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="page">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your preferences and configurations</p>
      <div class="settings-grid">
        @for (card of settingsCards; track card.title) {
          <div class="settings-card">
            <div class="settings-icon" [innerHTML]="card.icon"></div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 28px 32px; animation: fadeIn 0.3s ease-out; }
    .page-title { font-size: 26px; font-weight: 800; color: var(--gray-900); margin: 0; }
    .page-subtitle { color: var(--gray-500); margin: 4px 0 24px; font-size: 15px; }
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
    .settings-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 28px;
      display: flex; flex-direction: column; gap: 10px;
      transition: all 0.25s; cursor: pointer;
    }
    .settings-card:hover {
      border-color: rgba(10, 186, 181, 0.3);
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }
    .settings-icon { color: var(--teal-500); }
    .settings-card h3 { font-size: 15px; font-weight: 700; color: var(--gray-800); margin: 0; }
    .settings-card p { font-size: 13px; color: var(--gray-500); margin: 0; }
  `]
})
export class SettingsComponent {
  settingsCards = [
    { title: 'Profile', description: 'Name, email, role', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { title: 'Notifications', description: 'Alerts and email preferences', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>' },
    { title: 'List Columns', description: 'Configure visible fields per list', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
    { title: 'Approval Rules', description: 'Default workflow steps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>' },
    { title: 'Signatures', description: 'Digital signature settings', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>' },
    { title: 'Templates', description: 'Contract document templates', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
    { title: 'Departments', description: 'Manage departments & teams', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>' },
    { title: 'Integrations', description: 'edoclink API & connections', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
    { title: 'Security', description: 'Authentication & access control', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' },
  ];
}
