import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {InmateRelativeViewDialogComponent} from '../inmate-relative-view-dialog/inmate-relative-view-dialog.component';
import {visitorConsts} from '../../visitor/visitor.consts';
import {Visitor} from '../../visitor/visitor.model';
import {VisitorService} from '../../visitor/visitor.service';

@Component({
  selector: 'app-inm-inmate-list-dialog',
  templateUrl: 'inmate-relative-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class InmateRelativeListDialogComponent extends DefaultValueAccessor implements OnInit {
  
  inmateId: number = null;
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
  selectedRowData: any;
  canCreate = false;
  fromTodayGateMovements = 'NO';
  searchLawyer = 'YES';
  relationKind: string;

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
    private visitorService: VisitorService

  ) { 
    super(renderer, elementRef, true);
    this.relationKind = this.dynamicDialogConfig.data['relationKind'];
    this.inmateId = this.dynamicDialogConfig.data['inmateId'];
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
    this.openInmateRelativeViewDialog(id);
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
      this.openInmateRelativeViewDialog(this.selectedRowData['id']);
    }
  }
  cancel() {
    this.dynamicDialogRef.close();
  }

  // ---------------------------------------------------------------------------------------------------


  openInmateRelativeViewDialog(visitorId) {

    if (visitorId){
      this.visitorService.getVisitor(visitorId).subscribe((responseData: Visitor) => {
        this.toitsuToasterService.clearMessages();
        const relativeViewDialog = this.dialogService.open(InmateRelativeViewDialogComponent, {
          header: this.translate.instant('inm.visitor.edit'),
          width: '97%',
          data: {
            inmateId: this.inmateId,
            visitor: responseData,
            relationKind: this.relationKind
          },
          closable: false
        });
        relativeViewDialog.onClose.subscribe(result => {
          if (result) {
            this.dynamicDialogRef.close(result);
          }
        });
      });
    }
    else{
      const relativeViewDialog = this.dialogService.open(InmateRelativeViewDialogComponent, {
        header: this.translate.instant('inm.visitor.new'),
        width: '97%',
        data: {
          inmateId: this.inmateId,
          visitor: null,
          relationKind: this.relationKind
        },
        closable: false
      });
      relativeViewDialog.onClose.subscribe(result => {
        if (result) {
          this.dynamicDialogRef.close(result);
        }
      });
    }
  }
}
