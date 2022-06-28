import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: '[appDestacar]'
})
export class DestacarDirective {

  @HostListener('mouseenter') onMouseEnter() {
   console.log(this.element.nativeElement.innerHTML)
   console.log('this.element.nativeElement')
   switch(this.element.nativeElement.innerHTML){
    case  ' PENDIENTE ⏰ ':
      this.element.nativeElement.style.backgroundColor = 'yellow';
      break;
    case ' 👌🏼 ACEPTADO 👌🏼  ':
      this.element.nativeElement.style.backgroundColor = '#00F385'
      break;
    case '  ✅ REALIZADO ✅  ':
      this.element.nativeElement.style.backgroundColor = 'green'
      break;
    case '  ❌ RECHAZADO ❌ ':
        this.element.nativeElement.style.backgroundColor = 'olive'
        break;
    case ' 🚨 CANCELADO 🚨 ':
      this.element.nativeElement.style.backgroundColor = 'red'
      break;     
    default :
     console.log('que paso')
     console.info(this.element.nativeElement.innerHTML)
    break
  }
   
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.element.nativeElement.style.backgroundColor = '';
  }

  constructor( private element: ElementRef) { }

}
