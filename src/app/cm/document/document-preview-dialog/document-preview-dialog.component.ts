import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cm-document-preview-dialog',
  template: `
    
    <div *ngIf="isLoading" class="spinner-container">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
      </svg>
    </div>
    
    <iframe style="width:100%; height:100%;" #myIframe></iframe>
  `,
  styleUrls: ['document-preview-dialog.component.css']
})
export class DocumentPreviewDialogComponent implements AfterViewInit {
  url;
  fileNameExtension;
  isLoading = false;
  
  @ViewChild('myIframe') iframe;
  
  constructor(private dynamicDialogConfig: DynamicDialogConfig)
  {
    this.fileNameExtension = this.dynamicDialogConfig.data['fileNameExtension'];
    this.url = this.dynamicDialogConfig.data['url'];
  }
  
  ngAfterViewInit() {
    
    if (this.fileNameExtension === 'xlsx' || this.fileNameExtension === 'xls') {
      this.previewDocument();
      
    }
    console.log(this.isLoading);
  }
  
  previewDocument() {
    const iframe = this.iframe.nativeElement;
    const url = this.url;
    this.loadExcel(url, iframe);
    
  }
  loadExcel(url: string, iframe: HTMLIFrameElement) {
    // debugger;
    this.isLoading = true;
    import('xlsx').then(xlsx => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = (e) => {
        
        const data = new Uint8Array(xhr.response);
        const workbook = xlsx.read(data, {type: 'array'});
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const htmlString = xlsx.utils.sheet_to_html(worksheet);
        iframe.contentDocument.body.innerHTML = htmlString;
        
      };
      xhr.send();
    });
    this.isLoading = false;
  }
}
