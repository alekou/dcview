import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ReferralService} from './referral.service';
import {Referral} from './referral.model';
import {AuthService} from '../../toitsu-auth/auth.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {HospitalService} from '../../sa/hospital/hospital.service';
import {HospitalDepartmentService} from '../../sa/hospital-department/hospital-department.service';

@Component({
  selector: 'app-med-referral-view',
  templateUrl: 'referral-view.component.html'
})
export class ReferralViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) referralForm: NgForm;
  id: number;
  referral: Referral = new Referral();
  activeDoctors = [];
  hospitals = [];
  hospitalDepartments = [];
  inmateDialogUrl: string;
  
  constructor(
    private referralService: ReferralService,
    private doctorService: DoctorService,
    private hospitalService: HospitalService,
    private hospitalDepartmentService: HospitalDepartmentService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.referral = this.id ? this.route.snapshot.data['record'] : new Referral();

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    this.doctorService.getAllActiveDoctors().subscribe(activeDoctors => {
      this.activeDoctors = activeDoctors;
    });
    
    this.hospitalService.getActiveHospitals([this.referral.hospitalId]).subscribe(responseData => {
      this.hospitals = responseData;
      this.getHospitalDepartments();
    });
    
    // TODO διαχείριση για τον γιατρο αν είναι ο συνδεδεμένος χρήστης ο δηλωμένος γιατρός
    //  getDoctorByUsername(username);
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.referralForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.referral.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }

  newRecord() {
    this.router.navigate(['/med/referral/view']);
  }

  goToList() {
    this.router.navigate(['/med/referral/list']);
  }

  saveReferral() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.referralService.saveReferral(this.referral).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.referralForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/referral/view/', responseData.id]);
        } else {
          this.referral = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  deleteReferral() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.referralService.deleteReferral(this.referral.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.referralForm.form.markAsPristine();
            this.router.navigate(['/med/referral/list']);
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
  
  /**
   * Διαχείριση των τμημάτων βάσει νοσοκομείου
   */
  getHospitalDepartments() {
    if (this.referral.hospitalId) {
      this.hospitalDepartmentService.getActiveHospitalDepartmentsByHospital(this.referral.hospitalId, [this.referral.hospitalDepartmentId]).subscribe(responseData => {
        this.hospitalDepartments = responseData;
      });
    }
    else {
      this.hospitalDepartments = [];
    }
  }
  
  hospitalChanged() {
    this.referral.hospitalDepartmentId = null;
    this.getHospitalDepartments();
  }
}
