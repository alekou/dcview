import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuTableComponent} from '../../../toitsu-shared/toitsu-table/toitsu-table.component';
import {vacationApplicationConsts} from '../vacation-application.consts';
import {inmateConsts} from '../../inmate/inmate.consts';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-vacation-motion-list-dialog',
  templateUrl: 'vacation-motion-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class VacationMotionListDialogComponent extends DefaultValueAccessor implements OnInit {
  
  inmateId: number;
  url = vacationApplicationConsts.motionAndEmergencyApplicationsIndexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'checkboxes', width: '3rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('vacationApplication.protocolNo'), sortField: 'protocolNo', width: '10rem', align: 'center'},
    {field: 'vacationTypeDescription', header: this.translate.instant('vacationApplication.vacationTypeId'), sortField: 'inm/QVacationType.vacationType.description', width: '10rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('vacationApplication.inmateFullName'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'motionProgressDate', header: this.translate.instant('vacationMotion.motionProgressDate'), sortField: 'motionProgressDate', width: '10rem', align: 'center'},
    {field: 'applicationDate', header: this.translate.instant('vacationApplication.applicationDate'), sortField: 'applicationDate', width: '10rem', align: 'center'},
    {field: 'applicationFromDate', header: this.translate.instant('vacationApplication.applicationFromDate'), sortField: 'applicationFromDate', width: '10rem', align: 'center'},
    {field: 'applicationToDate', header: this.translate.instant('vacationApplication.applicationToDate'), sortField: 'applicationToDate', width: '10rem', align: 'center'},
    {field: 'reason', header: this.translate.instant('vacationApplication.reason'), sortField: 'reason', width: '10rem', align: 'center'},
  ];
  
  inmateDialogUrl: string;

  sortField = 'motionProgressDate';
  sortOrder = 1;
  args = this.initializeArgs();

  selectedRowData: any;
  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toitsuToasterService: ToitsuToasterService,
  ) {
    super(renderer, elementRef, true);
  }

  ngOnInit() {
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  }

  initializeArgs() {
    return {
      inmateId: null,
      applicationDateAfter: null,
      applicationDateBefore: null,
      protocolNo: null,
      origin: 'COUNCIL'
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
    console.log(this.table.data);
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
  }

  confirm() {
    if (this.table.selectedItems.length === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.table.selectedItems);
    }
  }

  cancel() {
    this.dynamicDialogRef.close();
  }
}
