import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {DateService} from '../../toitsu-shared/date.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {VacationApplication} from './vacation-application.model';
import {VacationApplicationService} from './vacation-application.service';

@Component({
  selector: 'app-inm-vacation-application-view',
  templateUrl: 'vacation-application-view.component.html'
})
export class VacationApplicationViewComponent implements OnInit, ExitConfirmation {

  id: number;
  vacationApplication: VacationApplication;
  @ViewChild(NgForm) vacationApplicationForm: NgForm;
  inmateDialogUrl: string;
  vacationTypes = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private vacationApplicationService: VacationApplicationService,
    private vacationTypeService: VacationTypeService,
    private enumService: EnumService,
    private dateService: DateService,
  )  {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    
    console.log('Kapoio id: ', this.id);

    // Get the record from the route resolver or initialize a new one
    this.vacationApplication = this.id ? this.route.snapshot.data['record'] : new VacationApplication();

    this.vacationTypeService.getActiveVacationTypesByUserDc().subscribe(responseData => {
      if (responseData) {
        this.vacationTypes = responseData;
      }
    });
    
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
  }

  applicationDaysChanged(applicationDays) {
    if (this.vacationApplication.applicationDays >= 0 ) {
      this.vacationApplication.applicationToDate = this.dateService.addDays(this.vacationApplication.applicationFromDate, this.vacationApplication.applicationDays);
      if (this.dateService.getDatesDifferenceInDays(this.vacationApplication.applicationFromDate, this.vacationApplication.applicationToDate) === 0) {
        this.lockApplicationDays();
      }
      else {
        this.lockApplicationDays();
      }
    }
  }

  applicationHoursChanged(applicationHours) {
    if (this.vacationApplication.applicationHours >= 0) {
      this.vacationApplication.applicationToDate = this.dateService.addHours(this.vacationApplication.applicationFromDate, this.vacationApplication.applicationHours);
      if (this.dateService.getDatesDifferenceInHours(this.vacationApplication.applicationFromDate, this.vacationApplication.applicationToDate) === 0) {
        this.lockApplicationHours();
      }
      else {
        this.lockApplicationHours();
      }
    }
  }

  applicationToDateChanged() {
    if (this.vacationApplication.applicationFromDate != null && this.vacationApplication.applicationToDate != null) {
      this.vacationApplication.applicationDays = this.dateService.getDatesDifferenceInDays(this.vacationApplication.applicationFromDate, this.vacationApplication.applicationToDate);
      if (this.vacationApplication.applicationDays > 0) {
        this.lockApplicationHours();
        this.vacationApplication.applicationHours = 0;
      }
      else if (this.vacationApplication.applicationDays === 0) {
        this.lockApplicationDays();
      }

      if (!this.vacationApplication.applicationDays) {
        this.vacationApplication.applicationHours = this.dateService.getDatesDifferenceInHours(this.vacationApplication.applicationFromDate, this.vacationApplication.applicationToDate);
      }
    }
  }

  lockApplicationDays() {
    if (this.vacationApplication.applicationDays > 0) {
      return false;
    }
    else if (this.vacationApplication.applicationDays === 0 && this.vacationApplication.applicationHours > 0) {
      return true;
    }
  }

  lockApplicationHours() {
    if (this.vacationApplication.applicationDays > 0) {
      return true;
    }
    else if (this.vacationApplication.applicationDays === 0) {
      return false;
    }
  }
  

  confirmExit(): boolean | Observable<boolean> {
    return this.vacationApplicationForm.dirty;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.vacationApplication.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    // Εγγραφή με έξοδο, προς κατάστημα και όχι dirty - κλειδωμένη
    if (this.vacationApplication.applicationStatus !== 'APPLICATION') {
      return true;
    }

    return false;
  }

  newRecord() {
    this.router.navigate(['/inm/vacationapplication/view']);
  }

  goToList() {
    this.router.navigate(['/inm/vacationapplication/list']);
  }

  saveVacationApplication() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.vacationApplicationService.saveVacationApplication(this.vacationApplication).subscribe({
      next: (responseData: VacationApplication) => {
        this.toitsuToasterService.showSuccessStay();
        this.vacationApplicationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/vacationapplication/view', responseData.id]);
        }
        else {
          this.vacationApplication = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVacationApplication() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vacationApplicationService.deleteVacationApplication(this.vacationApplication.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.vacationApplicationForm.form.markAsPristine();
            this.router.navigate(['/inm/vacationapplication/view']);
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
