import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {DateService} from '../../toitsu-shared/date.service';
import {InmateService} from '../../inm/inmate/inmate.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {HearingApplication} from './hearing-application.model';
import {HearingApplicationService} from './hearing-application.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {HearingTypeService} from '../hearing-type/hearing-type.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-hearing-application-view',
  templateUrl: 'hearing-application-view.component.html',
})
export class HearingApplicationViewComponent implements OnInit, ExitConfirmation {
  id: number;
  hearingApplication: HearingApplication;
  @ViewChild(NgForm) hearingApplicationForm: NgForm;
  pReceivers = {};
  hearingTypes = [];
  subsystem: string;
  inmatesUrl = inmateConsts.activeIndexUrl;
  
  constructor(  private translate: TranslateService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private confirmationService: ConfirmationService,
                private toitsuToasterService: ToitsuToasterService,
                private toitsuBlockUiService: ToitsuBlockUiService,
                private toitsuSharedService: ToitsuSharedService,
                public authService: AuthService,
                private enumService: EnumService,
                private dateService: DateService,
                private genParameterTypeService: GenParameterTypeService,
                private inmateService: InmateService,
                private hearingApplicationService: HearingApplicationService,
                private hearingTypeService: HearingTypeService
  ) {
    this.subsystem = this.activatedRoute.snapshot.pathFromRoot[1].routeConfig.path;
  }

  ngOnInit(): void {
    // Get the id from the activatedRoute
    this.id = +this.activatedRoute.snapshot.params['id'];
    
    // Get the record from the activatedRoute resolver or initialize a new one
    this.hearingApplication = this.id ? this.activatedRoute.snapshot.data['record'] : new HearingApplication();
    
    let category = null;
    if (this.subsystem === 'inm' ) {
      category = GenParameterCategory.HearingApplication_InmReceiver;
    }
    else {
      category = GenParameterCategory.HearingApplication_MedReceiver;
    }
    // Παραλήπτες
    this.genParameterTypeService.getByCategory(category, [this.hearingApplication.receiverPid]).subscribe((responseData: GenParameterType) => {
      this.pReceivers = responseData;
    });
    
    // Τύποι Ακρόασης
    this.hearingTypeService.getAllHearingTypes(this.subsystem.toUpperCase(), true, [this.hearingApplication.hearingTypeId]).subscribe(responseData => {
      this.hearingTypes = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.hearingApplicationForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/' + this.subsystem + '/hearingapplication/view']);
  }

  goToList() {
    this.router.navigate(['/' + this.subsystem + '/hearingapplication/list']);
  }

  saveHearingApplication() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.hearingApplicationService.saveHearingApplication(this.hearingApplication).subscribe({
      next: (responseData: HearingApplication) => {
        this.toitsuToasterService.showSuccessStay();
        this.hearingApplicationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/' + this.subsystem + '/hearingapplication/view', responseData.id]);
        }
        else {
          this.hearingApplication = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  deleteHearingApplication() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.hearingApplicationService.deleteHearingApplication(this.hearingApplication.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.hearingApplicationForm.form.markAsPristine();
            this.router.navigate(['/' + this.subsystem + '/hearingapplication/list']);
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

  lockedRecord() {
      // Νέα εγγραφή - όχι κλειδωμένη
      if (!this.id) {
        return false;
      }

      // Εγγραφή άλλου καταστήματος - κλειδωμένη
      if (this.hearingApplication.dcId !== this.authService.getUserDcId()) {
        return true;
      }
      
      return false;
    }
}
