import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ExaminationType} from './examination-type.model';
import {ExaminationTypeService} from './examination-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-med-examination-type-view',
  templateUrl: 'examination-type-view.component.html'
})
export class ExaminationTypeViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) examinationTypeForm: NgForm;
  id: number;
  examinationType: ExaminationType = new ExaminationType();
  pExaminationTypeCategory = {};
  constructor(
    private examinationTypeService: ExaminationTypeService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private genParameterTypeService: GenParameterTypeService,
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.examinationType = this.id ? this.route.snapshot.data['record'] : new ExaminationType();
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Examination_Category, [this.examinationType.categoryPid]).subscribe((responseData: GenParameterType) => {
      this.pExaminationTypeCategory = responseData;
    });
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.examinationTypeForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/examinationtype/view']);
  }

  goToList() {
    this.router.navigate(['/med/examinationtype/list']);
  }

  saveExamination() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.examinationTypeService.saveExaminationType(this.examinationType).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.examinationTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/examinationtype/view/', responseData.id]);
        } else {
          this.examinationType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteExamination() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.examinationTypeService.deleteExaminationType(this.examinationType.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.examinationTypeForm.form.markAsPristine();
            this.router.navigate(['/med/examinationtype/list']);
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }
}
