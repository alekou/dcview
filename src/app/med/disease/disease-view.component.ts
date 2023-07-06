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
import {DiseaseTypeService} from '../disease-type/disease-type.service';
import {DiseaseService} from './disease.service';
import {Disease} from './disease.model';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DiseaseType} from '../disease-type/disease-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-med-disease-view',
  templateUrl: 'disease-view.component.html'
})
export class DiseaseViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) diseaseForm: NgForm;
  id: number;
  diseaseTypeCategoryId;
  disease: Disease = new Disease();
  pDiseaseTypeCategory = {};
  inmateDialogUrl: string;
  allDiseaseTypes = [];
  diseaseTypes = [];
  
  constructor(
    private diseaseTypeService: DiseaseTypeService,
    private diseaseService: DiseaseService,
    public authService: AuthService,
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
    // Ορισμός του entity για χρήση στο component για τα επισυναπτόμενα
    
    // Get the record from the route resolver or initialize a new one
    this.disease = this.id ? this.route.snapshot.data['record'] : new Disease();
    
    if (this.id) {
      this.diseaseTypeService.getDiseaseType(this.disease.diseaseTypeId).subscribe((responseData: DiseaseType) => {
        this.diseaseTypeCategoryId = responseData.categoryPid;
      });
    }
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.DiseaseType_Category, []).subscribe(responseData => {
      this.pDiseaseTypeCategory = responseData;
    });
    
    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    this.diseaseTypeService.getAllDiseaseTypes().subscribe(responseData => {
      if (responseData) {
        this.allDiseaseTypes = responseData;
        this.diseaseTypes = responseData;
      }
      else {
        this.allDiseaseTypes = [];
        this.diseaseTypes = [];
      }
    });
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.diseaseForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/disease/view']);
  }

  goToList() {
    this.router.navigate(['/med/disease/list']);
  }

  saveDisease() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.diseaseService.saveDisease(this.disease).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.diseaseForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/disease/view/', responseData.id]);
        } else {
          this.disease = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  deleteDisease() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.diseaseService.deleteDisease(this.disease.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.diseaseForm.form.markAsPristine();
            this.router.navigate(['/med/disease/list']);
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
  
  categoryChanged() {
    if (!this.diseaseTypeCategoryId) {
      this.diseaseTypes = this.allDiseaseTypes;
      this.disease.diseaseTypeId = null;
    }
    else {
      let filteredDiseaseTypes = [];
      this.allDiseaseTypes.filter(diseaseType => {
        if (diseaseType.categoryPid === this.diseaseTypeCategoryId) {
          filteredDiseaseTypes.push(diseaseType);
        }
      });
      this.diseaseTypes = filteredDiseaseTypes;
    }
    return this.diseaseTypes;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.disease.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
}
