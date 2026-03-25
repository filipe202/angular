import { Component, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../core/auth/auth.service';
import { SignatureService } from '../../../core/services/signature.service';
import { CurrencyPtPipe } from '../../../shared/pipes/currency-pt.pipe';

@Component({
  selector: 'app-signature-history',
  imports: [DatePipe, MatCardModule, MatIconModule, MatTableModule, CurrencyPtPipe],
  template: `
    <div class="history">
      <h2>Histórico de Assinaturas</h2>

      @if (history().length > 0) {
        <mat-card>
          <table mat-table [dataSource]="history()" class="table">
            <ng-container matColumnDef="contract">
              <th mat-header-cell *matHeaderCellDef>Contrato</th>
              <td mat-cell *matCellDef="let s">{{ s.contractTitle }}</td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let s">{{ s.contractType }}</td>
            </ng-container>
            <ng-container matColumnDef="value">
              <th mat-header-cell *matHeaderCellDef>Valor</th>
              <td mat-cell *matCellDef="let s">{{ s.contractValue | currencyPt }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let s">
                <span class="status-chip" [class]="s.status">
                  <mat-icon>{{ s.status === 'signed' ? 'check_circle' : 'cancel' }}</mat-icon>
                  {{ s.status === 'signed' ? 'Assinado' : 'Recusado' }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Data</th>
              <td mat-cell *matCellDef="let s">{{ (s.signedAt || s.declinedAt) | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
        </mat-card>
      } @else {
        <mat-card class="empty">
          <mat-icon>history</mat-icon>
          <h3>Sem histórico</h3>
          <p>Ainda não assinou nenhum contrato.</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .history { max-width: 900px; }
    h2 { margin: 0 0 24px; font-weight: 400; }
    .table { width: 100%; }

    .status-chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 13px; font-weight: 500;
    }
    .status-chip mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .status-chip.signed { color: #4CAF50; }
    .status-chip.declined { color: #F44336; }

    .empty { text-align: center; padding: 64px; color: #999; }
    .empty mat-icon { font-size: 64px; width: 64px; height: 64px; color: #e0e0e0; }
    .empty h3 { color: #666; }
  `]
})
export class SignatureHistoryComponent {
  constructor(private authService: AuthService, private signatureService: SignatureService) {}

  columns = ['contract', 'type', 'value', 'status', 'date'];
  private userId = computed(() => this.authService.user()?.id ?? '');
  history = computed(() => this.signatureService.getHistoryByUser(this.userId())());
}
