import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaTurno'
})
export class FechaTurnoPipe implements PipeTransform {

  transform(value: Date,): string {

    let month = '' // 0 enero.
     
    switch(value.getMonth()){
      case 0:
        month = 'Enero'
        break
      case 1:
        month = 'Febrero'
        break
      case 2:
        month = 'Marzo'
        break
        case 3:
          month = 'Abril'
          break
          case 4:
            month = 'Mayo'
            break
            case 5:
              month = 'Junio'
              break
              case 6:
                month = 'Julio'
                break
                case 7:
                  month = 'Agosto'
                  break
                  case 8:
                    month = 'Septiembre'
                    break
                    case 9:
                      month = 'Octubre'
                      break
                      case 10:
                        month = 'Noviembre'
                        break
                        case 11:
                          month = 'Diciembre'
                          break

    }

    return `${value.getDate()} de ${month} del ${value.getFullYear()} `;
  }

}
