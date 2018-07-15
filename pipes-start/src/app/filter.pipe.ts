import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure:  false
})
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propName:  string): any {
    if (value.length === 0) {
      return value;
    } else if (filterString === '') {
      return value;
    } else {
      return value.filter(
        (val) => {
          return val[propName] === filterString;
        }
      );
    }
  }
}
