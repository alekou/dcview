import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-sa-app-log-display-json-dialog',
  templateUrl: 'app-log-display-json-dialog.component.html'
})
export class AppLogDisplayJsonDialogComponent implements OnInit {
  
  formattedJson: string;
  
  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
  )  {
    let json = this.dynamicDialogConfig.data['json'];
    this.formattedJson = JSON.stringify(JSON.parse(json), null, 2); // Indent with 2 spaces
  }
  
  ngOnInit() {
    
  }
}
