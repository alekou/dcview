import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {treatmentLineConsts} from './treatment-line.consts';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {EnumService} from '../../cm/enum/enum.service';
import {PrescriptionLineService} from '../prescription-line/prescription-line.service';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-treatment-line-list-dialog',
  templateUrl: 'treatment-line-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class TreatmentLineListDialogComponent extends DefaultValueAccessor implements OnInit {
  url = treatmentLineConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'checkboxes', width: '3rem', align: 'center'},
    {field: 'medicineFullDescription', header: this.translate.instant('treatment.dialog.medicineFullDescription'), sortField: '', width: '25rem', align: 'center'},
    {field: 'usedQuantity', header: this.translate.instant('treatment.dialog.usedQuantity'), sortField: 'usedQuantity', width: '10rem', align: 'center'},
    {field: 'used1Status', header: this.translate.instant('treatment.dialog.name1'), sortField: '', width: '10rem', align: 'center'},
    {field: 'used2Status', header: this.translate.instant('treatment.dialog.name2'), sortField: '', width: '10rem', align: 'center'},
    {field: 'used3Status', header: this.translate.instant('treatment.dialog.name3'), sortField: '', width: '10rem', align: 'center'},
    {field: 'used4Status', header: this.translate.instant('treatment.dialog.name4'), sortField: '', width: '10rem', align: 'center'},
    {field: 'used5Status', header: this.translate.instant('treatment.dialog.name5'), sortField: '', width: '10rem', align: 'center'},
  ];
  sortField = 'usedQuantity';
  sortOrder = 1;
  args = this.initializeArgs();
  
  @ViewChild('table') table: ToitsuTableComponent;
  medicineTypeOptions = [];
  inmateId: number = null;
  isPsychiatric: boolean = false;
  toDate: Date = null;
  fromDate: Date = null;
  
  constructor(
    private prescriptionLineService: PrescriptionLineService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private enumService: EnumService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {
    super(renderer, elementRef, true);

    this.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.isPsychiatric = this.dynamicDialogConfig.data['isPsychiatric'];
  }
  ngOnInit() {
    this.clearArgs();
    this.enumService.getEnumValues('med.core.enums.option.MedicineTypeOption').subscribe(responseData => {
      this.medicineTypeOptions = responseData;
    });
  }
  initializeArgs() {
    if (this.inmateId) {
     if (this.isPsychiatric) {
       return {
         inmateId: this.inmateId,
         dateFrom: null,
         dateTo: null,
         medicineTypeOption: 'PSYCHIATRIC'
       };
     }
     else {
       return {
         inmateId: this.inmateId,
         dateFrom: null,
         dateTo: null,
         medicineTypeOption: 'GENERAL'
       };
     }
    }
    else {
      if (this.isPsychiatric) {
        return {
          inmateId: null,
          dateFrom: null,
          dateTo: null,
          medicineTypeOption: 'PSYCHIATRIC'
        };
      }
      else {
        return {
          inmateId: null,
          dateFrom: null,
          dateTo: null,
          medicineTypeOption: 'GENERAL'
        };
      }
    }
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
  
  generatePrescriptionLines() {
    if (this.table.selectedItems.length === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else if (this.fromDate === null || this.toDate === null) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.examinationDateIsNull'));
    }
    else {
      let data = {
        treatmentLines: this.table.selectedItems,
        fromDate: this.fromDate,
        toDate: this.toDate
      };

      this.prescriptionLineService.generatePrescriptionLines(data).subscribe({
        next: (responseData: any) => {
          this.toitsuToasterService.showSuccessStay(this.translate.instant('med.prescriptionLines.Created'));
          this.dynamicDialogRef.close(responseData);
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        this.toitsuBlockUiService.unblockUi();
      });
    }
  }
}
