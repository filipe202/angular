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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="logo-section">
            <mat-icon class="logo-icon">description</mat-icon>
            <h1>Gestão de Contratos</h1>
          </div>
        </mat-card-header>

        <mat-card-content>
          @if (error()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              {{ error() }}
            </div>
          }

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="email" placeholder="seu.email@empresa.pt">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword() ? 'password' : 'text'" [(ngModel)]="password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width login-btn" (click)="onLogin()">
            ENTRAR
          </button>

          <mat-divider class="divider" />

          <p class="demo-label">Acesso rápido (demo)</p>
          <div class="demo-buttons">
            <button mat-stroked-button (click)="loginAs('creator')">
              <mat-icon>edit_note</mat-icon>
              Criador
            </button>
            <button mat-stroked-button (click)="loginAs('manager')">
              <mat-icon>dashboard</mat-icon>
              Gestor
            </button>
            <button mat-stroked-button (click)="loginAs('signer')">
              <mat-icon>draw</mat-icon>
              Signatário
            </button>
          </div>
        </mat-card-content>

        <mat-card-footer>
          <p class="powered-by">powered by <strong>edoclink</strong></p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
      border-radius: 16px;
    }

    mat-card-header {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }

    .logo-section {
      text-align: center;
      width: 100%;
    }

    .logo-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1a237e;
    }

    .logo-section h1 {
      margin: 8px 0 0;
      font-size: 24px;
      font-weight: 500;
      color: #1a237e;
    }

    .full-width {
      width: 100%;
    }

    .login-btn {
      height: 48px;
      font-size: 16px;
      margin-top: 8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      margin-bottom: 16px;
      background: #ffebee;
      color: #c62828;
      border-radius: 8px;
      font-size: 14px;
    }

    .divider {
      margin: 24px 0;
    }

    .demo-label {
      text-align: center;
      color: #666;
      font-size: 13px;
      margin-bottom: 12px;
    }

    .demo-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .demo-buttons button {
      flex: 1;
      font-size: 12px;
    }

    .demo-buttons mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }

    mat-card-footer {
      padding: 16px 0 0;
    }

    .powered-by {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin: 0;
    }

    .powered-by strong {
      color: #1a237e;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  hidePassword = signal(true);

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.authService.getRedirectRoute()]);
    }
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.error.set('Preencha o email e a password.');
      return;
    }
    const success = this.authService.login(this.email, this.password);
    if (success) {
      this.router.navigate([this.authService.getRedirectRoute()]);
    } else {
      this.error.set('Credenciais inválidas. Utilize os botões de acesso rápido para demo.');
    }
  }

  loginAs(role: string): void {
    const roleEnum = role === 'creator' ? Role.CREATOR : role === 'manager' ? Role.MANAGER : Role.SIGNER;
    this.authService.loginAs(roleEnum);
    this.router.navigate([this.authService.getRedirectRoute()]);
  }
}
