import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {VacationApplication} from './vacation-application.model';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {VacationApplicationService} from './vacation-application.service';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Observable} from 'rxjs';
import {inmateConsts} from '../inmate/inmate.consts';
import {VacationCouncil} from '../vacation-council/vacation-council.model';

@Component({
  selector: 'app-inm-vacation-motion-view',
  templateUrl: 'vacation-motion-view.component.html'
})
export class VacationMotionViewComponent implements OnInit, ExitConfirmation {

  id: number;
  vacationApplication: VacationApplication;
  vacationCouncil: VacationCouncil = new VacationCouncil();
  @ViewChild(NgForm) vacationApplicationForm: NgForm;
  inmateDialogUrl: string;
  vacationTypes = [];
  applicationStatuses = [];
  approvalStatuses = [];
  applicationStatusLabel: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private vacationApplicationService: VacationApplicationService,
    private vacationTypeService: VacationTypeService,
    private enumService: EnumService,
  ) {}

  ngOnInit(): void {

    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.vacationApplication = this.id ? this.route.snapshot.data['record'] : new VacationApplication();

    this.vacationTypeService.getActiveVacationTypesByUserDc().subscribe(responseData => {
      if (responseData) {
        this.vacationTypes = responseData;
      }
    });

    this.enumService.getEnumValues('inm.core.enums.VacationApplicationStatus').subscribe(responseDate => {
      this.applicationStatuses = responseDate;
      this.applicationStatusLabel = this.applicationStatusChanged();
    });

    this.enumService.getEnumValues('inm.core.enums.VacationApprovalStatus').subscribe(responseData => {
      this.approvalStatuses = responseData;
    });
    
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
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
    
    if (this.id && (this.vacationApplication.applicationStatus === 'MOTION' 
                 || this.vacationApplication.applicationStatus === 'COUNCIL_PROGRESS' 
                 || this.vacationApplication.applicationStatus === 'COUNCIL')) 
    {
      return true;
    }

    return false;
  }
  
  lockedVacationApplicationDataRecord() {
    if (this.id && this.vacationApplication.applicationStatus === 'MOTION_PROGRESS') {
      return true;
    }
    else {
      return false;
    }
  }

  goToList() {
    this.router.navigate(['/inm/vacationapplication/motion/list']);
  }
  
  saveVacationMotion() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.vacationApplicationService.saveVacationMotion(this.vacationApplication).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay();
        this.vacationApplicationForm.form.markAsPristine();
        this.router.navigate(['/inm/vacationapplication/motion/view', this.id]);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  submitMotion(){
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.vacationApplicationService.submitVacationMotion(this.vacationApplication).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.router.navigate(['/inm/vacationapplication/motion/view', this.id]);
      this.vacationApplication.applicationStatus = 'MOTION';
      this.applicationStatusLabel = this.applicationStatusChanged();
      
      this.toitsuBlockUiService.unblockUi();
    });
  }

  applicationStatusChanged() {
    let selectedApplicationStatus;
    if (this.vacationApplication.applicationStatus) {
      selectedApplicationStatus = this.applicationStatuses.find(i => i.value === this.vacationApplication.applicationStatus);
      return selectedApplicationStatus.label;
    }
  }
}
