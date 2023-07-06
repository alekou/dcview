import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {Vacation} from '../vacation.model';
import {DateService} from '../../../toitsu-shared/date.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {VacationService} from '../vacation.service';
import {PoliceDepartmentService} from '../../../sa/police-department/police-department.service';

@Component({
  selector: 'app-inm-vacation-view-dialog',
  templateUrl: 'vacation-view-dialog.component.html'
})

export class VacationViewDialogComponent implements OnInit {
  @ViewChild(NgForm) vacationForm: NgForm;
  vacation: Vacation = new Vacation();
  vacationCouncilAccomplishedStatus: boolean;
  policeDepartments = [];
  dirtyForm: boolean = false;

  constructor(
    private translate: TranslateService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    public authService: AuthService,
    public dateService: DateService,
    public toitsuToasterService: ToitsuToasterService,
    public toitsuBlockUiService: ToitsuBlockUiService,
    public vacationService: VacationService,
    public policeDepartmentService: PoliceDepartmentService

  ) {
  }

  ngOnInit(): void {

    this.policeDepartmentService.getActivePoliceDepartments().subscribe(respοnseData => {
      if (respοnseData) {
        this.policeDepartments = respοnseData;
      }
    });
    this.vacation = this.dynamicDialogConfig.data['vacation'];
    this.vacationCouncilAccomplishedStatus = this.dynamicDialogConfig.data['accomplished'];
  }
  
  lockedForm() {
    
    if (this.vacationCouncilAccomplishedStatus) {
      return true;
    }

    return false;
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

  expectedReturnDateChanged() {
    if (this.dateService.getDatesDifferenceInDays(this.vacation.fromDate, this.vacation.toDate) === 0) {
      this.vacation.expectedReturnDate = this.dateService.addHours(this.vacation.toDate, this.vacation.travelingHours);
    }
    else {
      this.vacation.expectedReturnDate = this.dateService.addDays(this.vacation.toDate, this.vacation.travelingDays);
    }
  }

  confirm() {
    this.toitsuToasterService.clearMessages();
    this.dirtyForm = this.vacationForm.form.dirty;
    this.dynamicDialogRef.close([this.vacation, this.dirtyForm]);
  }
  
  cancel() {
    if (this.vacationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {
        }
      });
    }
    else {
      this.dynamicDialogRef.close();
    }
  }
}
