import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {GenParameter} from './gen-parameter.model';
import {genParameterConsts} from './gen-parameter.consts';
import {GenParameterViewDialogComponent} from './gen-parameter-view-dialog/gen-parameter-view-dialog.component';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../gen-parameter-type/gen-parameter-type.model';
@Component({
  selector: 'app-sa-gen-parameter-list',
  templateUrl: 'gen-parameter-list.component.html'
})
export class GenParameterListComponent implements OnInit, ExitConfirmation {
  
  @ViewChild(NgForm) genParameterForm: NgForm;
  genParameterCategories = [];
  constructor(
    private genParameterTypeService: GenParameterTypeService,
    public authService: AuthService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {}
  
  ngOnInit() {
    this.genParameterTypeService.getAllGenParameterTypes().subscribe(responseData => {
      this.genParameterCategories = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.genParameterForm.dirty;
  }
  
  url = genParameterConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'genParameterTypeDescription', header: this.translate.instant('genParameter.category'), sortField: 'category', width: '25rem'},
    {field: 'description', header: this.translate.instant('genParameter.description'), sortField: 'description', width: '20rem'},
    {field: 'order', header: this.translate.instant('genParameter.order'), sortField: 'order', width: '12rem', align: 'center'},
    {field: 'isActiveLabel', header: this.translate.instant('genParameter.isActive'), sortField: 'isActive', width: '10rem', align: 'center'},
  ];
  genParameterSortField = 'category';
  genParameterSortOrder = 1;
  args = this.initializeArgs();
  
  @ViewChild('genParameterTable') genParameterTable;
  
  initializeArgs() {
    return {
      category: null,
      code: null,
      description: null,
      isActive: null,
      isNotSelectable: null
    };
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
  }
  
  loadGenParameterTableData() {
    this.genParameterTable.loadTableData();
  }
  
  openGenParameterDialogForCreate() {
    if (this.args.category) {
      this.genParameterTypeService.getGenParameterTypeByCategory(this.args.category).subscribe((responseData: GenParameterType) => {
        const genParameterTypeViewDialog = this.dialogService.open(GenParameterViewDialogComponent, {
          data: {
            genParameter: new GenParameter(),
            category: this.args.category,
            isHierarchical: responseData.isHierarchical,
            genParameterDescription: responseData.description
          },
          header: this.translate.instant('genParameter.dialog.title.edit'),
          width: '50%',
          closable: false
        });

        genParameterTypeViewDialog.onClose.subscribe(result => {
          if (result) {
            this.loadGenParameterTableData();
          }
        });
      });
    }
    else {
      const genParameterViewDialog = this.dialogService.open(GenParameterViewDialogComponent, {
        data: {
          genParameter: new GenParameter(),
        },
        header: this.translate.instant('genParameter.dialog.title.create'),
        width: '50%',
        closable: false
      });

      genParameterViewDialog.onClose.subscribe(result => {
        if (result) {
          this.loadGenParameterTableData();
        }
      });
    }
  }
  
  openGenParameterDialogForEdit(rowData) {
    this.genParameterTypeService.getGenParameterTypeByCategory(rowData.category).subscribe((responseData: GenParameterType) => {
      const genParameterTypeViewDialog = this.dialogService.open(GenParameterViewDialogComponent, {
        data: {
          genParameter: rowData,
          isHierarchical: responseData.isHierarchical,
          genParameterDescription: responseData.description
        },
        header: this.translate.instant('genParameter.dialog.title.edit'),
        width: '50%',
        closable: false
      });

      genParameterTypeViewDialog.onClose.subscribe(result => {
        if (result) {
          this.loadGenParameterTableData();
        }
      });
    });
  }
}
