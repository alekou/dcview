import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {GenParameter} from '../gen-parameter.model';
import {GenParameterViewDialogComponent} from '../gen-parameter-view-dialog/gen-parameter-view-dialog.component';
import {genParameterConsts} from '../gen-parameter.consts';

@Component({
  selector: 'app-cm-gen-parameter-list-dialog',
  templateUrl: 'gen-parameter-list-dialog.component.html'
})
export class GenParameterListDialogComponent implements OnInit {
  url: string = genParameterConsts.indexUrl;
  category: string;
  isHierarchical: boolean;
  isBigList: boolean = false;
  genParameterDescription: string;
  isEditable: boolean = false;
  hideAdd: boolean = false;
  hasSearched: boolean = false;
  multipleSelection = false;
  selectionMode = 'single';
  multipleSelectionCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'checkboxes', width: '4rem', align: 'center'},
    {field: 'genParameterTypeDescription', header: this.translate.instant('genParameter.category'), sortField: 'category', width: '15rem', align: 'center'},
    {field: 'description', header: this.translate.instant('genParameter.description'), sortField: 'description', width: '20rem', align: 'center'},
    {field: 'order', header: this.translate.instant('genParameter.order'), sortField: 'order', width: '15rem', align: 'center'},
    {field: 'code', header: this.translate.instant('genParameter.code'), sortField: 'code', width: '10rem', align: 'center'},
  ];
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'genParameterTypeDescription', header: this.translate.instant('genParameter.category'), sortField: 'category', width: '15rem', align: 'center'},
    {field: 'description', header: this.translate.instant('genParameter.description'), sortField: 'description', width: '20rem', align: 'center'},
    {field: 'order', header: this.translate.instant('genParameter.order'), sortField: 'order', width: '15rem', align: 'center'},
    {field: 'code', header: this.translate.instant('genParameter.code'), sortField: 'code', width: '10rem', align: 'center'},
  ];
  sortField = 'category';
  sortOrder = 1;
  args = this.initializeArgs();
  
  @ViewChild('table') table;
  selectedRowData: any;
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private dialogService: DialogService
  ) {
    this.category = this.dynamicDialogConfig.data['category'];
    this.isHierarchical = this.dynamicDialogConfig.data['isHierarchical'];
    this.isBigList = this.dynamicDialogConfig.data['isBigList'];
    this.genParameterDescription = this.dynamicDialogConfig.data['genParameterDescription'];
    this.isEditable = this.dynamicDialogConfig.data['isEditable'];
    this.hideAdd = this.dynamicDialogConfig.data['hideAdd'];
    this.multipleSelection = this.dynamicDialogConfig.data['multipleSelection'];
  }
  
  ngOnInit() {
    this.clearArgs();
    if (this.multipleSelection) {
      this.cols = this.multipleSelectionCols;
      this.selectionMode = 'multiple';
    }
  }
  
  initializeArgs() {
    return {
      category: this.category,
      code: null,
      description: null,
      isActive: 'YES',
      isNotSelectable: null
    };
  }
  
  rowDblClicked(rowData) {
    if (rowData.isNotSelectable) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('error.genParameterNotSelectable'));
    } 
    else {
      if (!this.multipleSelection) {
        this.toitsuToasterService.clearMessages();
        this.dynamicDialogRef.close(rowData);
      }
      else {
        this.toitsuToasterService.clearMessages();
        let selectedGenParameters = [];
        selectedGenParameters.push(rowData);
        this.dynamicDialogRef.close(selectedGenParameters);
      }
    }
  }
  
  rowSelected(rowData) {
    this.selectedRowData = rowData['data'];
  }
  
  rowUnselected(rowData) {
    this.selectedRowData = null;
  }
  
  loadTableData() {
    this.table.loadTableData();
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
  }
  
  confirm() {
    // debugger;
    if (!this.multipleSelection) {
      if (!this.selectedRowData) {
        this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
      }
      else if (this.selectedRowData.isNotSelectable) {
        this.toitsuToasterService.showErrorStay(this.translate.instant('error.genParameterNotSelectable'));
      }
      else {
        this.toitsuToasterService.clearMessages();
        this.dynamicDialogRef.close(this.selectedRowData);
      }
    }
    else {
      if (this.table.selectedItems.length === 0) {
        this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
      }
      else {
        this.toitsuToasterService.clearMessages();
        let selectedGenParameters = this.table.selectedItems.map(item => item.id);
        this.dynamicDialogRef.close(this.table.selectedItems);
      }
    }
  }
  
  cancel() {
    this.dynamicDialogRef.close();
  }
  
  // Προσθήκη Νέου Παραμετρικού-----------------------------------------------------------------------------------------
  
  openViewDialog() {
    this.toitsuToasterService.clearMessages();
    let genParameter: GenParameter = new GenParameter();
    const dialogRef = this.dialogService.open(GenParameterViewDialogComponent, {
      header: this.translate.instant('genParameter.dialog.title.create'),
      width: '50%',
      data: {
        genParameter: genParameter,
        category: this.category,
        isHierarchical: this.isHierarchical,
        genParameterDescription: this.genParameterDescription,
        hideCheckBox: true
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        if (!this.multipleSelection) {
          this.dynamicDialogRef.close(result);
        }
        else {
          this.dynamicDialogRef.close([result]);
        }
      }
    });
  }
  
  loadComplete(tableData) {
    this.hasSearched = true;
  }
}
