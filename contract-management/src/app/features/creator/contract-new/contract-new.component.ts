import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contract-new',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="new-contract">
      <a routerLink="/creator/dashboard" class="back-link">
        <mat-icon>arrow_back</mat-icon> Voltar ao Painel
      </a>

      <h2>Novo Contrato</h2>

      <mat-card class="iframe-container">
        <div class="iframe-wrapper">
          <div class="iframe-placeholder">
            <mat-icon>description</mat-icon>
            <h3>Formulário edoclink</h3>
            <p>
              O formulário de criação do contrato é gerido pelo edoclink.<br>
              Todos os campos, validações e lógica de negócio são controlados pela plataforma edoclink.
            </p>
            <p class="hint">
              Ao submeter o formulário, o contrato entra automaticamente no workflow de aprovação.
            </p>
            <div class="iframe-mock">
              <span class="mock-label">IFRAME EDOCLINK</span>
              <span class="mock-url">edoclink.empresa.pt/contracts/new</span>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .new-contract { max-width: 900px; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; color: #666; text-decoration: none; margin-bottom: 16px; font-size: 14px; }
    .back-link:hover { color: #1a237e; }
    h2 { margin: 0 0 24px; font-weight: 400; }

    .iframe-container { padding: 0; overflow: hidden; }
    .iframe-wrapper { min-height: 500px; display: flex; }

    .iframe-placeholder {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 48px; text-align: center; color: #666;
      background: repeating-linear-gradient(45deg, #fafafa, #fafafa 10px, #f5f5f5 10px, #f5f5f5 20px);
    }

    .iframe-placeholder mat-icon { font-size: 64px; width: 64px; height: 64px; color: #1a237e; opacity: 0.5; }
    .iframe-placeholder h3 { color: #1a237e; margin: 16px 0 8px; }
    .iframe-placeholder p { max-width: 400px; line-height: 1.6; }
    .hint { font-size: 13px; color: #999; font-style: italic; }

    .iframe-mock {
      margin-top: 24px; padding: 16px 32px;
      border: 2px dashed #ccc; border-radius: 8px;
      display: flex; flex-direction: column; gap: 4px;
    }
    .mock-label { font-size: 11px; letter-spacing: 2px; color: #999; text-transform: uppercase; }
    .mock-url { font-size: 13px; color: #1a237e; font-family: monospace; }
  `]
})
export class ContractNewComponent {}
