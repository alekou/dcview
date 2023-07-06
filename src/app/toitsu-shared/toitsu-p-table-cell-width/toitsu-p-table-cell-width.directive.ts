import {AfterViewChecked, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appToitsuPTableCellWidth]'
})
export class ToitsuPTableCellWidthDirective implements AfterViewChecked {
  
  constructor(private elementRef: ElementRef) {}
  
  ngAfterViewChecked() {
    // Get the widths of the th elements
    let thArray = this.elementRef.nativeElement.querySelector('thead tr').children;
    let widthArray = [];
    
    for (let i = 0; i < thArray.length; i++) {
      let width = thArray[i].style.width;
      if (!width) {
        width = '';
      }
      widthArray.push(width);
    }
    
    // Get the table rows and, for each of them:
    // Get the td elements and apply the widths in the same order
    let rows = this.elementRef.nativeElement.querySelectorAll('tbody tr');
    
    for (let i = 0; i < rows.length; i++) {
      let tdArray = rows[i].children;
      
      for (let j = 0; j < tdArray.length; j++) {
        tdArray[j].style.width = widthArray[j];
      }
    }
  }
}
