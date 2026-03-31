import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-logo-area">
          <svg class="login-logo" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="2" width="18" height="24" rx="2" stroke="white" stroke-width="1.5" fill="none"/>
            <rect x="10" y="6" width="18" height="24" rx="2" stroke="white" stroke-width="1.5" fill="rgba(255,255,255,0.1)"/>
            <path d="M14 14h10M14 18h7M14 22h10" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
            <circle cx="24" cy="26" r="5" fill="#0d9488" stroke="white" stroke-width="1.5"/>
            <path d="M22 26l1.5 1.5L26 25" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h1 class="login-brand">edoclink</h1>
          <p class="login-tagline">Gestão documental inteligente</p>
        </div>
        <div class="login-card">
          <h2>Bem-vindo de volta</h2>
          <p class="login-subtitle">Introduza as suas credenciais para continuar</p>

          @if (error()) {
            <div class="error-banner">
              <span>{{ error() }}</span>
            </div>
          }

          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="nome&#64;empresa.pt" [(ngModel)]="email" name="email">
            </div>
            <div class="form-group">
              <label for="password">Palavra-passe</label>
              <input type="password" id="password" placeholder="••••••••" [(ngModel)]="password" name="password">
            </div>

            @if (keycloakEnabled) {
              <button type="button" class="btn-primary btn-full" (click)="onKeycloakLogin()" [disabled]="redirecting()">
                @if (redirecting()) {
                  Redirecting...
                } @else {
                  Entrar com Keycloak SSO
                }
              </button>
            } @else {
              <button type="submit" class="btn-primary btn-full">Entrar</button>
            }
          </form>

          <p class="login-footer">Protegido por <strong>Keycloak SSO</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Full-screen gradient background ── */
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--hero-gradient, linear-gradient(135deg, #0d9488 0%, #14b8a6 30%, #f59e0b 70%, #f97316 100%));
      position: relative;
      overflow: hidden;
    }

    /* ── Floating animated circles ── */
    .login-page::before,
    .login-page::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      opacity: 0.15;
      pointer-events: none;
    }

    .login-page::before {
      width: 500px;
      height: 500px;
      background: rgba(255, 255, 255, 0.2);
      top: -120px;
      right: -100px;
      animation: floatCircle 18s ease-in-out infinite;
    }

    .login-page::after {
      width: 350px;
      height: 350px;
      background: rgba(255, 255, 255, 0.15);
      bottom: -80px;
      left: -60px;
      animation: floatCircle 22s ease-in-out infinite reverse;
    }

    @keyframes floatCircle {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -40px) scale(1.05); }
      50% { transform: translate(-20px, 20px) scale(0.95); }
      75% { transform: translate(15px, 35px) scale(1.03); }
    }

    /* ── Centered container ── */
    .login-container {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 420px;
      padding: 24px;
    }

    /* ── Logo area ── */
    .login-logo-area {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-logo {
      width: 56px;
      height: 56px;
      margin-bottom: 16px;
    }

    .login-brand {
      margin: 0;
      font-size: 32px;
      font-weight: 800;
      color: white;
      letter-spacing: -0.03em;
    }

    .login-tagline {
      margin: 6px 0 0;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 400;
    }

    /* ── Glass card ── */
    .login-card {
      width: 100%;
      padding: 36px 32px;
      background: var(--glass-bg, rgba(255, 255, 255, 0.12));
      backdrop-filter: blur(var(--glass-blur, 20px));
      -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      border-radius: var(--radius-xl, 20px);
      box-shadow: var(--shadow-xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
    }

    .login-card h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.02em;
    }

    .login-subtitle {
      margin: 6px 0 24px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }

    /* ── Error banner ── */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      background: rgba(232, 93, 74, 0.15);
      border: 1px solid rgba(232, 93, 74, 0.3);
      border-radius: var(--radius-sm, 8px);
      color: #fca5a5;
      font-size: 13px;
    }

    /* ── Form ── */
    .form-group {
      margin-bottom: 18px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
    }

    .form-group input {
      width: 100%;
      padding: 12px 14px;
      font-size: 14px;
      color: white;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--teal-500, #0d9488);
      border-radius: var(--radius-sm, 8px);
      outline: none;
      transition: border-color 200ms ease, box-shadow 200ms ease;
      box-sizing: border-box;
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    .form-group input:focus {
      border-color: #14b8a6;
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.25);
    }

    /* ── Primary button ── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      margin-top: 6px;
      font-size: 15px;
      font-weight: 700;
      color: white;
      background: linear-gradient(135deg, var(--teal-500, #0d9488), #14b8a6);
      border: none;
      border-radius: var(--radius-sm, 8px);
      cursor: pointer;
      letter-spacing: 0.01em;
      transition: opacity 200ms ease, transform 150ms ease;
    }

    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-full {
      width: 100%;
    }

    /* ── Footer ── */
    .login-footer {
      margin: 24px 0 0;
      text-align: center;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
    }

    .login-footer strong {
      color: rgba(255, 255, 255, 0.6);
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  hidePassword = signal(true);
  redirecting = signal(false);

  readonly keycloakEnabled = environment.keycloak.enabled;

  constructor(private authService: AuthService, private router: Router) {
    // If already authenticated (demo mode quick-login or session restore), go to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.authService.getRedirectRoute()]);
    }
    // With Keycloak login-required, we should never reach here unauthenticated —
    // provideKeycloak's own initializer redirects to Keycloak before Angular boots.
  }

  async onKeycloakLogin() {
    this.redirecting.set(true);
    // With login-required, reloading the page triggers Keycloak redirect
    window.location.href = window.location.origin;
  }

  onLogin() {
    if (!this.email) {
      this.error.set('Por favor introduza o seu email.');
      return;
    }
    this.authService.loginDemo(this.email);
    this.router.navigate([this.authService.getRedirectRoute()]);
  }

  loginDemo() {
    this.authService.loginDemo('Demo User');
    this.router.navigate([this.authService.getRedirectRoute()]);
  }
}
