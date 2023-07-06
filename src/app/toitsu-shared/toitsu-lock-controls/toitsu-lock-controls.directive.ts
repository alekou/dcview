import {AfterViewChecked, Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appToitsuLockControls]'
})
export class ToitsuLockControlsDirective implements AfterViewChecked {

  /**
   *  Το directive μπορεί να τοποθετηθεί σε οποιοδήποτε element και χρησιμοποιείται για να κλειδώσει όλα τα controls
   *  που βρίσκονται κάτω από το element αυτό.
   *  Προσοχή: Αν η συνθήκη κλειδώματος παύσει να ισχύει, τα πεδία θα παραμείνουν κλειδωμένα.
   */
  
  @Input() lockCondition = false;
  
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }
  
  ngAfterViewChecked() {
    if (this.lockCondition) {
      
      let inputElements = this.elementRef.nativeElement.querySelectorAll('input');
      for (let i = 0; i < inputElements.length; i++) {
        inputElements[i].disabled = true;
      }
      
      let dropdownTopElements = this.elementRef.nativeElement.querySelectorAll('p-dropdown');
      for (let i = 0; i < dropdownTopElements.length; i++) {
        this.renderer.addClass(dropdownTopElements[i], 'cursor-text');
      }
      
      let dropdownElements = this.elementRef.nativeElement.querySelectorAll('p-dropdown > .p-dropdown');
      for (let i = 0; i < dropdownElements.length; i++) {
        this.renderer.addClass(dropdownElements[i], 'background-color-locked');
        this.renderer.addClass(dropdownElements[i], 'pointer-events-none');
      }
      
      let dropdownLabelElements = this.elementRef.nativeElement.querySelectorAll('p-dropdown .p-dropdown-label');
      for (let i = 0; i < dropdownLabelElements.length; i++) {
        this.renderer.addClass(dropdownLabelElements[i], 'user-select-text');
      }
      
      let checkboxElements = this.elementRef.nativeElement.querySelectorAll('.p-checkbox');
      for (let i = 0; i < checkboxElements.length; i++) {
        this.renderer.addClass(checkboxElements[i], 'cursor-default');
        this.renderer.addClass(checkboxElements[i], 'pointer-events-none');
      }
      
      let checkboxBoxElements = this.elementRef.nativeElement.querySelectorAll('.p-checkbox-box');
      for (let i = 0; i < checkboxBoxElements.length; i++) {
        this.renderer.addClass(checkboxBoxElements[i], 'opacity-06');
      }
      
      let textareaElements = this.elementRef.nativeElement.querySelectorAll('textarea');
      for (let i = 0; i < textareaElements.length; i++) {
        textareaElements[i].disabled = true;
        this.renderer.addClass(textareaElements[i], 'locked');
      }
      
      let multiselectElements = this.elementRef.nativeElement.querySelectorAll('p-multiselect > .p-multiselect');
      for (let i = 0; i < multiselectElements.length; i++) {
        this.renderer.addClass(multiselectElements[i], 'background-color-locked');
        this.renderer.addClass(multiselectElements[i], 'pointer-events-none');
      }
      
      let radiobuttonElements = this.elementRef.nativeElement.querySelectorAll('.p-radiobutton-box');
      for (let i = 0; i < radiobuttonElements.length; i++) {
        this.renderer.addClass(radiobuttonElements[i], 'p-disabled');
      }
      
      let buttonElements = this.elementRef.nativeElement.querySelectorAll('button:not(.p-panel-toggler)');
      for (let i = 0; i < buttonElements.length; i++) {
        buttonElements[i].disabled = true;
      }
    }
  }
}
