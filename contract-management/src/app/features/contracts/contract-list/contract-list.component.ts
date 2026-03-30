import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ContractService } from '../../../core/services/contract.service';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-contract-list',
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, CurrencyPtPipe],
  template: `
    <div class="page">
      <div class="page-header animate-in">
        <div>
          <h1>Contracts</h1>
          <p class="subtitle">{{ filtered().length }} contracts found</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/app/contracts/new">
          <mat-icon>add</mat-icon> New Contract
        </a>
      </div>

      <div class="filters animate-in animate-delay-1">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Title, department, code...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <mat-option value="">All</mat-option>
            @for (s of availableStatuses(); track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select [ngModel]="typeFilter()" (ngModelChange)="typeFilter.set($event)">
            <mat-option value="">All</mat-option>
            @for (t of availableTypes(); track t) {
              <mat-option [value]="t">{{ t }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="table-wrap animate-in animate-delay-2">
        <table mat-table [dataSource]="filtered()">

          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let c">
              @if (c.edoclinkCode) {
                <span class="code-badge">{{ c.edoclinkCode }}</span>
              } @else {
                <span class="muted">—</span>
              }
            </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let c">
              <a [routerLink]="'/app/contracts/' + c.id" class="title-link">{{ c.title }}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let c">
              @if (c.rawType) {
                <span class="type-tag">{{ c.rawType }}</span>
              } @else {
                <span class="muted">—</span>
              }
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c">
              <span class="status-badge status-{{ (c.rawStatus || '').toLowerCase() }}">{{ c.rawStatus || '—' }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="stage">
            <th mat-header-cell *matHeaderCellDef>Current Stage</th>
            <td mat-cell *matCellDef="let c">
              @if (c.currentStageName) {
                <span class="stage-chip">{{ c.currentStageName }}</span>
              } @else {
                <span class="muted">—</span>
              }
            </td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Value</th>
            <td mat-cell *matCellDef="let c" class="val-cell">
              @if (c.value) { {{ c.value | currencyPt }} } @else { — }
            </td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let c">{{ c.department || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let c">{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"
              class="data-row"
              [routerLink]="'/app/contracts/' + row.id"
              style="cursor:pointer"></tr>
        </table>

        @if (filtered().length === 0 && !isLoading()) {
          <div class="empty">
            <mat-icon>folder_open</mat-icon>
            <p>No contracts found</p>
          </div>
        }
        @if (isLoading()) {
          <div class="empty"><p>Loading...</p></div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { margin: 4px 0 0; font-size: 14px; color: var(--text-tertiary); }
    .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; padding: 14px 18px; background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); }
    .search-field { flex: 1; min-width: 220px; }
    .table-wrap { background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden; }
    table { width: 100%; }
    .data-row:hover { background: var(--surface-tinted) !important; }
    .title-link { color: var(--ch-teal); text-decoration: none; font-weight: 600; font-size: 13px; }
    .title-link:hover { text-decoration: underline; }
    .muted { color: var(--text-tertiary); font-size: 13px; }
    .code-badge {
      font-size: 11px; font-weight: 700; font-family: monospace;
      color: var(--text-secondary); background: var(--surface-muted);
      border: 1px solid var(--border-subtle); padding: 2px 8px; border-radius: var(--radius-full);
    }
    .type-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ch-teal); background: var(--ch-teal-subtle); padding: 2px 8px; border-radius: var(--radius-full); white-space: nowrap; }
    .stage-chip { font-size: 11px; font-weight: 600; color: var(--ch-amber); background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.15); padding: 2px 8px; border-radius: var(--radius-full); white-space: nowrap; }
    .val-cell { font-weight: 700 !important; color: var(--text-primary) !important; }
    .empty { text-align: center; padding: 40px; color: var(--text-tertiary); }
    .empty mat-icon { font-size: 40px; width: 40px; height: 40px; display: block; margin: 0 auto 8px; }

    /* Dynamic status colours */
    .status-badge { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: var(--radius-full); border: 1px solid transparent; white-space: nowrap; }
    .status-pending   { color: #92400e; background: #fef3c7; border-color: #fde68a; }
    .status-dispatched { color: #065f46; background: #d1fae5; border-color: #6ee7b7; }
    .status-canceled  { color: #7f1d1d; background: #fee2e2; border-color: #fca5a5; }
    .status-suspended { color: #581c87; background: #f3e8ff; border-color: #d8b4fe; }
    .status-edition   { color: #1e3a5f; background: #dbeafe; border-color: #93c5fd; }
  `]
})
export class ContractListComponent {
  readonly columns = ['code', 'title', 'type', 'status', 'stage', 'value', 'department', 'date'];
  isLoading = computed(() => false);

  searchTerm = signal('');
  statusFilter = signal('');
  typeFilter = signal('');

  constructor(private contractService: ContractService) {
    this.contractService.loadAll();
    this.isLoading = this.contractService.isLoading;
  }

  filtered = computed(() => {
    let list = this.contractService.allContracts();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const type = this.typeFilter();
    if (search) list = list.filter(c =>
      c.title.toLowerCase().includes(search) ||
      c.department?.toLowerCase().includes(search) ||
      c.edoclinkCode?.toLowerCase().includes(search) ||
      c.rawType?.toLowerCase().includes(search)
    );
    if (status) list = list.filter(c => c.rawStatus === status);
    if (type) list = list.filter(c => c.rawType === type);
    return list;
  });

  availableStatuses = computed(() =>
    [...new Set(this.contractService.allContracts().map(c => c.rawStatus).filter(Boolean))] as string[]
  );

  availableTypes = computed(() =>
    [...new Set(this.contractService.allContracts().map(c => c.rawType).filter(Boolean))] as string[]
  );
}
