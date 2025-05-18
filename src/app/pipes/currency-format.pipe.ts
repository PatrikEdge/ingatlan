import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null) return '';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return '';

    // Ez magyar formátum: szóköz a csoportosításban, 'Ft' végén
    return numberValue.toLocaleString('hu-HU') + ' Ft';
  }
}
