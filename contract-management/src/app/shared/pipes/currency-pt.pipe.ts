import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyPt' })
export class CurrencyPtPipe implements PipeTransform {
  transform(value: number | null | undefined, showSymbol = true): string {
    if (value == null) return '-';
    if (value === 0) return '-';
    const formatted = new Intl.NumberFormat('pt-PT', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
    return formatted;
  }
}
