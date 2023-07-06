import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DateService} from '../../toitsu-shared/date.service';
import {TransferService} from './transfer.service';
import {TransferTypeService} from '../../sa/transfer-type/transfer-type.service';
import {DetentionCenterService} from '../../sa/detention-center/detention-center.service';
import {CourtSummonsService} from '../court-summons/court-summons.service';
import {ReferralService} from '../../med/referral/referral.service';
import {HospitalService} from '../../sa/hospital/hospital.service';
import {HospitalDepartmentService} from '../../sa/hospital-department/hospital-department.service';
import {PoliceDepartmentService} from '../../sa/police-department/police-department.service';
import {EnumService} from '../../cm/enum/enum.service';
import {CityService} from '../../sa/city/city.service';
import {Transfer} from './transfer.model';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-transfer-view',
  templateUrl: 'transfer-view.component.html'
})
export class TransferViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  transfer: Transfer;
  @ViewChild(NgForm) transferForm: NgForm;
  
  inmateDialogUrl: string;
  transferTypes = [];
  detentionCenters = [];
  courtSummonses = [];
  referrals = [];
  hospitals = [];
  hospitalDepartments = [];
  policeDepartments = [];
  transferMeans = [];
  cities = [];
  transferReceiveds = [];
  
  fromApplication = false;
  toDetentionCenter = false;
  toCourthouse = false;
  toHospital = false;
  toPoliceDept = false;
  temporary = false;
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    public authService: AuthService,
    private dateService: DateService,
    private transferService: TransferService,
    private transferTypeService: TransferTypeService,
    private detentionCenterService: DetentionCenterService,
    private courtSummonsService: CourtSummonsService,
    private referralService: ReferralService,
    private hospitalService: HospitalService,
    private hospitalDepartmentService: HospitalDepartmentService,
    private policeDepartmentService: PoliceDepartmentService,
    private enumService: EnumService,
    private cityService: CityService
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.transfer = this.id ? this.route.snapshot.data['record'] : new Transfer();
    
    // Get the lists
    
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    this.transferTypeService.getActiveTransferTypesByUserDc([this.transfer.transferTypeId]).subscribe(responseData => {
      this.transferTypes = responseData;
      if (this.id) {
        this.transferTypeIdChanged();
      }
    });
    this.detentionCenterService.getOtherDetentionCenters([this.transfer.toDcId]).subscribe(responseData => {
      this.detentionCenters = responseData;
    });
    this.hospitalService.getActiveHospitals([this.transfer.toHospitalId]).subscribe(responseData => {
      this.hospitals = responseData;
      this.getHospitalDepartmentsByHospital();
    });
    this.policeDepartmentService.getActivePoliceDepartments([this.transfer.toPoliceDeptId]).subscribe(responseData => {
      this.policeDepartments = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.TransferMeans').subscribe(responseData => {
      this.transferMeans = responseData;
    });
    this.cityService.getGreekCities(true, [this.transfer.cityId]).subscribe(responseData => {
      this.cities = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.TransferReceived').subscribe(responseData => {
      this.transferReceiveds = responseData;
    });
    
    this.getCourtSummonsesByInmate();
    this.getReferralsByInmate();
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.transferForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.transfer.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    // Εγγραφή με έξοδο, προς κατάστημα και όχι dirty - κλειδωμένη
    if (this.transfer.exited && this.toDetentionCenter && !this.transferForm.dirty) {
      return true;
    }
    
    return false;
  }
  
  newRecord() {
    this.router.navigate(['/inm/transfer/view']);
  }
  
  goToList() {
    this.router.navigate(['/inm/transfer/list']);
  }
  
  saveTransfer() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.transferService.saveTransfer(this.transfer).subscribe({
      next: (responseData: Transfer) => {
        this.toitsuToasterService.showSuccessStay();
        this.transferForm.form.markAsPristine();
        if (responseData.exited && this.toDetentionCenter && !this.temporary) {
          // Αν έχει γίνει έξοδος και η μεταγωγή είναι προς κατάστημα και όχι προσωρινή, γίνεται μετάβαση στην καρτέλα του κρατουμένου
          this.router.navigate(['/inm/inmate/view', responseData.inmateId]);
          this.toitsuNavService.onMenuStateChange('0');
        }
        else if (!this.id) {
          this.router.navigate(['/inm/transfer/view', responseData.id]);
        }
        else {
          this.transfer = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  deleteTransfer() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.transferService.deleteTransfer(this.transfer.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.transferForm.form.markAsPristine();
            this.router.navigate(['/inm/transfer/list']);
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
   * Αλλαγή του τύπου μεταγωγής
   */
  transferTypeIdChanged() {
    if (this.transfer.transferTypeId) {
      let filteredTransferTypes = this.transferTypes.filter(item => {
        return item.id === this.transfer.transferTypeId;
      });
      if (filteredTransferTypes && filteredTransferTypes.length > 0) {
        // Ορισμός των flags προορισμού (και προσωρινής μεταγωγής) από τον επιλεγμένο τύπο μεταγωγής
        this.toDetentionCenter = filteredTransferTypes[0].toDetentionCenter;
        this.toCourthouse = filteredTransferTypes[0].toCourthouse;
        this.toHospital = filteredTransferTypes[0].toHospital;
        this.toPoliceDept = filteredTransferTypes[0].toPoliceDept;
        this.temporary = filteredTransferTypes[0].temporary;
        
        // Καθαρισμός των σχετικών πεδίων προορισμού
        this.clearRelevantToFieldsOnTransferTypeChange();
        
        // Ορισμός του μέσου από τον επιλεγμένο τύπο μεταγωγής (αν έχει δηλωμένο)
        if (filteredTransferTypes[0].transferMeans) {
          this.transfer.means = filteredTransferTypes[0].transferMeans;
        }
        
        return;
      }
    }
    
    // Δεν υπάρχει τύπος μεταγωγής - ορισμός όλων των flags προορισμού (και προσωρινής μεταγωγής) σε false
    this.toDetentionCenter = false;
    this.toCourthouse = false;
    this.toHospital = false;
    this.toPoliceDept = false;
    this.temporary = false;
    
    // Καθαρισμός των σχετικών πεδίων προορισμού
    this.clearRelevantToFieldsOnTransferTypeChange();
  }
  
  clearRelevantToFieldsOnTransferTypeChange() {
    if (!this.toDetentionCenter) {
      this.transfer.toDcId = null;
      this.transfer.toBeReturned = false;
    }
    if (!this.toCourthouse) {
      this.transfer.courtSummonsId = null;
      this.transfer.toCourthouseId = null;
      this.transfer.orderNo = null;
      this.transfer.orderDate = null;
      this.transfer.courtDate = null;
    }
    if (!this.toHospital) {
      this.transfer.referralId = null;
      this.transfer.toHospitalId = null;
      this.transfer.toHospitalDeptId = null;
      this.transfer.disease = null;
      this.transfer.regularHospitalTransfer = false;
      this.transfer.hospitalExitDate = null;
    }
    if (!this.toPoliceDept) {
      this.transfer.toPoliceDeptId = null;
    }
  }
  
  /**
   * Αλλαγή της ένδειξης εξόδου
   */
  exitedChanged() {
    if (this.transfer.exited) {
      this.transfer.exitDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }
    else {
      this.transfer.exitDate = null;
    }
  }
  
  /**
   * Αλλαγή της ένδειξης επιστροφής
   */
  returnedChanged() {
    if (this.transfer.returned) {
      this.transfer.returnDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }
    else {
      this.transfer.returnDate = null;
    }
  }
  
  /**
   * Αλλαγή της ένδειξης ακύρωσης
   */
  cancelledChanged() {
    if (this.transfer.cancelled) {
      this.transfer.cancelDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }
    else {
      this.transfer.cancelDate = null;
      this.transfer.cancelComments = null;
    }
  }
  
  /**
   * Αλλαγή του κρατουμένου
   */
  inmateIdChanged() {
    // Διαχείριση των κλήσεων δικαστηρίου και των παραπεμπτικών του κρατουμένου
    this.getCourtSummonsesByInmate();
    this.getReferralsByInmate();
  }
  
  /**
   * Διαχείριση των κλήσεων δικαστηρίου του κρατουμένου
   */
  getCourtSummonsesByInmate() {
    if (this.transfer.inmateId) {
      this.courtSummonsService.getCourtSummonsForInmateTransfer(this.transfer.inmateId, this.id).subscribe(responseData => {
        this.courtSummonses = responseData;
      });
    }
    else {
      this.courtSummonses = [];
    }
  }
  
  /**
   * Διαχείριση των παραπεμπτικών του κρατουμένου
   */
  getReferralsByInmate() {
    if (this.transfer.inmateId) {
      this.referralService.getReferralsForInmateTransfer(this.transfer.inmateId, this.id).subscribe(responseData => {
        this.referrals = responseData;
      });
    }
    else {
      this.referrals = [];
    }
  }
  
  /**
   * Αλλαγή της κλήσης δικαστηρίου
   */
  courtSummonsIdChanged() {
    if (this.transfer.courtSummonsId) {
      let filteredCourtSummonses = this.courtSummonses.filter(item => {
        return item.id === this.transfer.courtSummonsId;
      });
      if (filteredCourtSummonses && filteredCourtSummonses.length > 0) {
        // Αν έχει επιλεγεί κλήση δικαστηρίου
        // Μεταφορά των πεδίων της κλήσης δικαστηρίου πάνω στη μεταγωγή
        let courtSummons = filteredCourtSummonses[0];
        this.transfer.toCourthouseId = courtSummons.courthouseId;
        this.transfer.courtDate = courtSummons.courtDate;
      }
    }
    else {
      // Μηδενισμός των σχετικών πεδίων της μεταγωγής
      this.transfer.toCourthouseId = null;
      this.transfer.courtDate = null;
    }
  }
  
  /**
   * Αλλαγή του παραπεμπτικού
   */
  referralIdChanged() {
    if (this.transfer.referralId) {
      let filteredReferrals = this.referrals.filter(item => {
        return item.id === this.transfer.referralId;
      });
      if (filteredReferrals && filteredReferrals.length > 0) {
        // Αν έχει επιλεγεί παραπεμπτικό
        // Μεταφορά των πεδίων του παραπεμπτικού πάνω στη μεταγωγή
        let referral = filteredReferrals[0];
        this.transfer.toHospitalId = referral.hospitalId;
        this.getHospitalDepartmentsByHospital();
        this.transfer.toHospitalDeptId = referral.hospitalDepartmentId;
        this.transfer.moveDate = referral.transferDate;
        this.transfer.hospitalExitDate = referral.returnDate;
        this.transfer.disease = referral.incident;
        this.transfer.reason = referral.reason;
      }
    }
    else {
      // Μηδενισμός των σχετικών πεδίων της μεταγωγής
      this.transfer.toHospitalId = null;
      this.getHospitalDepartmentsByHospital();
      this.transfer.toHospitalDeptId = null;
      this.transfer.moveDate = null;
      this.transfer.hospitalExitDate = null;
      this.transfer.disease = null;
      this.transfer.reason = null;
    }
  }
  
  /**
   * Αλλαγή του νοσοκομείου
   */
  toHospitalIdChanged() {
    this.transfer.toHospitalDeptId = null;
    this.getHospitalDepartmentsByHospital();
  }
  
  /**
   * Διαχείριση των τμημάτων βάσει νοσοκομείου
   */
  getHospitalDepartmentsByHospital() {
    if (this.transfer.toHospitalId) {
      this.hospitalDepartmentService.getActiveHospitalDepartmentsByHospital(this.transfer.toHospitalId, [this.transfer.toHospitalDeptId]).subscribe(responseData => {
        this.hospitalDepartments = responseData;
      });
    }
    else {
      this.hospitalDepartments = [];
    }
  }
}
