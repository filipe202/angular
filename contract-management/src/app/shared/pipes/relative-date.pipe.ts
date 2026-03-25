import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMs < 0) {
      const futureDays = Math.abs(diffDays);
      if (futureDays === 0) return 'hoje';
      if (futureDays === 1) return 'amanhã';
      return `em ${futureDays} dias`;
    }

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 30) return `há ${diffDays} dias`;
    if (diffDays < 365) return `há ${Math.round(diffDays / 30)} meses`;
    return `há ${Math.round(diffDays / 365)} anos`;
  }
}
