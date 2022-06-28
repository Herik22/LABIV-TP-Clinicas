import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appChangeTittleFiltro]'
})
export class ChangeTittleFiltroDirective {
  @HostListener('click') click() {
    this.element.nativeElement.style.fontWeight='bold'
    
    if(this.element.nativeElement.innerHTML =='FILTRAR ⬇️ ⬇️'){
      this.element.nativeElement.innerHTML ='FILTRAR ⬆️ ⬆️'

      console.log( this.element.nativeElement.innerHTML)
    }else{
      this.element.nativeElement.innerHTML ='FILTRAR ⬇️ ⬇️'
      console.log( this.element.nativeElement.innerHTML)
    }
    
    
   }
  constructor(private element: ElementRef) { }

}
