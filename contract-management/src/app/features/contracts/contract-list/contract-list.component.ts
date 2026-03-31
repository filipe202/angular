import { Component, computed, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// Uses Contract type from EdoclinkStoreService
import { EdoclinkStoreService } from '../../../core/services/edoclink-store.service';


interface ColumnDef {
  key: string;
  label: string;
  alwaysVisible: boolean;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: 'code',       label: 'Code',        alwaysVisible: true },
  { key: 'title',      label: 'Title',       alwaysVisible: true },
  { key: 'type',       label: 'Type',        alwaysVisible: false },
  { key: 'status',     label: 'Status',      alwaysVisible: true },
  { key: 'value',      label: 'Value',       alwaysVisible: false },
  { key: 'department', label: 'Department',  alwaysVisible: false },
  { key: 'startDate',  label: 'Start Date',  alwaysVisible: false },
  { key: 'endDate',    label: 'End Date',    alwaysVisible: false },
  { key: 'createdBy',  label: 'Created By',  alwaysVisible: false },
  { key: 'parties',    label: 'Parties',     alwaysVisible: false },
  { key: 'tags',       label: 'Tags',        alwaysVisible: false },
];

const DEFAULT_VISIBLE = ['code', 'title', 'type', 'status', 'value', 'department', 'endDate'];
const STORAGE_KEY = 'contract-columns-config';

const STATUS_FILTERS = [
  'All', 'Draft', 'Pending Approval', 'In Review', 'Active',
  'Pending Signature', 'Signed', 'Expired', 'Rejected', 'Cancelled',
] as const;

const STATUS_FILTER_MAP: Record<string, string | null> = {
  'All':               null,
  'Draft':             'Draft',
  'Pending Approval':  'Pending Approval',
  'In Review':         'In Review',
  'Active':            'Active',
  'Pending Signature': 'Pending Signature',
  'Signed':            'Signed',
  'Expired':           'Expired',
  'Rejected':          'Rejected',
  'Cancelled':         'Cancelled',
};

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Page Header -->
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Contracts</h1>
          <span class="contract-count">{{ filteredContracts().length }} contracts</span>
        </div>
        <button class="btn-new-contract" routerLink="/app/contracts/new">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          New Contract
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-bar-wrap">
        <div class="search-bar">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Search contracts by title, code, department..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
          />
          @if (searchQuery()) {
            <button class="search-clear" (click)="searchQuery.set('')">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          }
        </div>
      </div>

      <!-- Status Filter Chips -->
      <div class="filter-chips-row">
        <div class="filter-chips">
          @for (filter of statusFilters; track filter) {
            <button
              class="chip"
              [class.chip-active]="activeFilter() === filter"
              (click)="activeFilter.set(filter)">
              {{ filter }}
            </button>
          }
        </div>

        <!-- Column Config Button -->
        <div class="column-config-wrapper">
          <button class="btn-columns" (click)="toggleColumnConfig($event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Columns
          </button>

          @if (showColumnConfig()) {
            <div class="column-config-panel" (click)="$event.stopPropagation()">
              <div class="config-panel-header">
                <span class="config-panel-title">Visible Columns</span>
                <button class="btn-reset" (click)="resetColumns()">Reset to defaults</button>
              </div>
              <div class="config-panel-list">
                @for (col of allColumns; track col.key) {
                  <label class="config-checkbox-row" [class.disabled]="col.alwaysVisible">
                    <input
                      type="checkbox"
                      [checked]="isColumnVisible(col.key)"
                      [disabled]="col.alwaysVisible"
                      (change)="toggleColumn(col.key)"
                    />
                    <span class="checkmark"></span>
                    <span class="config-label">{{ col.label }}</span>
                    @if (col.alwaysVisible) {
                      <span class="locked-badge">Required</span>
                    }
                  </label>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Contracts Table -->
      <div class="table-card">
        <div class="table-scroll">
          <table class="contracts-table">
            <thead>
              <tr>
                @for (col of activeColumns(); track col.key) {
                  <th (click)="toggleSort(col.key)" class="sortable-th">
                    <span class="th-content">
                      {{ col.label }}
                      @if (sortBy() === col.key) {
                        <svg class="sort-icon" [class.sort-asc]="sortDir() === 'asc'" width="10" height="10" viewBox="0 0 10 10">
                          <path d="M5 2l4 6H1z" fill="currentColor"/>
                        </svg>
                      }
                    </span>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (contract of filteredContracts(); track contract.id) {
                <tr class="contract-row" (click)="navigateToContract(contract.id)">
                  @for (col of activeColumns(); track col.key) {
                    <td>
                      @switch (col.key) {
                        @case ('code') {
                          <span class="code-cell">{{ contract.code || '---' }}</span>
                        }
                        @case ('title') {
                          <span class="title-cell">{{ contract.title }}</span>
                        }
                        @case ('type') {
                          <span class="type-badge">{{ formatType(contract.type) }}</span>
                        }
                        @case ('status') {
                          <span class="status-badge" [ngClass]="'status-' + contract.status">
                            {{ formatStatus(contract.status) }}
                          </span>
                        }
                        @case ('value') {
                          <span class="value-cell">{{ formatCurrency(contract.value) }}</span>
                        }
                        @case ('department') {
                          <span class="dept-cell">{{ contract.department || '---' }}</span>
                        }
                        @case ('startDate') {
                          <span class="date-cell">{{ formatDate(contract.startDate) }}</span>
                        }
                        @case ('endDate') {
                          <span class="date-cell">{{ formatDate(contract.endDate) }}</span>
                        }
                        @case ('createdBy') {
                          <span class="creator-cell">{{ getCreatorName(contract.createdBy) }}</span>
                        }
                        @case ('parties') {
                          <span class="parties-cell">
                            @if (contract.parties && contract.parties.length > 0) {
                              {{ contract.parties.map(p => p.name).join(', ') }}
                            } @else {
                              ---
                            }
                          </span>
                        }
                        @case ('tags') {
                          <span class="tags-cell">
                            @if (contract.tags && contract.tags.length > 0) {
                              @for (tag of contract.tags; track tag) {
                                <span class="tag-pill">{{ tag }}</span>
                              }
                            } @else {
                              ---
                            }
                          </span>
                        }
                      }
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td [attr.colspan]="activeColumns().length" class="empty-state">
                    <div class="empty-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M14 2v6h6M9 15h6M9 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                      <p>No contracts found</p>
                      <span>Try adjusting your search or filter criteria</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ─── Layout ─────────────────────────────────────────────────────── */
    .page-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* ─── Page Header ────────────────────────────────────────────────── */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .header-left {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .page-title {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      color: var(--gray-900, #111827);
      letter-spacing: -0.03em;
    }

    .contract-count {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-400, #9ca3af);
    }

    .btn-new-contract {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--teal-500, #0ABAB5), var(--teal-600, #089E9A));
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-md, 0 4px 12px rgba(10, 186, 181, 0.3));
      text-decoration: none;
    }

    .btn-new-contract:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg, 0 8px 24px rgba(10, 186, 181, 0.4));
    }

    /* ─── Search Bar ─────────────────────────────────────────────────── */
    .search-bar-wrap {
      margin-bottom: 16px;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 18px;
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: blur(var(--glass-blur, 12px));
      -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      border-radius: var(--radius-lg, 12px);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .search-bar:focus-within {
      border-color: var(--teal-400, #2dd4bf);
      box-shadow: 0 0 0 3px rgba(10, 186, 181, 0.1);
    }

    .search-icon {
      color: var(--gray-400, #9ca3af);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: var(--gray-900, #111827);
    }

    .search-input::placeholder {
      color: var(--gray-400, #9ca3af);
    }

    .search-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 50%;
      background: var(--gray-100, #f3f4f6);
      color: var(--gray-500, #6b7280);
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .search-clear:hover {
      background: var(--gray-200, #e5e7eb);
    }

    /* ─── Filter Chips ───────────────────────────────────────────────── */
    .filter-chips-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }

    .filter-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      flex: 1;
    }

    .chip {
      padding: 6px 16px;
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      border-radius: 999px;
      background: var(--glass-bg, rgba(255, 255, 255, 0.5));
      backdrop-filter: blur(var(--glass-blur, 8px));
      -webkit-backdrop-filter: blur(var(--glass-blur, 8px));
      color: var(--gray-600, #4b5563);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .chip:hover {
      background: var(--gray-100, #f3f4f6);
      border-color: var(--gray-300, #d1d5db);
    }

    .chip-active {
      background: linear-gradient(135deg, var(--teal-500, #0ABAB5), var(--teal-600, #089E9A));
      color: #fff;
      border-color: transparent;
      box-shadow: 0 2px 8px rgba(10, 186, 181, 0.25);
    }

    .chip-active:hover {
      background: linear-gradient(135deg, var(--teal-500, #0ABAB5), var(--teal-600, #089E9A));
      border-color: transparent;
    }

    /* ─── Column Config ──────────────────────────────────────────────── */
    .column-config-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    .btn-columns {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 16px;
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      border-radius: var(--radius-md, 8px);
      background: var(--glass-bg, rgba(255, 255, 255, 0.6));
      backdrop-filter: blur(var(--glass-blur, 8px));
      -webkit-backdrop-filter: blur(var(--glass-blur, 8px));
      color: var(--gray-600, #4b5563);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-columns:hover {
      background: var(--gray-100, #f3f4f6);
      border-color: var(--gray-300, #d1d5db);
    }

    .column-config-panel {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      z-index: 50;
      min-width: 280px;
      background: var(--glass-bg, rgba(255, 255, 255, 0.92));
      backdrop-filter: blur(var(--glass-blur, 20px));
      -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-xl, 0 20px 40px rgba(0, 0, 0, 0.12));
      overflow: hidden;
      animation: panelSlideIn 0.15s ease-out;
    }

    @keyframes panelSlideIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .config-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px 10px;
      border-bottom: 1px solid var(--gray-100, #f3f4f6);
    }

    .config-panel-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--gray-500, #6b7280);
    }

    .btn-reset {
      border: none;
      background: none;
      color: var(--teal-500, #0ABAB5);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: var(--radius-sm, 4px);
      transition: background 0.15s ease;
    }

    .btn-reset:hover {
      background: rgba(10, 186, 181, 0.08);
    }

    .config-panel-list {
      padding: 8px 0;
      max-height: 340px;
      overflow-y: auto;
    }

    .config-checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      cursor: pointer;
      transition: background 0.12s ease;
      user-select: none;
    }

    .config-checkbox-row:hover {
      background: var(--gray-50, #f9fafb);
    }

    .config-checkbox-row.disabled {
      cursor: default;
      opacity: 0.6;
    }

    .config-checkbox-row input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--teal-500, #0ABAB5);
      cursor: pointer;
      flex-shrink: 0;
    }

    .config-checkbox-row.disabled input[type="checkbox"] {
      cursor: default;
    }

    .config-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-700, #374151);
      flex: 1;
    }

    .locked-badge {
      font-size: 10px;
      font-weight: 600;
      color: var(--gray-400, #9ca3af);
      background: var(--gray-100, #f3f4f6);
      padding: 2px 8px;
      border-radius: 999px;
    }

    /* ─── Table Card ─────────────────────────────────────────────────── */
    .table-card {
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: blur(var(--glass-blur, 12px));
      -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      border-radius: var(--radius-xl, 16px);
      box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05));
      overflow: hidden;
    }

    .table-scroll {
      overflow-x: auto;
    }

    .contracts-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    /* ─── Table Header ───────────────────────────────────────────────── */
    .contracts-table thead tr {
      background: var(--gray-100, rgba(243, 244, 246, 0.8));
    }

    .contracts-table th {
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--gray-500, #6b7280);
      text-align: left;
      white-space: nowrap;
      border-bottom: 1px solid var(--gray-200, #e5e7eb);
    }

    .sortable-th {
      cursor: pointer;
      user-select: none;
      transition: color 0.15s ease;
    }

    .sortable-th:hover {
      color: var(--gray-700, #374151);
    }

    .th-content {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .sort-icon {
      transition: transform 0.2s ease;
    }

    .sort-icon.sort-asc {
      transform: rotate(180deg);
    }

    /* ─── Table Rows ─────────────────────────────────────────────────── */
    .contracts-table tbody tr.contract-row {
      cursor: pointer;
      transition: background 0.15s ease;
      border-bottom: 1px solid var(--gray-100, rgba(243, 244, 246, 0.5));
    }

    .contracts-table tbody tr.contract-row:hover {
      background: rgba(10, 186, 181, 0.04);
    }

    .contracts-table tbody tr.contract-row:last-child {
      border-bottom: none;
    }

    .contracts-table td {
      padding: 14px 16px;
      font-size: 13px;
      color: var(--gray-700, #374151);
      vertical-align: middle;
    }

    /* ─── Cell Styles ────────────────────────────────────────────────── */
    .code-cell {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 12px;
      font-weight: 600;
      color: var(--gray-500, #6b7280);
      background: var(--gray-100, #f3f4f6);
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid var(--gray-200, #e5e7eb);
      white-space: nowrap;
    }

    .title-cell {
      font-weight: 600;
      color: var(--gray-900, #111827);
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }

    .type-badge {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--teal-600, #089E9A);
      background: rgba(10, 186, 181, 0.08);
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }

    .value-cell {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--gray-900, #111827);
      white-space: nowrap;
    }

    .date-cell {
      font-variant-numeric: tabular-nums;
      color: var(--gray-600, #4b5563);
      white-space: nowrap;
    }

    .dept-cell,
    .creator-cell,
    .parties-cell {
      color: var(--gray-600, #4b5563);
      white-space: nowrap;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tags-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tag-pill {
      font-size: 10px;
      font-weight: 600;
      color: var(--gray-600, #4b5563);
      background: var(--gray-100, #f3f4f6);
      border: 1px solid var(--gray-200, #e5e7eb);
      padding: 2px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }

    /* ─── Status Badges ──────────────────────────────────────────────── */
    .status-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 12px;
      border-radius: 999px;
      white-space: nowrap;
      border: 1px solid transparent;
    }

    .status-draft {
      color: #4b5563;
      background: #f3f4f6;
      border-color: #e5e7eb;
    }

    .status-pending_approval {
      color: #92400e;
      background: #fef3c7;
      border-color: #fde68a;
    }

    .status-in_review {
      color: #1e40af;
      background: #dbeafe;
      border-color: #93c5fd;
    }

    .status-approved {
      color: #065f46;
      background: #d1fae5;
      border-color: #6ee7b7;
    }

    .status-pending_signature {
      color: #6b21a8;
      background: #f3e8ff;
      border-color: #d8b4fe;
    }

    .status-partially_signed {
      color: #6b21a8;
      background: #f3e8ff;
      border-color: #d8b4fe;
    }

    .status-signed {
      color: #115e59;
      background: rgba(10, 186, 181, 0.1);
      border-color: rgba(10, 186, 181, 0.25);
    }

    .status-active {
      color: #065f46;
      background: #d1fae5;
      border-color: #6ee7b7;
    }

    .status-expired {
      color: #991b1b;
      background: #fee2e2;
      border-color: #fca5a5;
    }

    .status-rejected {
      color: #991b1b;
      background: #fee2e2;
      border-color: #fca5a5;
    }

    .status-cancelled {
      color: #4b5563;
      background: #f3f4f6;
      border-color: #e5e7eb;
    }

    .status-renewed {
      color: #1e40af;
      background: #dbeafe;
      border-color: #93c5fd;
    }

    /* ─── Empty State ────────────────────────────────────────────────── */
    .empty-state {
      text-align: center;
      padding: 60px 20px !important;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--gray-400, #9ca3af);
    }

    .empty-content svg {
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .empty-content p {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-500, #6b7280);
    }

    .empty-content span {
      font-size: 13px;
      color: var(--gray-400, #9ca3af);
    }

    /* ─── Scrollbar Styling ──────────────────────────────────────────── */
    .table-scroll::-webkit-scrollbar {
      height: 6px;
    }

    .table-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .table-scroll::-webkit-scrollbar-thumb {
      background: var(--gray-300, #d1d5db);
      border-radius: 3px;
    }

    .config-panel-list::-webkit-scrollbar {
      width: 4px;
    }

    .config-panel-list::-webkit-scrollbar-thumb {
      background: var(--gray-300, #d1d5db);
      border-radius: 2px;
    }
  `]
})
export class ContractListComponent {
  private router = inject(Router);
  store = inject(EdoclinkStoreService);

  readonly allColumns = ALL_COLUMNS;
  readonly statusFilters = STATUS_FILTERS;

  searchQuery = signal('');
  activeFilter = signal<string>('All');
  visibleColumns = signal<string[]>(this.loadColumnsFromStorage());
  showColumnConfig = signal(false);
  sortBy = signal<string>('updatedAt');
  sortDir = signal<'asc' | 'desc'>('desc');

  activeColumns = computed(() => {
    const visible = this.visibleColumns();
    return ALL_COLUMNS.filter(col => visible.includes(col.key));
  });

  filteredContracts = computed(() => {
    let contracts = [...this.store.contracts];
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();
    const sort = this.sortBy();
    const dir = this.sortDir();

    const statusValue = STATUS_FILTER_MAP[filter] ?? null;
    if (statusValue !== null) {
      contracts = contracts.filter((c: any) => c.status === statusValue);
    }

    if (query) {
      contracts = contracts.filter((c: any) =>
        c.title.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.department.toLowerCase().includes(query) ||
        c.type.toLowerCase().includes(query) ||
        (c.tags ?? []).some((t: string) => t.toLowerCase().includes(query)) ||
        c.parties.some((p: any) => p.name.toLowerCase().includes(query))
      );
    }

    contracts = [...contracts].sort((a: any, b: any) => {
      let aVal: any;
      let bVal: any;

      switch (sort) {
        case 'code':       aVal = a.code; bVal = b.code; break;
        case 'title':      aVal = a.title; bVal = b.title; break;
        case 'type':       aVal = a.type; bVal = b.type; break;
        case 'status':     aVal = a.status; bVal = b.status; break;
        case 'value':      aVal = a.value ?? 0; bVal = b.value ?? 0; break;
        case 'department': aVal = a.department; bVal = b.department; break;
        case 'startDate':  aVal = new Date(a.startDate).getTime(); bVal = new Date(b.startDate).getTime(); break;
        case 'endDate':    aVal = new Date(a.endDate).getTime(); bVal = new Date(b.endDate).getTime(); break;
        case 'createdBy':  aVal = this.store.getUser(a.createdBy).name; bVal = this.store.getUser(b.createdBy).name; break;
        default:           aVal = new Date(a.updatedAt).getTime(); bVal = new Date(b.updatedAt).getTime(); break;
      }

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return dir === 'asc' ? cmp : -cmp;
      }
      return dir === 'asc' ? (aVal - bVal) : (bVal - aVal);
    });

    return contracts;
  });

  // ─── Column Config ────────────────────────────────────────────────────────
  isColumnVisible(key: string): boolean {
    return this.visibleColumns().includes(key);
  }

  toggleColumn(key: string): void {
    const col = ALL_COLUMNS.find(c => c.key === key);
    if (col?.alwaysVisible) return;

    const current = this.visibleColumns();
    const updated = current.includes(key)
      ? current.filter(k => k !== key)
      : [...current, key];

    this.visibleColumns.set(updated);
    this.saveColumnsToStorage(updated);
  }

  resetColumns(): void {
    this.visibleColumns.set([...DEFAULT_VISIBLE]);
    this.saveColumnsToStorage(DEFAULT_VISIBLE);
  }

  toggleColumnConfig(event: Event): void {
    event.stopPropagation();
    this.showColumnConfig.update(v => !v);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.showColumnConfig()) {
      this.showColumnConfig.set(false);
    }
  }

  // ─── Sorting ──────────────────────────────────────────────────────────────
  toggleSort(column: string): void {
    if (this.sortBy() === column) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDir.set('asc');
    }
  }

  // ─── Navigation ───────────────────────────────────────────────────────────
  navigateToContract(id: number): void {
    this.router.navigate(['/app/contracts', id]);
  }

  formatCurrency(value: number | undefined | null): string {
    if (value === null || value === undefined || value === 0) return '---';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
  }

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '---';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '---';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  formatStatus(status: string): string {
    return status;
  }

  formatType(type: string): string {
    return type;
  }

  getCreatorName(userId: number): string {
    return this.store.getUser(userId).name;
  }

  // Unused formatTypeOld removed

  // ─── LocalStorage helpers ─────────────────────────────────────────────────
  private loadColumnsFromStorage(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure always-visible columns are included
          const alwaysKeys = ALL_COLUMNS.filter(c => c.alwaysVisible).map(c => c.key);
          const merged = [...new Set([...alwaysKeys, ...parsed])];
          return merged;
        }
      }
    } catch {
      // ignore parse errors
    }
    return [...DEFAULT_VISIBLE];
  }

  private saveColumnsToStorage(columns: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    } catch {
      // ignore storage errors
    }
  }
}
