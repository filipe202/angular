import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-page">
      <!-- Left panel: branded -->
      <div class="brand-panel">
        <div class="brand-bg">
          <div class="geo geo-1"></div>
          <div class="geo geo-2"></div>
          <div class="geo geo-3"></div>
          <svg class="seal" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            <circle cx="100" cy="100" r="75" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
            <text x="100" y="95" text-anchor="middle" fill="rgba(255,255,255,0.06)" font-size="11" font-weight="700" letter-spacing="4">CONTRACTHUB</text>
            <text x="100" y="112" text-anchor="middle" fill="rgba(255,255,255,0.04)" font-size="8" letter-spacing="2">GESTÃO DE CONTRATOS</text>
          </svg>
        </div>
        <div class="brand-content">
          <div class="logo-mark">
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="4" y="2" width="18" height="24" rx="2" stroke="white" stroke-width="1.5" fill="none"/>
              <rect x="10" y="6" width="18" height="24" rx="2" stroke="white" stroke-width="1.5" fill="rgba(255,255,255,0.1)"/>
              <path d="M14 14h10M14 18h7M14 22h10" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
              <circle cx="24" cy="26" r="5" fill="#0d9488" stroke="white" stroke-width="1.5"/>
              <path d="M22 26l1.5 1.5L26 25" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="brand-title">ContractHub</h1>
          <p class="brand-tagline">Plataforma de Gestão de Contratos</p>

          <div class="brand-features">
            <div class="feature">
              <div class="feature-icon"><mat-icon>verified</mat-icon></div>
              <div>
                <span class="feature-title">Workflows de Aprovação</span>
                <span class="feature-desc">Aprovação multi-nível configurável</span>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon"><mat-icon>draw</mat-icon></div>
              <div>
                <span class="feature-title">Assinatura Digital</span>
                <span class="feature-desc">Assinatura qualificada integrada</span>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon"><mat-icon>monitoring</mat-icon></div>
              <div>
                <span class="feature-title">Dashboards & KPIs</span>
                <span class="feature-desc">Visão completa do ciclo contratual</span>
              </div>
            </div>
          </div>

          <div class="brand-footer">
            <span class="powered">powered by</span>
            <span class="edoclink-logo">edoclink</span>
          </div>
        </div>
      </div>

      <!-- Right panel: form -->
      <div class="form-panel">
        <div class="form-content">
          <div class="form-header">
            <h2>Bem-vindo</h2>
            <p>Inicie sessão para continuar</p>
          </div>

          @if (error()) {
            <div class="error-banner">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error() }}</span>
            </div>
          }

          <mat-form-field appearance="outline" class="field">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="email" placeholder="seu.email&#64;empresa.pt">
            <mat-icon matPrefix>mail_outline</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="field">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword() ? 'password' : 'text'" [(ngModel)]="password">
            <mat-icon matPrefix>lock_outline</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button mat-raised-button color="primary" class="login-btn" (click)="onLogin()">
            Entrar
          </button>

          <div class="divider"><span>acesso demo</span></div>

          <div class="role-cards">
            <button class="role-card" (click)="loginAs('creator')">
              <div class="role-icon creator">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/>
                </svg>
              </div>
              <span class="role-name">Criador</span>
              <span class="role-desc">Cria e submete contratos</span>
            </button>
            <button class="role-card" (click)="loginAs('manager')">
              <div class="role-icon manager">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M9 5H2v7l6.29 6.29a1 1 0 001.42 0l5.58-5.58a1 1 0 000-1.42L9 5z"/><circle cx="6" cy="9" r="1" fill="currentColor"/>
                  <path d="M15 4l6.29 6.29a1 1 0 010 1.42L16 17"/>
                </svg>
              </div>
              <span class="role-name">Gestor</span>
              <span class="role-desc">Revê, aprova e gere</span>
            </button>
            <button class="role-card" (click)="loginAs('signer')">
              <div class="role-icon signer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <span class="role-name">Signatário</span>
              <span class="role-desc">Visualiza e assina</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh; display: flex;
    }

    /* ── LEFT BRAND PANEL ── */
    .brand-panel {
      flex: 0 0 480px; position: relative; overflow: hidden;
      background: linear-gradient(160deg, var(--ch-navy) 0%, #0f1b30 40%, #0a2520 100%);
      display: flex; flex-direction: column; justify-content: center;
      padding: 60px;
    }
    .brand-bg { position: absolute; inset: 0; pointer-events: none; }
    .geo {
      position: absolute; border-radius: 50%;
      opacity: 0.07;
    }
    .geo-1 { width: 600px; height: 600px; background: var(--ch-teal); top: -200px; right: -200px; }
    .geo-2 { width: 400px; height: 400px; background: var(--ch-amber); bottom: -100px; left: -100px; }
    .geo-3 { width: 200px; height: 200px; background: var(--ch-teal-light); top: 60%; right: 20%; }

    .seal {
      position: absolute; width: 280px; height: 280px;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      animation: sealSpin 120s linear infinite;
    }

    .brand-content { position: relative; z-index: 1; }
    .logo-mark {
      width: 56px; height: 56px; margin-bottom: 24px;
    }
    .logo-mark svg { width: 100%; height: 100%; }
    .brand-title {
      margin: 0; font-size: 32px; font-weight: 800; color: white;
      letter-spacing: -0.03em;
    }
    .brand-tagline {
      margin: 6px 0 0; font-size: 15px; color: rgba(255,255,255,0.45);
      font-weight: 400;
    }

    .brand-features { margin-top: 48px; display: flex; flex-direction: column; gap: 20px; }
    .feature {
      display: flex; align-items: center; gap: 14px;
    }
    .feature-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .feature-icon mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ch-teal-light); }
    .feature-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); display: block; }
    .feature-desc { font-size: 12px; color: rgba(255,255,255,0.35); display: block; margin-top: 1px; }

    .brand-footer {
      position: absolute; bottom: 40px; left: 60px;
      display: flex; align-items: center; gap: 6px;
    }
    .powered { font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 0.5px; }
    .edoclink-logo { font-size: 13px; font-weight: 700; color: var(--ch-teal); }

    /* ── RIGHT FORM PANEL ── */
    .form-panel {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: var(--surface-bg);
      padding: 40px;
    }
    .form-content { width: 100%; max-width: 380px; }
    .form-header { margin-bottom: 32px; }
    .form-header h2 {
      margin: 0; font-size: 26px; font-weight: 800; color: var(--text-primary);
      letter-spacing: -0.03em;
    }
    .form-header p { margin: 6px 0 0; font-size: 15px; color: var(--text-tertiary); }

    .field { width: 100%; }

    .error-banner {
      display: flex; align-items: center; gap: 8px; padding: 12px 16px; margin-bottom: 16px;
      background: rgba(232, 93, 74, 0.06); border: 1px solid rgba(232, 93, 74, 0.15);
      border-radius: var(--radius-md); color: var(--ch-coral); font-size: 13px;
    }

    .login-btn {
      width: 100%; height: 48px; font-size: 15px !important; font-weight: 700 !important;
      border-radius: var(--radius-md) !important; margin-top: 4px;
      letter-spacing: 0.01em !important;
    }

    .divider {
      display: flex; align-items: center; gap: 14px; margin: 28px 0 20px;
    }
    .divider::before, .divider::after {
      content: ''; flex: 1; height: 1px; background: var(--border-light);
    }
    .divider span { font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1.5px; white-space: nowrap; font-weight: 500; }

    .role-cards { display: flex; gap: 10px; }
    .role-card {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 18px 10px 16px; border: 1px solid var(--border-light); border-radius: var(--radius-lg);
      background: var(--surface-card); cursor: pointer;
      transition: all 250ms var(--ease-out);
    }
    .role-card:hover {
      border-color: var(--ch-teal); background: var(--surface-tinted);
      transform: translateY(-3px); box-shadow: var(--shadow-teal);
    }
    .role-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      transition: transform 250ms var(--ease-spring);
    }
    .role-card:hover .role-icon { transform: scale(1.1); }
    .role-icon svg { width: 22px; height: 22px; }
    .role-icon.creator { background: linear-gradient(135deg, #0d9488, #14b8a6); color: white; }
    .role-icon.manager { background: linear-gradient(135deg, var(--ch-amber), #e5b820); color: white; }
    .role-icon.signer { background: linear-gradient(135deg, #7c5cfc, #9b7dfc); color: white; }
    .role-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .role-desc { font-size: 10px; color: var(--text-tertiary); text-align: center; line-height: 1.3; }
  `]
})
export class LoginComponent {
  email = ''; password = '';
  error = signal(''); hidePassword = signal(true);

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) { this.router.navigate([this.authService.getRedirectRoute()]); }
  }

  onLogin() {
    if (!this.email || !this.password) { this.error.set('Preencha o email e a password.'); return; }
    if (this.authService.login(this.email, this.password)) {
      this.router.navigate([this.authService.getRedirectRoute()]);
    } else { this.error.set('Credenciais inválidas. Use os botões de acesso rápido.'); }
  }

  loginAs(role: string) {
    const r = role === 'creator' ? Role.CREATOR : role === 'manager' ? Role.MANAGER : Role.SIGNER;
    this.authService.loginAs(r);
    this.router.navigate([this.authService.getRedirectRoute()]);
  }
}
