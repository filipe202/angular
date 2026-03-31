import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <main class="main-area">
        <app-topbar />
        <div class="page-content"><router-outlet /></div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; overflow: hidden; }
    .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
    .page-content { flex: 1; overflow-y: auto; overflow-x: hidden; }
  `]
})
export class ShellComponent {}
