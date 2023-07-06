import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {fieldRevisionsConsts} from './display-field-revisions.consts';
import {DisplayFieldRevisionsService} from './display-field-revisions.service';

@Component({
  selector: 'app-display-field-revisions',
  templateUrl: './display-field-revisions.component.html'
})
export class DisplayFieldRevisionsComponent implements OnInit{
  
  url = fieldRevisionsConsts.indexUrl;
  
  entityClass: string;
  entityId: number;
  fieldName: string;
  
  fieldRevisions: Array<SelectItem>;

  args = this.initializeArgs();

  cols = [
    {field: 'rowNum', header: '', sortField: '', width: '5%'},
    {field: 'fieldNameLabel', header: this.translate.instant('displayFieldRevisions.fieldNameLabel'), sortField: 'fieldNameLabel', width: '20%', align: 'center'},
    {field: 'fieldValue', header: this.translate.instant('displayFieldRevisions.fieldValue'), sortField: 'fieldValue', width: '20%', align: 'center'},
    {field: 'username', header: this.translate.instant('displayFieldRevisions.username'), sortField: 'username', width: '20%', align: 'center'},
    {field: 'timestamp', header: this.translate.instant('displayFieldRevisions.timestamp'), sortField: 'timestamp', width: '20%', align: 'center'},
  ];

  @ViewChild('table') table;
  sortField: string = 'timestamp';
  sortOrder: number = -1;
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private displayFieldRevisionsService: DisplayFieldRevisionsService
  ) {
    this.entityClass = this.dynamicDialogConfig.data['entityClass'];
    this.entityId = this.dynamicDialogConfig.data['entityId'];
    this.fieldName = this.dynamicDialogConfig.data['fieldName'];
  }

  ngOnInit(): void {
    this.args = this.initializeArgs();
    // Get the lists
    this.displayFieldRevisionsService.getRevisionFields(this.entityClass).subscribe(responseData => {
      this.fieldRevisions = responseData;
    });
  }

  initializeArgs() {
    return {
      fieldName: this.fieldName,
      entityClass: this.entityClass,
      entityId: this.entityId
    };
  }
  
  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
  }

  cancel() {
    this.dynamicDialogRef.close(false);
  }
}
