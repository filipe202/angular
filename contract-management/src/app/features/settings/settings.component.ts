import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1 class="settings-title">Definições</h1>
        <p class="settings-subtitle">Gerir as suas preferências pessoais</p>
      </div>

      <div class="settings-grid">
        @for (card of settingsCards; track card.title) {
          <div class="settings-card" (click)="onCardClick(card)">
            <div class="settings-card-icon" [innerHTML]="card.icon"></div>
            <h3 class="settings-card-title">{{ card.title }}</h3>
            <p class="settings-card-desc">{{ card.description }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 40px 20px 20px;
    }

    .settings-header {
      margin-bottom: 32px;
    }

    .settings-title {
      font-size: 26px;
      font-weight: 700;
      color: var(--gray-800, #1f2937);
      margin: 0 0 6px;
    }

    .settings-subtitle {
      font-size: 15px;
      color: var(--gray-500, #6b7280);
      margin: 0;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 14px;
    }

    .settings-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 28px;
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: var(--glass-blur, blur(12px));
      -webkit-backdrop-filter: var(--glass-blur, blur(12px));
      border: 1px solid var(--glass-border, rgba(10, 186, 181, 0.08));
      border-radius: var(--radius-lg, 14px);
      cursor: pointer;
      transition: all 0.25s;
    }

    .settings-card:hover {
      transform: translateY(-4px);
      border-color: var(--teal-400, #2dd4bf);
      box-shadow: 0 8px 24px rgba(10, 186, 181, 0.12);
    }

    .settings-card-icon {
      color: var(--teal-500, #14b8a6);
      width: 28px;
      height: 28px;
    }

    .settings-card-icon :first-child {
      width: 28px;
      height: 28px;
    }

    .settings-card-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--gray-800, #1f2937);
      margin: 0;
    }

    .settings-card-desc {
      font-size: 13px;
      color: var(--gray-500, #6b7280);
      margin: 0;
      line-height: 1.4;
    }
  `]
})
export class SettingsComponent {
  settingsCards = [
    {
      title: 'Perfil',
      description: 'Nome, email, idioma',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    },
    {
      title: 'Notificações',
      description: 'Gerir alertas e avisos',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
    },
    {
      title: 'Assinaturas',
      description: 'Assinaturas digitais',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
    },
    {
      title: 'Delegações',
      description: 'Delegar tarefas a colegas',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    },
    {
      title: 'Percursos Pessoais',
      description: 'Rotas de workflow favoritas',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    },
    {
      title: 'Templates',
      description: 'Modelos de ficheiros',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    },
    {
      title: 'Textos Pré-definidos',
      description: 'Textos rápidos para etapas',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
    },
    {
      title: 'Favoritos',
      description: 'Gerir lista de favoritos',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    },
    {
      title: 'Etiquetas',
      description: 'Gerir etiquetas pessoais',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    },
  ];

  onCardClick(card: { title: string; description: string; icon: string }) {
    // Navigation to specific settings page would go here
  }
}
