import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[appToitsuTextareaAutoResize]'
})
export class ToitsuTextareaAutoResizeDirective implements OnInit {
  
  constructor(private elementRef: ElementRef) {
  }
  
  ngOnInit() {
    this.elementRef.nativeElement.style.overflowY = 'hidden';
    setTimeout(() => {
      this.resize();
    });
  }
  
  @HostListener('input') onInput() {
    this.resize();
  }
  
  resize() {
    this.elementRef.nativeElement.style.height = '0';
    this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.scrollHeight + 'px';
    this.elementRef.nativeElement.style.minHeight = '1.70rem';
    this.elementRef.nativeElement.style.marginBottom = '-0.25rem';
  }
}
