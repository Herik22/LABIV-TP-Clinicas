import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformarEstado'
})
export class TransformarEstadoPipe implements PipeTransform {

  transform(value:number): string {

    let estado =''

    switch(value){
      case 1:
        estado = 'PENDIENTE ⏰'
        break;
      case 2:
        estado = '👌🏼 ACEPTADO 👌🏼 '
        break;
      case 3:
        estado = ' ✅ REALIZADO ✅ '
        break;
      case 4:
          estado = ' ❌ RECHAZADO ❌'
          break;
      case 6:
        estado = '🚨 CANCELADO 🚨'
        break;     
    }
    return estado;
  }

}
