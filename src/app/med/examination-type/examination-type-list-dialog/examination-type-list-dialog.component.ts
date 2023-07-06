import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {examinationTypeConsts} from '../examination-type.consts';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {ExaminationType} from '../examination-type.model';
import {Examination} from '../../examination/examination.model';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ExaminationService} from '../../examination/examination.service';
import {ToitsuTableComponent} from '../../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-examination-type-list-dialog',
  templateUrl: 'examination-type-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class ExaminationTypeListDialogComponent extends DefaultValueAccessor implements OnInit {
  hearingId: number;
  inmateId: number;
  url = examinationTypeConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'checkboxes', width: '3rem', align: 'center'},
    {field: 'code', header: this.translate.instant('examinationType.code'), sortField: 'code', width: '15rem', align: 'center'},
    {field: 'category', header: this.translate.instant('examinationType.categoryPid'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '20rem', align: 'center'},
    {field: 'type', header: this.translate.instant('examinationType.type'), sortField: 'type', width: '20rem', align: 'center'},
    {field: 'description', header: this.translate.instant('examinationType.description'), sortField: 'description', width: '20rem', align: 'center'},
  ];
  sortField = 'code';
  sortOrder = 1;
  args = this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  examination: Examination = new Examination();
  examinationType: ExaminationType = new ExaminationType(); 
  pExaminationTypeCategory = {};
  selectedExaminationTypes = [];

  constructor(
    private examinationService: ExaminationService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private genParameterTypeService: GenParameterTypeService,
  ) {
    super(renderer, elementRef, true);

    this.hearingId = this.dynamicDialogConfig.data['hearingId'];
    this.inmateId = this.dynamicDialogConfig.data['inmateId'];
  }
  ngOnInit() {
    this.clearArgs();
    this.genParameterTypeService.getByCategory(GenParameterCategory.Examination_Category, [this.examinationType.categoryPid]).subscribe(responseData => {
      this.pExaminationTypeCategory = responseData;
    });
  }
  initializeArgs() {
    if (!this.hearingId) {
      return {
        examinationTypeCategory: null,
        description: null,
        isBloodSampling: true
      };
    }
    else {
      return {
        examinationTypeCategory: null,
        description: null,
        isBloodSampling: null
      };
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
  
  // Χρήση για Ακρόαση--------------------------------------------------------------------------
  examinationsToSave = [];
  saveExaminations() {
    if (this.table.selectedItems.length === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else if (this.examination.examinationDate === null) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.examinationDateIsNull'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.toitsuBlockUiService.blockUi();

      this.selectedExaminationTypes.filter(retrievedExaminationType => {
        let examination = new Examination();
        examination.examinationTypeId = retrievedExaminationType.id;
        examination.hearingId = this.hearingId;
        examination.inmateId = this.inmateId;
        examination.examinationDate = this.examination.examinationDate;
        this.examinationsToSave.push(examination);
      });

      this.examinationService.saveExaminationList(this.examinationsToSave).subscribe({
        next: (responseData: any) => {
          this.toitsuToasterService.showSuccessStay();
          this.dynamicDialogRef.close();
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
