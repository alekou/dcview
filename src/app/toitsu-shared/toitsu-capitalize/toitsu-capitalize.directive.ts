import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[appToitsuCapitalize]'
})
export class ToitsuCapitalizeDirective implements OnInit {
  
  constructor(private elementRef: ElementRef, private control: NgControl) {
  }
  
  ngOnInit() {
    setTimeout(() => {
      this.capitalize();
    });
  }
  
  @HostListener('input') onInput() {
    this.capitalize();
  }
  
  capitalize() {
    let value = this.elementRef.nativeElement.value;
    if (value) {
      value = value.replace('ΐ', 'ϊ');
      value = value.replace('ΰ', 'ϋ');
      
      let upperCaseValue = value.toUpperCase();
      
      upperCaseValue = upperCaseValue.replace('Ά', 'Α');
      upperCaseValue = upperCaseValue.replace('Έ', 'Ε');
      upperCaseValue = upperCaseValue.replace('Ή', 'Η');
      upperCaseValue = upperCaseValue.replace('Ί', 'Ι');
      upperCaseValue = upperCaseValue.replace('Ϊ', 'Ι');
      upperCaseValue = upperCaseValue.replace('Ό', 'Ο');
      upperCaseValue = upperCaseValue.replace('Ύ', 'Υ');
      upperCaseValue = upperCaseValue.replace('Ϋ', 'Υ');
      upperCaseValue = upperCaseValue.replace('Ώ', 'Ω');
      
      this.control.valueAccessor.writeValue(upperCaseValue);
      this.control.viewToModelUpdate(upperCaseValue);
    }
  }
}
