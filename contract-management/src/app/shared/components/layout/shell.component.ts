import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="shell">
      <app-sidebar />
      <div class="main">
        <app-topbar />
        <div class="content"><router-outlet /></div>
      </div>
    </div>
  `,
  styles: [`
    .shell { display: flex; height: 100vh; overflow: hidden; background: var(--surface-bg); }
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
    .content { flex: 1; overflow-y: auto; padding: 28px 32px; background: var(--surface-bg); }
  `]
})
export class ShellComponent {}
