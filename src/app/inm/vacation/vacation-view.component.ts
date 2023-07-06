import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Vacation} from './vacation.model';
import {VacationService} from './vacation.service';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {DateService} from '../../toitsu-shared/date.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {Transfer} from '../transfer/transfer.model';
import {PoliceDepartmentService} from '../../sa/police-department/police-department.service';

@Component({
  selector: 'app-inm-vacation-view',
  templateUrl: 'vacation-view.component.html'
})
export class VacationViewComponent implements OnInit, ExitConfirmation {

  id: number;
  vacation: Vacation;
  transfer: Transfer;
  @ViewChild(NgForm) vacationForm: NgForm;
  inmateDialogUrl: string;
  vacationTypes = [];
  policeDepartments = [];
  approvalStatuses = [];
  presenceFrequencies = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private vacationService: VacationService,
    private vacationTypeService: VacationTypeService,
    private policeDepartmentService: PoliceDepartmentService,
    private enumService: EnumService,
    private dateService: DateService
  )  {}

  ngOnInit(): void {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.vacation = this.id ? this.route.snapshot.data['record'] : new Vacation();

    // Get the lists
    
    this.vacationTypeService.getActiveVacationTypesByUserDc().subscribe(responseData => {
      if (responseData) {
        this.vacationTypes = responseData;
      }
    });
    
    this.policeDepartmentService.getActivePoliceDepartments([this.vacation.localPoliceDeptId, this.vacation.destinationPoliceDeptId]).subscribe(respοnseData => {
      if (respοnseData) {
        this.policeDepartments = respοnseData;
      }
    });
    
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    this.enumService.getEnumValues('inm.core.enums.VacationApprovalStatus').subscribe(responseData => {
      this.approvalStatuses = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.PresenceFrequency').subscribe(responseData => {
      this.presenceFrequencies = responseData;
    });
    
    if (!this.id) {
      this.vacation.approvalStatus = 'PENDING';
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.vacationForm.dirty;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.vacation.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    return false;
  }

  newRecord() {
    this.router.navigate(['/inm/vacation/view']);
  }

  goToList() {
    this.router.navigate(['/inm/vacation/list']);
  }
  
  applicationDaysChanged(applicationDays) {
    if (this.vacation.applicationDays >= 0 ) {
      this.vacation.applicationToDate = this.dateService.addDays(this.vacation.applicationFromDate, this.vacation.applicationDays);
      if (this.dateService.getDatesDifferenceInDays(this.vacation.applicationFromDate, this.vacation.applicationToDate) === 0) {
        this.lockApplicationDays();
      }
      else {
        this.lockApplicationDays();
      }
    }
  }
  
  applicationHoursChanged(applicationHours) {
    if (this.vacation.applicationHours >= 0) {
      this.vacation.applicationToDate = this.dateService.addHours(this.vacation.applicationFromDate, this.vacation.applicationHours);
      if (this.dateService.getDatesDifferenceInHours(this.vacation.applicationFromDate, this.vacation.applicationToDate) === 0) {
        this.lockApplicationHours();
      }
      else {
        this.lockApplicationHours();
      }
    }
  }

  applicationToDateChanged() {
    if (this.vacation.applicationFromDate != null && this.vacation.applicationToDate != null) {
      this.vacation.applicationDays = this.dateService.getDatesDifferenceInDays(this.vacation.applicationFromDate, this.vacation.applicationToDate);
      if (this.vacation.applicationDays > 0) {
        this.lockApplicationHours();
        this.vacation.applicationHours = 0;
      }
      else if (this.vacation.applicationDays === 0) {
        this.lockApplicationDays();
      }

      if (!this.vacation.applicationDays) {
        this.vacation.applicationHours = this.dateService.getDatesDifferenceInHours(this.vacation.applicationFromDate, this.vacation.applicationToDate);
      }
    }
  }

  vacationDaysChanged(vacationDays) {
    if (this.vacation.vacationDays >= 0) {
      this.vacation.toDate = this.dateService.addDays(this.vacation.fromDate, this.vacation.vacationDays);
      if (this.dateService.getDatesDifferenceInDays(this.vacation.fromDate, this.vacation.toDate) === 0) {
        this.lockVacationAndTravelingDays();
        this.vacation.travelingDays = 0;
      }
      else {
        this.lockVacationAndTravelingDays();
      }
      this.expectedReturnDateChanged();
    }
  }
  
  vacationHoursChanged(vacationHours) {
    if (this.vacation.vacationHours >= 0) {
      this.vacation.toDate = this.dateService.addHours(this.vacation.fromDate, this.vacation.vacationHours);
      if (this.dateService.getDatesDifferenceInHours(this.vacation.fromDate, this.vacation.toDate) === 0) {
        if (this.vacation.vacationHours > 0) {
          
        }
        this.lockVacationAndTravelingDays();
        this.vacation.travelingHours = 0;
      }
      else {
        this.lockVacationAndTravelingDays();
      }
      this.expectedReturnDateChanged();
    }
  }

  toDateChanged() {
    if (this.vacation.fromDate != null && this.vacation.toDate != null) {
      this.vacation.vacationDays = this.dateService.getDatesDifferenceInDays(this.vacation.fromDate, this.vacation.toDate);
      this.expectedReturnDateChanged();
      if (this.vacation.vacationDays > 0) {
        this.lockVacationAndTravelingHours();
        this.vacation.vacationHours = 0;
        this.vacation.travelingHours = 0;
      }
      else if (this.vacation.vacationDays === 0) {
        this.lockVacationAndTravelingDays();
        this.vacation.travelingDays = 0;
      }

      if (!this.vacation.vacationDays) {
        this.vacation.vacationHours = this.dateService.getDatesDifferenceInHours(this.vacation.fromDate, this.vacation.toDate);
        this.expectedReturnDateChanged();
      }
    }
  }

  lockApplicationDays() {
    if (this.vacation.applicationDays > 0) {
      return false;
    }
    else if (this.vacation.applicationDays === 0 && this.vacation.applicationHours > 0) {
      return true;
    }
  }

  lockApplicationHours() {
    if (this.vacation.applicationDays > 0) {
      return true;
    }
    else if (this.vacation.applicationDays === 0) {
      return false;
    }
  }
  
  lockVacationAndTravelingDays() {
    if (this.vacation.fromDate != null && this.vacation.toDate != null) {
      if (this.vacation.vacationDays > 0) {
        return false;
      }
      else if (this.vacation.vacationDays === 0 && this.vacation.vacationHours > 0) {
        return true;
      }
    }
  }
  
  lockVacationAndTravelingHours() {
    if (this.vacation.fromDate != null && this.vacation.toDate != null) {
      if (this.vacation.vacationDays > 0) {
        return true;
      } 
      else if (this.vacation.vacationDays === 0) {
        return false;
      }
    }
  }
  
  travelingDaysChanged(travelingDays) {
    if (this.vacation.travelingDays >= 0) {
      this.vacation.expectedReturnDate = this.dateService.addDays(this.vacation.toDate, this.vacation.travelingDays);
      this.expectedReturnDateChanged();
    }
  }
  
  travelingHoursChanged(travelingHours) {
    if (this.vacation.travelingHours >= 0) {
      this.vacation.expectedReturnDate = this.dateService.addHours(this.vacation.toDate, this.vacation.travelingHours);
      this.expectedReturnDateChanged();
    }
  }

  expectedReturnDateChanged() {
    if (this.dateService.getDatesDifferenceInDays(this.vacation.fromDate, this.vacation.toDate) === 0) {
      this.vacation.expectedReturnDate = this.dateService.addHours(this.vacation.toDate, this.vacation.travelingHours);
    }
    else {
      this.vacation.expectedReturnDate = this.dateService.addDays(this.vacation.toDate, this.vacation.travelingDays); 
    }
  }

  exitedChanged() {
    if (this.vacation.exited) {
      this.vacation.exitDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }
    else {
      this.vacation.exitDate = null;
    }
  }

  returnedChanged() {
    if (this.vacation.returned) {
      this.vacation.returnDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }
    else {
      this.vacation.returnDate = null;
    }
  }

  extensionChanged() {
    if (!this.vacation.extension) {
      this.vacation.extendedToDate = null;
    }
  }

  saveVacation() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.vacationService.saveVacation(this.vacation).subscribe({
      next: (responseData: Vacation) => {
        this.toitsuToasterService.showSuccessStay();
        this.vacationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/vacation/view', responseData.id]);
        }
        else {
          this.vacation = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVacation() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vacationService.deleteVacation(this.vacation.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.vacationForm.form.markAsPristine();
            this.router.navigate(['/inm/vacation/view']);
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
