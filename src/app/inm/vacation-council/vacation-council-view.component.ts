import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {VacationCouncil} from './vacation-council.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {VacationCouncilService} from './vacation-council.service';
import {DialogService} from 'primeng/dynamicdialog';
import {VacationMotionListDialogComponent} from '../vacation-application/vacation-motion-list-dialog/vacation-motion-list-dialog.component';
import {VacationApplication} from '../vacation-application/vacation-application.model';
import {VacationApplicationService} from '../vacation-application/vacation-application.service';
import {VacationViewDialogComponent} from '../vacation/vacation-view-dialog/vacation-view-dialog.component';
import {VacationCouncilApplication} from '../vacation-council-application/vacation-council-application.model';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {
  VacationApplicationRejectionDetailsDialogComponent
} from '../vacation/vacation-application-rejection-details-dialog/vacation-application-rejection-details-dialog.component';
import {VacationCouncilApplicationService} from '../vacation-council-application/vacation-council-application.service';
import {PoliceDepartmentService} from '../../sa/police-department/police-department.service';
import {Vacation} from '../vacation/vacation.model';

@Component({
  selector: 'app-inm-vacation-council-view',
  templateUrl: 'vacation-council-view.component.html'
})
export class VacationCouncilViewComponent implements OnInit, ExitConfirmation{

  id: number;
  vacationCouncil: VacationCouncil = new VacationCouncil();
  vacationApplication: VacationApplication = new VacationApplication();
  @ViewChild(NgForm) vacationCouncilForm: NgForm;
  dialogUrl: string;
  vacationTypes = [];
  policeDepartments = [];
  applicationStatuses = [];
  approvalStatuses = [];
  applicationStatusLabel: string = null;
  councilStatus: boolean = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private vacationCouncilService: VacationCouncilService,
    private dialogService: DialogService,
    private vacationApplicationService: VacationApplicationService,
    private vacationCouncilApplicationService: VacationCouncilApplicationService,
    private enumService: EnumService,
    private vacationTypeService: VacationTypeService,
    private policeDepartmentService: PoliceDepartmentService
    
  )  {}
  
  ngOnInit(): void {
    
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.vacationCouncil = this.id ? this.route.snapshot.data['record'] : new VacationCouncil();

    if (this.id) {
      this.councilStatus = this.vacationCouncil.accomplished;
    }

    this.vacationTypeService.getActiveVacationTypesByUserDc().subscribe(responseData => {
      if (responseData) {
        this.vacationTypes = responseData;
      }
    });

    this.policeDepartmentService.getActivePoliceDepartments().subscribe(respοnseData => {
      if (respοnseData) {
        this.policeDepartments = respοnseData;
      }
    });

    this.enumService.getEnumValues('inm.core.enums.VacationApplicationStatus').subscribe(responseDate => {
      this.applicationStatuses = responseDate;
      this.applicationStatusLabel = this.applicationStatusChanged();
    });

    this.enumService.getEnumValues('inm.core.enums.VacationApprovalStatus').subscribe(responseData => {
      this.approvalStatuses = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.vacationCouncilForm.dirty;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.vacationCouncil.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    // Εγγραφή με έξοδο, προς κατάστημα και όχι dirty - κλειδωμένη
    if (this.vacationCouncil.accomplished && (this.vacationCouncil.accomplished === this.councilStatus)) {
      return true;
    }

    // if (this.vacationCouncilApplication.vacationApplication.approvalStatus === 'PENDING') {
    //   return false;
    // }

    return false;
  }

  newRecord() {
    this.router.navigate(['/inm/vacationcouncil/view']);
  }

  goToList() {
    this.router.navigate(['/inm/vacationcouncil/list']);
  }

  saveVacationCouncil() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.vacationCouncilService.saveVacationCouncil(this.vacationCouncil).subscribe({
      next: (responseData: VacationCouncil) => {
        this.toitsuToasterService.showSuccessStay();
        this.vacationCouncilForm.form.markAsPristine();
        
        if (!this.id) {
          this.router.navigate(['/inm/vacationcouncil/view', responseData.id]);
        }
        else {
          this.vacationCouncil = responseData;
          this.applicationStatusLabel = this.applicationStatusChanged();
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
        if (this.councilStatus !== this.vacationCouncil.accomplished) {
          this.vacationCouncil.accomplished = this.councilStatus;
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
    
    console.log(this.vacationCouncil);

  }

  deleteVacationCouncil() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vacationCouncilService.deleteVacationCouncil(this.vacationCouncil.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.vacationCouncilForm.form.markAsPristine();
            this.router.navigate(['/inm/vacationcouncil/view']);
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

  submitVacationCouncil(){
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.vacationCouncilService.submitVacationCouncil(this.vacationCouncil).subscribe({
      next: (responseData: VacationCouncil) => {
        this.toitsuToasterService.showSuccessStay();
        this.vacationCouncilForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/vacationcouncil/view', responseData.id]);
        }
        else {
          this.vacationCouncil = responseData;
          this.applicationStatusLabel = this.applicationStatusChanged();
        }
        this.lockAccomplished();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
        if (this.councilStatus !== this.vacationCouncil.accomplished) {
          this.vacationCouncil.accomplished = this.councilStatus;
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  selectedVacationApplications = [];
  selectedVacations = [];
  
  openVacationMotionListDialog() {
    this.toitsuToasterService.clearMessages();
    const vacationMotionListDialog = this.dialogService.open(VacationMotionListDialogComponent, {
      header: this.translate.instant('vacationCouncil.select.dialogTitle'),
      width: '90%'
    });
    
    vacationMotionListDialog.onClose.subscribe((result) => {
      this.selectedVacationApplications = [];
      if (result) {
        result.filter(vacationApplication => {
          
          this.selectedVacationApplications.push(vacationApplication);
          this.addVacationApplicationToVacationCouncilApplicationsTable(this.selectedVacationApplications);
        });
      }
    });
  }

  addVacationApplicationToVacationCouncilApplicationsTable(selectedVacationApplications) {

    selectedVacationApplications.forEach(vacationApplication => {
      let vacationCouncilApplication = new VacationCouncilApplication();

      vacationCouncilApplication.vacationApplication = vacationApplication;
      vacationCouncilApplication.vacationApplicationId = vacationApplication.id;

      delete vacationApplication.dcName;
      delete vacationApplication.vacationTypeKind;
      delete vacationApplication.applicationStatusLabel;
      delete vacationApplication.approvalStatusLabel;
      
      let vacationCouncilApplications = this.vacationCouncil.vacationCouncilApplications.filter(vacCouncilApplication => vacCouncilApplication.vacationApplicationId === vacationCouncilApplication.vacationApplicationId);
      if (vacationCouncilApplication.vacationApplicationId && vacationCouncilApplications.length === 0) {
        this.vacationCouncil.vacationCouncilApplications.push(vacationCouncilApplication);
      }
    });

  }

  openVacationDialogForEdit(index) {
    console.log('mphka1', this.vacationCouncil);
    this.toitsuToasterService.clearMessages();
    
    let vacation = this.vacationCouncil.vacationCouncilApplications[index].vacationApplication.vacation;
    if (vacation === null || undefined) {
      vacation = new Vacation();
    }
    
    const vacationEditViewDialog = this.dialogService.open(VacationViewDialogComponent, {
      header: this.translate.instant('vacationCouncil.edit.vacationDialog'),
      width: '55%',
      data:
        {
          vacation: vacation,
          accomplished: this.vacationCouncil.accomplished
        },
      closable: false
    });
    vacationEditViewDialog.onClose.subscribe(result => {
      this.selectedVacations = [];
      if (result) {
        this.vacationCouncil.vacationCouncilApplications[index].vacationApplication.vacation = result[0];
        
        if (result[1] === true) {
          this.vacationCouncilForm.form.markAsDirty();
        }
      }
      console.log('gia na dw', result);
    });
  }

  openVacationApplicationRejectionDialog(index) {
    console.log('mphka2', this.vacationCouncil);
    this.toitsuToasterService.clearMessages();

    let vacation = this.vacationCouncil.vacationCouncilApplications[index].vacationApplication.vacation;
    if (vacation === null || undefined) {
      vacation = new Vacation();
    }
    
    const vacationApplicationRejectionDetails = this.dialogService.open(VacationApplicationRejectionDetailsDialogComponent, {
      header: this.translate.instant('vacationCouncilApplication.rejectionDetails'),
      width: '50rem',
      height: '30rem',
      data:
        {
          vacation: vacation,
          accomplished: this.vacationCouncil.accomplished
        },
      closable: false,
    });
    vacationApplicationRejectionDetails.onClose.subscribe(result => {
      if (result) {
        this.vacationCouncil.vacationCouncilApplications[index].vacationApplication.vacation = result[0];
      }
    });
  }
  
  deleteVacationCouncilApplication(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.vacationCouncil.vacationCouncilApplications.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          
          this.vacationCouncilApplicationService.deleteVacationCouncilApplication(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.vacationCouncil.vacationCouncilApplications.splice(index, 1);
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.vacationApplication.applicationStatus = 'MOTION';
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }
  postponeVacationApplication(index) {
    this.confirmationService.confirm({
      message: this.translate.instant('vacationCouncilApplication.postponement.confirmation'),
      accept: () => {

        this.vacationCouncil.vacationCouncilApplications[index].isPostponed = true;
        this.vacationCouncil.vacationCouncilApplications[index].vacationApplication.approvalStatus = 'PENDING';

        this.toitsuToasterService.showSuccessStay();
      },
    });
  }

  applicationStatusChanged() {
    let selectedApplicationStatus;
    if (this.vacationApplication.applicationStatus) {
      selectedApplicationStatus = this.applicationStatuses.find(i => i.value === this.vacationApplication.applicationStatus);
      return selectedApplicationStatus.label;
    }
  }

  lockAccomplished() {
    if (this.vacationCouncil.accomplished) {
      return true;
    }
    return false;
  }
  
}
