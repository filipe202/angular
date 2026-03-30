import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatTableModule, StatusBadgeComponent, CurrencyPtPipe],
  template: `
    <div class="page">
      <div class="page-header animate-in">
        <div>
          <h1>Meus Contratos</h1>
          <p class="subtitle">{{ filtered().length }} contratos encontrados</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/creator/contracts/new">
          <mat-icon>add</mat-icon> Novo Contrato
        </a>
      </div>

      <div class="filters animate-in animate-delay-1">
        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <mat-option [value]="''">Todos</mat-option>
            @for (s of statuses; track s) { <mat-option [value]="s">{{ getStatusLabel(s) }}</mat-option> }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="table-wrap animate-in animate-delay-2">
        <table mat-table [dataSource]="filtered()">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let c">
              <a [routerLink]="'/creator/contracts/' + c.id" class="title-link">{{ c.title }}</a>
            </td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let c"><span class="type-tag">{{ getTypeLabel(c.type) }}</span></td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let c"><app-status-badge [status]="c.status" /></td>
          </ng-container>
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Valor</th>
            <td mat-cell *matCellDef="let c" class="val-cell">{{ c.value | currencyPt }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let c">{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 960px; margin: 0 auto; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }

    .filters {
      padding: 12px 18px; margin-bottom: 14px;
      background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
    }

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
export class CreatorContractListComponent {
  constructor(private authService: AuthService, private contractService: ContractService) {
    this.contractService.loadAll();
  }

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
