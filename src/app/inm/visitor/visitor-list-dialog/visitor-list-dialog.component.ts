import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {visitorConsts} from '../visitor.consts';
import {VisitorViewDialogComponent} from '../visitor-view-dialog/visitor-view-dialog.component';

@Component({
  selector: 'app-inm-visitor-list-dialog',
  templateUrl: 'visitor-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class VisitorListDialogComponent extends DefaultValueAccessor implements OnInit {

  url = visitorConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'lastName', header: this.translate.instant('visitor.lastName'), sortField: 'lastName', width: '15rem', align: 'center'},
    {field: 'firstName', header: this.translate.instant('visitor.firstName'), sortField: 'firstName', width: '15rem', align: 'center'},
    {field: 'address', header: this.translate.instant('visitor.address'), sortField: 'address', width: '20rem', align: 'center'},
    {field: 'phone', header: this.translate.instant('visitor.phone'), sortField: 'phone', width: '15rem', align: 'center'},
    {field: 'adt', header: this.translate.instant('visitor.adt'), sortField: 'adt', width: '15rem', align: 'center'},
    {field: 'passportNo', header: this.translate.instant('visitor.passportNo'), sortField: 'passportNo', width: '15rem', align: 'center'},
    {field: 'isLawyerLabel', header: this.translate.instant('visitor.isLawyer'), sortField: 'isLawyer', width: '15rem', align: 'center'}
  ];

  sortField = 'lastName';
  sortOrder = 1;
  args = this.initializeArgs();

  @ViewChild('table') table;
  yesNoEnums = [];
  todayGateMovementYesNoEnums;
  yesNoEnumOptions = [];
  selectedRowData: any;
  canCreate = false;
  fromTodayGateMovements = 'NO';
  searchLawyer = 'YES';

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private enumService: EnumService,
    private toitsuToasterService: ToitsuToasterService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private controlContainer: ControlContainer,
    private dialogService: DialogService,

  ) {
    super(renderer, elementRef, true);
    this.canCreate = this.dynamicDialogConfig.data['canCreate'];
    this.fromTodayGateMovements = this.dynamicDialogConfig.data['fromTodayGateMovements'] ? 
      this.dynamicDialogConfig.data['fromTodayGateMovements'] : false; // we need ternary to handled if arg is not passed

    this.args.fromTodayGateMovements = this.fromTodayGateMovements ? 'YES' : null;

    this.searchLawyer = this.dynamicDialogConfig.data['searchLawyer'] ?
      this.dynamicDialogConfig.data['searchLawyer'] : false; // we need ternary to handled if arg is not passed
    
    
    if (this.searchLawyer) {
      this.args.isLawyer = 'YES';
    } else {
      this.args.isLawyer = null;
    }
    
  }

  ngOnInit() {
    // YesNoEnums
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
      this.todayGateMovementYesNoEnums = responseData.filter(item => item['value'] !== 'NO');
    });
  }

  initializeArgs() {
    return {
      adt: null,
      passportNo: null,
      isLawyer: null,
      lastName: null,
      firstName: null,
      fromTodayGateMovements: null
    };
  }
  rowDblClicked(rowData) {
    let id = rowData['id'];
    this.dynamicDialogRef.close(id);
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
    if (!this.selectedRowData) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.selectedRowData['id']);
    }
  }
  cancel() {
    this.dynamicDialogRef.close();
  }

  // ---------------------------------------------------------------------------------------------------

  viewDialogTitle = 'inm.visitor.new';
  openViewDialog() {
    
    if (this.searchLawyer) {
      this.viewDialogTitle = 'visitor.view.dialogTitleLawyer';
    }
    
    this.toitsuToasterService.clearMessages();
    const visitorViewDialog = this.dialogService.open(VisitorViewDialogComponent, {
      header: this.translate.instant(this.viewDialogTitle),
      width: '97%',
      data: {
        createLawyer: this.searchLawyer,
      },
      closable: false
    });

    visitorViewDialog.onClose.subscribe(result => {
      if (result) {
        this.dynamicDialogRef.close(result);
      }
    });
  }
}
