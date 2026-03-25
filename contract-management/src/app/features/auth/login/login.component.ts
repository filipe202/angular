import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="login-page">
      <!-- Animated background -->
      <div class="bg-effects">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="grid-overlay"></div>
      </div>

      <div class="login-card">
        <div class="card-inner">
          <!-- Logo -->
          <div class="logo-section">
            <div class="logo-icon">
              <mat-icon>hub</mat-icon>
            </div>
            <h1>ContractHub</h1>
            <p class="subtitle">Sistema de Gestão de Contratos</p>
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

          <div class="demo-divider">
            <span>acesso rápido</span>
          </div>

          <div class="demo-buttons">
            <button class="demo-btn" (click)="loginAs('creator')">
              <div class="demo-icon creator"><mat-icon>edit_note</mat-icon></div>
              <span class="demo-label">Criador</span>
              <span class="demo-desc">Cria contratos</span>
            </button>
            <button class="demo-btn" (click)="loginAs('manager')">
              <div class="demo-icon manager"><mat-icon>analytics</mat-icon></div>
              <span class="demo-label">Gestor</span>
              <span class="demo-desc">Gere e aprova</span>
            </button>
            <button class="demo-btn" (click)="loginAs('signer')">
              <div class="demo-icon signer"><mat-icon>draw</mat-icon></div>
              <span class="demo-label">Signatário</span>
              <span class="demo-desc">Assina documentos</span>
            </button>
          </div>

          <p class="footer-text">powered by <strong>edoclink</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #0f172a; position: relative; overflow: hidden;
    }

    .bg-effects { position: absolute; inset: 0; pointer-events: none; }
    .orb {
      position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5;
      animation: float 20s ease-in-out infinite;
    }
    .orb-1 { width: 500px; height: 500px; background: #6366f1; top: -10%; left: -5%; animation-delay: 0s; }
    .orb-2 { width: 400px; height: 400px; background: #8b5cf6; bottom: -10%; right: -5%; animation-delay: -7s; }
    .orb-3 { width: 300px; height: 300px; background: #06b6d4; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: -14s; }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -30px) scale(1.05); }
      50% { transform: translate(-20px, 20px) scale(0.95); }
      75% { transform: translate(10px, -10px) scale(1.02); }
    }

    .grid-overlay {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .login-card {
      position: relative; width: 100%; max-width: 440px;
      background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
      border-radius: 24px; border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 25px 50px rgba(0,0,0,0.3), 0 0 100px rgba(99,102,241,0.1);
      animation: fadeInUp 0.6s ease-out;
    }

    .card-inner { padding: 40px 36px; }

    .logo-section { text-align: center; margin-bottom: 32px; }
    .logo-icon {
      width: 56px; height: 56px; margin: 0 auto 16px; border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    }
    .logo-icon mat-icon { font-size: 28px; width: 28px; height: 28px; color: white; }
    h1 { margin: 0; font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: #64748b; }

    .field { width: 100%; }

    .error-banner {
      display: flex; align-items: center; gap: 8px; padding: 12px 16px; margin-bottom: 16px;
      background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #dc2626; font-size: 13px;
    }

    .login-btn {
      width: 100%; height: 48px; font-size: 15px !important; font-weight: 600 !important;
      border-radius: 12px !important; margin-top: 4px;
    }

    .demo-divider {
      display: flex; align-items: center; gap: 16px; margin: 28px 0 20px;
    }
    .demo-divider::before, .demo-divider::after {
      content: ''; flex: 1; height: 1px; background: #e2e8f0;
    }
    .demo-divider span { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }

    .demo-buttons { display: flex; gap: 10px; }
    .demo-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 16px 8px; border: 1px solid #e2e8f0; border-radius: 14px;
      background: #f8fafc; cursor: pointer; transition: all 200ms ease;
    }
    .demo-btn:hover { border-color: #6366f1; background: #f5f3ff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,102,241,0.15); }

    .demo-icon {
      width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
    }
    .demo-icon mat-icon { font-size: 20px; width: 20px; height: 20px; color: white; }
    .demo-icon.creator { background: linear-gradient(135deg, #3b82f6, #6366f1); }
    .demo-icon.manager { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
    .demo-icon.signer { background: linear-gradient(135deg, #06b6d4, #0ea5e9); }

    .demo-label { font-size: 13px; font-weight: 600; color: #1e293b; }
    .demo-desc { font-size: 10px; color: #94a3b8; }

    .footer-text { text-align: center; margin: 24px 0 0; font-size: 12px; color: #94a3b8; }
    .footer-text strong { color: #6366f1; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
