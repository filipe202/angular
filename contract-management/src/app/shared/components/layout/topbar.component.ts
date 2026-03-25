import { Component, computed } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule, MatMenuModule],
  template: `
    <mat-toolbar class="topbar">
      <span class="spacer"></span>

      <button mat-icon-button matBadge="3" matBadgeColor="warn" matBadgeSize="small">
        <mat-icon>notifications</mat-icon>
      </button>

      <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
        <mat-icon>account_circle</mat-icon>
        <span class="user-name">{{ userName() }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item disabled>
          <mat-icon>email</mat-icon>
          <span>{{ userEmail() }}</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Sair</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .topbar {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      height: 56px;
      padding: 0 16px;
    }

    .spacer {
      flex: 1;
    }

    .user-btn {
      margin-left: 8px;
    }

    .user-name {
      margin: 0 4px;
      font-size: 14px;
    }
  `]
})
export class TopbarComponent {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  userName = computed(() => this.authService.user()?.name ?? '');
  userEmail = computed(() => this.authService.user()?.email ?? '');

  logout(): void {
    this.authService.logout();
  }
}
