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
import {InmateLaborService} from './inmate-labor.service';
import {ProfessionService} from '../../sa/profession/profession.service';
import {AreaService} from '../area/area.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {PaymentCategoryService} from '../../sa/payment-category/payment-category.service';
import {ProgramService} from '../program/program.service';
import {InmateLabor} from './inmate-labor.model';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateLaborApplicationService} from '../inmate-labor-application/inmate-labor-application.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-inm-inmate-labor-view',
  templateUrl: 'inmate-labor-view.component.html'
})
export class InmateLaborViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  inmateLabor: InmateLabor;
  @ViewChild(NgForm) inmateLaborForm: NgForm;
  
  inmateDialogUrl: string;
  professions = [];
  areas = [];
  pLocation = {};
  paymentCategories = [];
  programs = [];
  
  fromApplication = false;
  attachedInmateLaborApplications = [];

  renewalStatus: boolean = null;

  loading: boolean = false;
  
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
    private inmateLaborService: InmateLaborService,
    private inmateLaborApplicationService: InmateLaborApplicationService,
    private professionService: ProfessionService,
    private areaService: AreaService,
    private genParameterTypeService: GenParameterTypeService,
    private paymentCategoryService: PaymentCategoryService,
    private programService: ProgramService
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.inmateLabor = this.id ? this.route.snapshot.data['record'] : new InmateLabor();

    // Αποθήκευση της αρχικής κατάστασης επανατοποθέτησης της εργασίας
    if (this.id) {
      this.renewalStatus = this.inmateLabor.renewal;
    }

    // Φόρτωση των ενεργών αιτημάτων του χρήστη, εαν υπάρχει Id αιτήματος εργασίας στην εγγραφή
    if (this.id) {
      if (this.inmateLabor.inmateLaborApplicationId) {
        this.inmateLaborApplicationService.getAttachedInmateLaborApplicationsByInmate(this.inmateLabor.inmateId).subscribe(responseData =>{
          this.attachedInmateLaborApplications = responseData;
        });
        this.fromApplication = true;
      }
    }
    
    // Get the lists
    
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    this.professionService.getActiveProfessionsByUserDc([this.inmateLabor.professionId]).subscribe(responseData => {
      this.professions = responseData;
    });
    this.areaService.getAreasWithoutPositions([this.inmateLabor.areaId]).subscribe(responseData => {
      this.areas = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Labor_Location, [this.inmateLabor.locationPid]).subscribe(responseData => {
      this.pLocation = responseData;
    });
    this.paymentCategoryService.getActivePaymentCategoriesByUserDc([this.inmateLabor.paymentCategoryId]).subscribe(responseData => {
      this.paymentCategories = responseData;
    });
    this.programService.getPrograms([this.inmateLabor.programId]).subscribe(responseData => {
      this.programs = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.inmateLaborForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.inmateLabor.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }

  lockedFromApplication() {
    if (this.id && this.fromApplication) {
      return true;
    }
    return false;
  }
  
  newRecord() {
    this.router.navigate(['/inm/inmatelabor/view']);
  }
  
  goToList() {
    this.router.navigate(['/inm/inmatelabor/list']);
  }
  
  saveInmateLabor() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.inmateLaborService.saveInmateLabor(this.inmateLabor).subscribe({
      next: (responseData: InmateLabor) => {
        this.toitsuToasterService.showSuccessStay();
        this.inmateLaborForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/inmatelabor/view', responseData.id]);
        }
        else {
          this.inmateLabor = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  deleteInmateLabor() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.inmateLaborService.deleteInmateLabor(this.inmateLabor.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.inmateLaborForm.form.markAsPristine();
            this.router.navigate(['/inm/inmatelabor/list']);
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
  
  pauseChanged() {
    if (this.inmateLabor.pause) {
      this.inmateLabor.pauseDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.inmateLabor.pauseDate = null;
    }
  }

  getAttachedInmateLaborApplicationsByInmate() {
    this.loading = true;
    if (this.inmateLabor.inmateId && this.fromApplication) {
      this.inmateLaborApplicationService.getAttachedInmateLaborApplicationsByInmate(this.inmateLabor.inmateId).subscribe({
        next: (responseData) => {
          this.attachedInmateLaborApplications = responseData;
          this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLabor.getAttachedInmateLaborApplicationsByInmate.success'));
        },
        error: (responseError: HttpErrorResponse) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
          // Αν δεν υπάρχουν ενεργά αιτήματα εργασίας για τον κρατούμενο αρχικοποίηση του fromApplication σε false και καθαρισμός του inmateLaborApplicationId
          if (this.fromApplication) {
            this.fromApplication = false;
            this.inmateLabor.inmateLaborApplicationId = null;
          }
        }
      }).add(() => {
        this.loading = false;
      });
    }
    else if (!this.fromApplication) {
      this.inmateLabor.inmateLaborApplicationId = null;
    }
    else if (!this.inmateLabor.inmateId) {
      this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLabor.getAttachedInmateLaborApplicationsByInmate.info.noSelectedInmate'));
    }
  }

  getLastInmateProfession() {
    this.loading = true;
    if (this.inmateLabor.inmateId && this.inmateLabor.renewal) {
      this.professionService.getLastInmateProfession(this.inmateLabor.inmateId).subscribe({
        next: (responseData: any) => {
          this.inmateLabor.professionId = responseData.id;
          this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.getLastInmateProfession.success'));
        },
        error: (responseError: HttpErrorResponse) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
          // Αν δεν υπάρχει προηγούμενη θέση εργασίας για επανατοποθέτηση, επιστροφή στην αρχική κατάσταση επανατοποθέτησης
          if (this.renewalStatus !== this.inmateLabor.renewal) {
            this.inmateLabor.renewal = this.renewalStatus;
          }
        }
      }).add(() => {
        this.loading = false;
      });
    }
    else if (!this.inmateLabor.renewal) {
      this.inmateLabor.professionId = null;
    }
    else if (!this.inmateLabor.inmateId) {
      this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.getLastInmateProfession.info'));
    }
  }

  refreshFromApplicationAndRenewal() {
    // Απο-επιλογή του πεδίου "Από Αίτημα" αν έχει επιλεχθεί και αλλάξει ο Κρατούμενος
    if (this.fromApplication) {
      this.fromApplication = false;
      this.inmateLabor.inmateLaborApplicationId = null;
    }
    // Απο-επιλογή του πεδίου "Επανατοποθέτηση" αν έχει επιλεχθεί και αλλάξει ο Κρατούμενος
    if (this.inmateLabor.renewal) {
      this.inmateLabor.renewal = false;
      this.inmateLabor.professionId = null;
    }
  }

}
