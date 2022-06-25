import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoHora'
})
export class FormatoHoraPipe implements PipeTransform {

  transform(value: Date,): string {
  
    return value.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      hour12: false,
    });
  }

}
