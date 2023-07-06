import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {DateService} from '../../toitsu-shared/date.service';
import {InmateService} from '../inmate/inmate.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {EducationNeed} from './education-need.model';
import {EducationNeedService} from './education-need.service';
import {Inmate} from '../inmate/inmate.model';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {EducationNeedFeedback} from '../education-need-feedback/education-need-feedback.model';
import {CountryService} from '../../sa/country/country.service';
import {EducationNeedFeedbackService} from '../education-need-feedback/education-need-feedback.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-education-need-view',
  templateUrl: 'education-need-view.component.html'
})
export class EducationNeedViewComponent implements OnInit, ExitConfirmation {
  id: number;
  educationNeed: EducationNeed;
  inmates = [];
  ageCategories = [];
  genders = [];
  countries = [];
  pEducations = {};
  pForeignLanguages = {};
  pVerbalSkillsGreek = {};
  pWrittenSkillsGreek = {};
  pProfessions = {};
  pNewEducationsInside = {};
  pNewEducationsOutside = {};
  pSatisfactionDegrees = {};

  @ViewChild(NgForm) educationNeedForm: NgForm;


  inmateDialogUrl = inmateConsts.activeIndexUrl;

  constructor(private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuBlockUiService: ToitsuBlockUiService,
              private toitsuSharedService: ToitsuSharedService,
              public authService: AuthService,
              private enumService: EnumService,
              private dateService: DateService,
              private educationNeedService: EducationNeedService,
              private inmateService: InmateService,
              private countryService: CountryService,
              private genParameterTypeService: GenParameterTypeService,
              private educationNeedFeedbackService: EducationNeedFeedbackService) {}


  ngOnInit(): void {
    // Get the id from the route
    this.id = +this.activatedRoute.snapshot.params['id'];

    this.educationNeed = this.activatedRoute.snapshot.data['record'];

    this.inmateService.getActiveInmates().subscribe({
      next: (responseData) => {
        this.inmates = responseData;
      }
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.EducationNeedFeedback_SatisfactionDegree, []).subscribe((responseData: GenParameterType) => {
      this.pSatisfactionDegrees = responseData;
    });

    this.enumService.getEnumValues('cm.core.enums.Gender').subscribe(responseData => {
      this.genders = responseData;
    });
    this.enumService.getEnumValues('cm.core.enums.AgeCategory').subscribe(responseData => {
      this.ageCategories = responseData;
    });
    this.countryService.getCountries(true, []).subscribe(responseData => {
      this.countries = responseData;
    });
    
    if (this.id){
      this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_Education, [this.educationNeed.inmate.educationPid]).subscribe((responseData: GenParameterType) => {
        this.pEducations = responseData;
      });
      this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_ForeignLanguage, [this.educationNeed.inmate.foreignLanguagePid]).subscribe((responseData: GenParameterType) => {
        this.pForeignLanguages = responseData;
      });
      this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_VerbalSkillGreek, [this.educationNeed.inmate.verbalSkillGreekPid]).subscribe((responseData: GenParameterType) => {
        this.pVerbalSkillsGreek = responseData;
      });
      this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_WrittenSkillGreek, [this.educationNeed.inmate.writtenSkillGreekPid]).subscribe((responseData: GenParameterType) => {
        this.pWrittenSkillsGreek = responseData;
      });
      this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_Profession, [this.educationNeed.inmate.professionPid]).subscribe((responseData: GenParameterType) => {
        this.pProfessions = responseData;
      });
      this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_NewEducationInside, [this.educationNeed.inmate.newEducationInsidePid]).subscribe((responseData: GenParameterType) => {
        this.pNewEducationsInside = responseData;
      });
      this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_NewEducationOutside, [this.educationNeed.inmate.newEducationOutsidePid]).subscribe((responseData: GenParameterType) => {
        this.pNewEducationsOutside = responseData;
      });
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.educationNeedForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/educationneed/view']);
  }

  goToList() {
    this.router.navigate(['/inm/educationneed/list']);
  }

  saveEducationNeed() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.educationNeedService.saveEducationNeed(this.educationNeed).subscribe({
      next: (responseData: EducationNeed) => {
        this.toitsuToasterService.showSuccessStay();
        this.educationNeedForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/educationneed/view', responseData.id]);
        } else {
          this.educationNeed = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });

  }

  deleteEducationNeed() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.educationNeedService.deleteEducationNeed(this.educationNeed.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.educationNeedForm.form.markAsPristine();
            this.router.navigate(['/inm/educationneed/list']);
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
  
  lockedEducationNeed() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    if (this.educationNeed.inmate.inmateRecord.dcId === this.authService.getUserDcId()) {
      // Αν είναι ενεργή (ανοιχτή/αδυναμία/προσωρινή) και στο κατάστημα του χρήστη, είναι επεξεργάσιμη
      return false;
    }
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.educationNeed.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }

  lockedFeedback(index) {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.educationNeed.educationNeedFeedbacks[index].id) {
      return false;
    }

    if (this.educationNeed.educationNeedFeedbacks[index].dcId !== this.authService.getUserDcId()) {
      return true;
    }

  }

  inmateChanged() {
    if (this.educationNeed.inmateId) {
      this.inmateService.getInmateEducationDetails(this.educationNeed.inmateId).subscribe({
        next: (response: Inmate) => {
          this.educationNeed.inmate = response;
          
          this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_Education, [this.educationNeed.inmate.educationPid]).subscribe((responseData: GenParameterType) => {
            this.pEducations = responseData;
          });
          this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_ForeignLanguage, [this.educationNeed.inmate.foreignLanguagePid]).subscribe((responseData: GenParameterType) => {
            this.pForeignLanguages = responseData;
          });
          this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_VerbalSkillGreek, [this.educationNeed.inmate.verbalSkillGreekPid]).subscribe((responseData: GenParameterType) => {
            this.pVerbalSkillsGreek = responseData;
          });
          this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_WrittenSkillGreek, [this.educationNeed.inmate.writtenSkillGreekPid]).subscribe((responseData: GenParameterType) => {
            this.pWrittenSkillsGreek = responseData;
          });
          this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_Profession, [this.educationNeed.inmate.professionPid]).subscribe((responseData: GenParameterType) => {
            this.pProfessions = responseData;
          });
          this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_NewEducationInside, [this.educationNeed.inmate.newEducationInsidePid]).subscribe((responseData: GenParameterType) => {
            this.pNewEducationsInside = responseData;
          });
          this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_NewEducationOutside, [this.educationNeed.inmate.newEducationOutsidePid]).subscribe((responseData: GenParameterType) => {
            this.pNewEducationsOutside = responseData;
          });
        }
      });
    }
  }

  educationNeedFeedbacksActiveIndex: number;

  addEducationNeedFeedback() {
    let educationNeedFeedback: EducationNeedFeedback;
    
    this.educationNeedFeedbackService.initializeEducationNeedFeedback().subscribe({
      next: (responseData: EducationNeedFeedback) => {
        educationNeedFeedback = responseData;
        educationNeedFeedback.educationNeedId = this.educationNeed.id;
        this.educationNeed.educationNeedFeedbacks.push(educationNeedFeedback);
        this.educationNeedFeedbacksActiveIndex = this.educationNeed.educationNeedFeedbacks.length - 1;
      }
    });
  }

  deleteEducationNeedFeedback(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.educationNeed.educationNeedFeedbacks.splice(index, 1);
          this.educationNeedFeedbacksActiveIndex = -1;
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.educationNeedFeedbackService.deleteEducationNeedFeedback(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.educationNeed.educationNeedFeedbacks.splice(index, 1);
              this.educationNeedFeedbacksActiveIndex = -1;
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }

  unsorted() {
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
