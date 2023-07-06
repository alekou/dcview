import {Component, ElementRef, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {TranslateService} from '@ngx-translate/core';
import {EnumService} from '../../../cm/enum/enum.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {programApplicationConsts} from '../program-application.consts';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-program-application-list-dialog',
  templateUrl: 'program-application-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class ProgramApplicationListDialogComponent extends DefaultValueAccessor{
  programId: number;
  
  url = programApplicationConsts.programApplicationForProtocolUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'checkboxes', width: '3rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('programApplication.protocolNo'), sortField: 'protocolNo', width: '10rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('programApplication.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'applicationDate', header: this.translate.instant('programApplication.applicationDate'), sortField: 'applicationDate', width: '8rem', align: 'center'},
    {field: 'professionId', header: this.translate.instant('programApplication.professionId'), sortField: 'professionId', width: '10rem', align: 'center'}
  ];

  sortField = 'applicationDate';
  sortOrder = -1;
  args = this.initializeArgs();

  @ViewChild('table') table;

  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private translate: TranslateService,
    private enumService: EnumService,
    private toitsuToasterService: ToitsuToasterService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {super(renderer, elementRef, true); }
  
  initializeArgs() {
    return {
      applicationDateAfter: null,
      applicationDateBefore: null,
      protocolId: null,
      programId: this.dynamicDialogConfig.data.programId ,
      programApplicationIdsToExclude: this.dynamicDialogConfig.data.programApplicationIdsToExclude
    };
  }
  loadTableData() {
    this.table.loadTableData();
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
