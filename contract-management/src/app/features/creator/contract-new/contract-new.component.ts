import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';

const FORM_BASE_URL = 'https://linkformsfrontendv8dev-bbgxagdbc4dqa4he.northeurope-01.azurewebsites.net/lfapp/render?id=2';

@Component({
  selector: 'app-contract-new',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="new-page">
      <div class="page-header animate-in">
        <div class="header-left">
          <a routerLink="/app/contracts" class="back">
            <mat-icon>arrow_back</mat-icon> Back to Contracts
          </a>
          <h1>New Contract</h1>
          <p class="subtitle">Fill in the form to start the approval process.</p>
        </div>
        <button mat-icon-button class="refresh-btn" (click)="reload()" title="Reload form">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      <div class="frame-wrap animate-in animate-delay-1">
        @if (loading()) {
          <div class="frame-loading">
            <mat-spinner diameter="36"></mat-spinner>
            <span>Loading form...</span>
          </div>
        }
        <iframe
          [src]="iframeSrc()"
          class="form-frame"
          [class.hidden]="loading()"
          (load)="onLoad()"
          allow="fullscreen"
          title="New Contract Form"
        ></iframe>
      </div>
    </div>
  `,
  styles: [`
    .new-page {
      max-width: 1100px; margin: 0 auto;
      display: flex; flex-direction: column;
      height: calc(100vh - 96px);
    }

    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 16px; flex-shrink: 0;
    }
    .header-left { display: flex; flex-direction: column; gap: 4px; }

    .back {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--text-tertiary); text-decoration: none;
      font-size: 13px; font-weight: 500; transition: color 200ms;
      margin-bottom: 2px;
    }
    .back:hover { color: var(--ch-teal); }
    .back mat-icon { font-size: 18px; width: 18px; height: 18px; }

    h1 { margin: 0; font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
    .subtitle { margin: 0; font-size: 14px; color: var(--text-tertiary); }

    .refresh-btn { color: var(--text-tertiary); }

    .frame-wrap {
      flex: 1; position: relative;
      background: var(--surface-card); border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg); overflow: hidden;
      min-height: 500px;
    }

    .frame-loading {
      position: absolute; inset: 0; z-index: 1;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 14px; color: var(--text-tertiary); font-size: 14px;
      background: var(--surface-card);
    }

    .form-frame { width: 100%; height: 100%; border: none; display: block; }
    .form-frame.hidden { visibility: hidden; }
  `]
})
export class ContractNewComponent {
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);

  private _loading = signal(true);
  private _reloadKey = signal(0);

  loading = this._loading.asReadonly();

  iframeSrc = computed(() => {
    this._reloadKey(); // track for reload
    const token = this.authService.edoclinkToken();
    const url = token ? `${FORM_BASE_URL}&token=${encodeURIComponent(token)}` : FORM_BASE_URL;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  onLoad() {
    this._loading.set(false);
  }

  reload() {
    this._loading.set(true);
    this._reloadKey.update(k => k + 1);
  }
}
