import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ContractService } from '../../../core/services/contract.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { ContractStatus, ContractType, CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manager-contract-list',
  imports: [RouterLink, FormsModule, DatePipe, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, StatusBadgeComponent, CurrencyPtPipe],
  template: `
    <div class="page">
      <div class="page-header animate-in">
        <div>
          <h1>Todos os Contratos</h1>
          <p class="subtitle">Pesquise e filtre o portfolio completo</p>
        </div>
        <span class="result-count">{{ filteredContracts().length }} contratos</span>
      </div>

      <!-- Filters -->
      <div class="filters animate-in animate-delay-1">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Pesquisar</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Título, parte, departamento...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <mat-option [value]="''">Todos</mat-option>
            @for (s of statuses; track s) { <mat-option [value]="s">{{ getStatusLabel(s) }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select [ngModel]="typeFilter()" (ngModelChange)="typeFilter.set($event)">
            <mat-option [value]="''">Todos</mat-option>
            @for (t of types; track t) { <mat-option [value]="t">{{ getTypeLabel(t) }}</mat-option> }
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Table -->
      <div class="table-wrap animate-in animate-delay-2">
        <table mat-table [dataSource]="filteredContracts()">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let c">
              <a [routerLink]="'/manager/contracts/' + c.id" class="title-link">{{ c.title }}</a>
            </td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let c">
              <span class="type-tag">{{ getTypeLabel(c.type) }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let c"><app-status-badge [status]="c.status" /></td>
          </ng-container>
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Valor</th>
            <td mat-cell *matCellDef="let c" class="val-cell">{{ c.value | currencyPt }}</td>
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
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; }

    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }
    .result-count { font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: var(--radius-full); background: var(--surface-muted); color: var(--text-tertiary); }

    .filters {
      display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px;
      padding: 14px 18px; background: var(--surface-card);
      border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
    }
    .search-field { flex: 1; min-width: 220px; }

    .table-wrap {
      background: var(--surface-card); border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle); overflow: hidden;
    }
    table { width: 100%; }

    .title-link { color: var(--ch-teal); text-decoration: none; font-weight: 600; font-size: 13px; }
    .title-link:hover { text-decoration: underline; }

    .type-tag {
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
      color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 2px 8px; border-radius: var(--radius-full);
    }
    .val-cell { font-weight: 700 !important; color: var(--text-primary) !important; }
  `]
})
export class ManagerContractListComponent {
  constructor(private contractService: ContractService) {
    this.contractService.loadAll();
  }

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
