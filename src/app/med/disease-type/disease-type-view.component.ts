import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {DiseaseType} from './disease-type.model';
import {DiseaseTypeService} from './disease-type.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-med-disease-type-view',
  templateUrl: 'disease-type-view.component.html'
})
export class DiseaseTypeViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) diseaseTypeForm: NgForm;
  id: number;
  diseaseType: DiseaseType = new DiseaseType();
  pDiseaseTypeCategory = {};

  constructor(
    private diseaseTypeService: DiseaseTypeService,
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
    this.diseaseType = this.id ? this.route.snapshot.data['record'] : new DiseaseType();
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.DiseaseType_Category, [this.diseaseType.categoryPid]).subscribe((responseData: GenParameterType) => {
      this.pDiseaseTypeCategory = responseData;
    });
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.diseaseTypeForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/diseasetype/view']);
  }

  goToList() {
    this.router.navigate(['/med/diseasetype/list']);
  }

  saveDiseaseType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.diseaseTypeService.saveDiseaseType(this.diseaseType).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.diseaseTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/diseasetype/view/', responseData.id]);
        } else {
          this.diseaseType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteDiseaseType() {

    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.diseaseTypeService.deleteDiseaseType(this.diseaseType.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.diseaseTypeForm.form.markAsPristine();
            this.router.navigate(['/med/diseasetype/list']);
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
