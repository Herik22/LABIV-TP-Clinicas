import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformarFecha'
})
export class TransformarFechaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
