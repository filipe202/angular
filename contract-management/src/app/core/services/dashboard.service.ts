import { Injectable, signal } from '@angular/core';
import { DashboardKPIs } from '../models/dashboard.model';
import { MOCK_DASHBOARD_KPIS } from '../mock/dashboard.mock';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private kpis = signal<DashboardKPIs>(MOCK_DASHBOARD_KPIS);

  dashboardKPIs = this.kpis.asReadonly();
}
