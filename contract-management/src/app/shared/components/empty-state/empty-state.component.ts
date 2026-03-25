import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  template: `
    <div class="empty">
      <mat-icon>{{ icon() }}</mat-icon>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty {
      text-align: center;
      padding: 48px 24px;
      color: #999;
    }

    mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #E0E0E0;
    }

    h3 {
      margin: 16px 0 8px;
      color: #666;
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class EmptyStateComponent {
  icon = input('folder_open');
  title = input('Sem resultados');
  message = input('Não foram encontrados itens.');
}
