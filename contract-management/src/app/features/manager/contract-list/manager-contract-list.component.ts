import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ContractService } from '../../../core/services/contract.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { ContractStatus, ContractType, CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manager-contract-list',
  imports: [RouterLink, FormsModule, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, MatSortModule, StatusBadgeComponent, CurrencyPtPipe],
  template: `
    <div class="contract-list">
      <div class="header">
        <h2>Todos os Contratos</h2>
        <span class="count">{{ filteredContracts().length }} resultados</span>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <div class="filters">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Pesquisar</mat-label>
            <input matInput [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Título, parte, departamento...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
              <mat-option [value]="''">Todos</mat-option>
              @for (s of statuses; track s) {
                <mat-option [value]="s">{{ getStatusLabel(s) }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <mat-select [ngModel]="typeFilter()" (ngModelChange)="typeFilter.set($event)">
              <mat-option [value]="''">Todos</mat-option>
              @for (t of types; track t) {
                <mat-option [value]="t">{{ getTypeLabel(t) }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Table -->
      <mat-card>
        <table mat-table [dataSource]="filteredContracts()" class="contracts-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let c">
              <a [routerLink]="'/manager/contracts/' + c.id" class="title-link">{{ c.title }}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let c">{{ getTypeLabel(c.type) }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let c"><app-status-badge [status]="c.status" /></td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Valor</th>
            <td mat-cell *matCellDef="let c">{{ c.value | currencyPt }}</td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Departamento</th>
            <td mat-cell *matCellDef="let c">{{ c.department }}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let c">{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .contract-list { max-width: 1200px; }
    .header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
    h2 { margin: 0; font-weight: 400; }
    .count { color: #888; font-size: 14px; }

    .filters-card { margin-bottom: 16px; padding: 16px; }
    .filters { display: flex; gap: 12px; flex-wrap: wrap; }
    .search-field { flex: 1; min-width: 250px; }

    .contracts-table { width: 100%; }
    .title-link { color: #1a237e; text-decoration: none; font-weight: 500; }
    .title-link:hover { text-decoration: underline; }
    .table-row:hover { background: #fafafa; }
    td { font-size: 14px; }
  `]
})
export class ManagerContractListComponent {
  constructor(private contractService: ContractService) {}

  searchTerm = signal('');
  statusFilter = signal('');
  typeFilter = signal('');

  displayedColumns = ['title', 'type', 'status', 'value', 'department', 'date'];
  statuses = Object.values(ContractStatus);
  types = Object.values(ContractType);

  filteredContracts = computed(() => {
    let contracts = this.contractService.allContracts();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const type = this.typeFilter();

    if (search) {
      contracts = contracts.filter(c =>
        c.title.toLowerCase().includes(search) ||
        c.department?.toLowerCase().includes(search) ||
        c.parties.some(p => p.name.toLowerCase().includes(search))
      );
    }
    if (status) contracts = contracts.filter(c => c.status === status);
    if (type) contracts = contracts.filter(c => c.type === type);
    return contracts;
  });

  getStatusLabel(status: any) { return (CONTRACT_STATUS_LABELS as any)[status] ?? status; }
  getTypeLabel(type: any) { return (CONTRACT_TYPE_LABELS as any)[type] ?? type; }
}
