import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../core/auth/auth.service';
import { ContractService } from '../../../core/services/contract.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';
import { ContractStatus, CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from '../../../core/models/contract.model';

@Component({
  selector: 'app-creator-contract-list',
  imports: [RouterLink, DatePipe, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatTableModule, StatusBadgeComponent, CurrencyPtPipe],
  template: `
    <div class="list">
      <div class="header">
        <h2>Meus Contratos</h2>
        <a mat-raised-button color="primary" routerLink="/creator/contracts/new">
          <mat-icon>add</mat-icon> Novo
        </a>
      </div>

      <mat-card class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <mat-option [value]="''">Todos</mat-option>
            @for (s of statuses; track s) {
              <mat-option [value]="s">{{ getStatusLabel(s) }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </mat-card>

      <mat-card>
        <table mat-table [dataSource]="filtered()" class="table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let c">
              <a [routerLink]="'/creator/contracts/' + c.id" class="link">{{ c.title }}</a>
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
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let c">{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .list { max-width: 1000px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    h2 { margin: 0; font-weight: 400; }
    .filters { padding: 16px; margin-bottom: 16px; }
    .table { width: 100%; }
    .link { color: #1a237e; text-decoration: none; font-weight: 500; }
    .link:hover { text-decoration: underline; }
  `]
})
export class CreatorContractListComponent {
  constructor(private authService: AuthService, private contractService: ContractService) {}

  statusFilter = signal('');
  columns = ['title', 'type', 'status', 'value', 'date'];
  statuses = Object.values(ContractStatus);

  private userId = computed(() => this.authService.user()?.id ?? '');
  private myContracts = computed(() => this.contractService.getContractsByCreator(this.userId())());

  filtered = computed(() => {
    const status = this.statusFilter();
    if (!status) return this.myContracts();
    return this.myContracts().filter(c => c.status === status);
  });

  getStatusLabel(s: any) { return (CONTRACT_STATUS_LABELS as any)[s] ?? s; }
  getTypeLabel(t: any) { return (CONTRACT_TYPE_LABELS as any)[t] ?? t; }
}
