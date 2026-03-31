import { Component } from '@angular/core';
import { ManagerDashboardComponent } from '../manager/dashboard/manager-dashboard.component';

@Component({
  selector: 'app-dashboard',
  imports: [ManagerDashboardComponent],
  template: `<app-manager-dashboard />`
})
export class DashboardComponent {}
