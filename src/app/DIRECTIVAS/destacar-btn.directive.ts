import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDestacarBtn]'
})
export class DestacarBtnDirective {

  @HostListener('mouseenter') onMouseEnter() {
    this.element.nativeElement.style.backgroundColor = '#6AFAE4';
    this.element.nativeElement.style.color = 'black';
    this.element.nativeElement.style.borderColor = '#6AFAE4';
   }
 
   @HostListener('mouseleave') onMouseLeave() {
     this.element.nativeElement.style.backgroundColor = '';
     this.element.nativeElement.style.color = 'white';
     this.element.nativeElement.style.borderColor = '';
   }

  constructor( private element: ElementRef) { }

}
