import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {DialogService} from 'primeng/dynamicdialog';
import {DateService} from '../../toitsu-shared/date.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {genParameterTypeConsts} from './gen-parameter-type.consts';
import {GenParameterTypeViewDialogComponent} from './gen-parameter-type-view-dialog/gen-parameter-type-view-dialog.component';
@Component({
  selector: 'app-sa-gen-parameter-type-list',
  templateUrl: 'gen-parameter-type-list.component.html'
})
export class GenParameterTypeListComponent implements OnInit, ExitConfirmation {
  
  @ViewChild(NgForm) genParameterTypeForm: NgForm;
  constructor(
    public authService: AuthService,
    private enumService: EnumService,
    private dialogService: DialogService,
    private dateService: DateService,
    private translate: TranslateService
  ) {}
  
  ngOnInit() {}
  
  confirmExit(): boolean | Observable<boolean> {
    return this.genParameterTypeForm.dirty;
  }
  
  url = genParameterTypeConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'category', header: this.translate.instant('genParameterType.category'), sortField: 'category', width: '25rem', align: 'center'},
    {field: 'description', header: this.translate.instant('genParameterType.description'), sortField: 'description', width: '20rem', align: 'center'},
    {field: 'isEditableLabel', header: this.translate.instant('genParameterType.isEditableLabel'), sortField: 'isEditable', width: '20rem', align: 'center'},
  ];
  genParameterTypeSortField = 'category';
  genParameterTypeSortOrder = 1;
  
  @ViewChild('genParameterTypeTable') genParameterTypeTable;
  
  loadGenParameterTypeTableData() {
    this.genParameterTypeTable.loadTableData();
  }
  
  openGenParameterTypeDialogForEdit(rowData) {
    
    const genParameterTypeViewDialog = this.dialogService.open(GenParameterTypeViewDialogComponent, {
      data: {
        genParameterType: rowData
      },
      header: this.translate.instant('genParameterType.dialog.title.edit'),
      width: '50%',
      closable: false
    });
    
    genParameterTypeViewDialog.onClose.subscribe(result => {
      if (result) {
        this.loadGenParameterTypeTableData();
      }
    });
  }
}
