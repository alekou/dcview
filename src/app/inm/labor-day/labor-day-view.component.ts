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
import {LaborDayService} from './labor-day.service';
import {InmateLaborService} from '../inmate-labor/inmate-labor.service';
import {ProfessionService} from '../../sa/profession/profession.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {PaymentCategoryService} from '../../sa/payment-category/payment-category.service';
import {LaborDay} from './labor-day.model';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-labor-day-view',
  templateUrl: 'labor-day-view.component.html'
})
export class LaborDayViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  laborDay: LaborDay;
  @ViewChild(NgForm) laborDayForm: NgForm;
  
  inmateDialogUrl: string;
  inmateLabors = [];
  professions = [];
  factors = [];
  pLocation = {};
  paymentCategories = [];
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    public authService: AuthService,
    private laborDayService: LaborDayService,
    private inmateLaborService: InmateLaborService,
    private professionService: ProfessionService,
    private genParameterTypeService: GenParameterTypeService,
    private paymentCategoryService: PaymentCategoryService,
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.laborDay = this.id ? this.route.snapshot.data['record'] : new LaborDay();
    
    // Get the lists
    
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    this.professionService.getActiveProfessionsByUserDc([this.laborDay.professionId]).subscribe(responseData => {
      this.professions = responseData;
    });
    this.factors = this.professionService.getFactors();
    this.genParameterTypeService.getByCategory(GenParameterCategory.Labor_Location, [this.laborDay.locationPid]).subscribe(responseData => {
      this.pLocation = responseData;
    });
    this.paymentCategoryService.getActivePaymentCategoriesByUserDc([this.laborDay.paymentCategoryId]).subscribe(responseData => {
      this.paymentCategories = responseData;
    });
    
    // Στην υπάρχουσα εγγραφή φορτώνονται από την αρχή οι εργασίες του κρατουμένου
    if (this.laborDay.inmateId) {
      this.inmateLaborService.getInmateLaborsByInmateAndUserDc(this.laborDay.inmateId, [this.laborDay.inmateLaborId]).subscribe(responseData => {
        this.inmateLabors = responseData;
      });
    }
    
    // Στη νέα εγγραφή οι ημέρες εργασίες αρχικοποιούνται σε 0
    if (!this.id) {
      this.laborDay.workDays = 0;
    }
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.laborDayForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.laborDay.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }
  
  newRecord() {
    this.router.navigate(['/inm/laborday/view']);
  }
  
  goToList() {
    this.router.navigate(['/inm/laborday/list']);
  }
  
  saveLaborDay() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.laborDayService.saveLaborDay(this.laborDay).subscribe({
      next: (responseData: LaborDay) => {
        this.toitsuToasterService.showSuccessStay();
        this.laborDayForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/laborday/view', responseData.id]);
        }
        else {
          this.laborDay = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  deleteLaborDay() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.laborDayService.deleteLaborDay(this.laborDay.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.laborDayForm.form.markAsPristine();
            this.router.navigate(['/inm/laborday/list']);
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
   * Αλλαγή του κρατουμένου
   */
  inmateIdChanged() {
    // Μηδενισμός της εργασίας
    this.laborDay.inmateLaborId = null;
    
    if (!this.laborDay.inmateId) {
      // Έχει μηδενιστεί ο κρατούμενος
      // Άδειασμα των εργασιών
      this.inmateLabors = [];
    }
    else {
      // Έχει οριστεί διαφορετικός κρατούμενος
      // Ανάκτηση των εργασιών του κρατουμένου
      this.inmateLaborService.getInmateLaborsByInmateAndUserDc(this.laborDay.inmateId).subscribe(responseData => {
        this.inmateLabors = responseData;
        
        if (this.inmateLabors.length > 0) {
          // Εύρεση της εργασίας του κρατουμένου με τη μέγιστη ημερομηνία έναρξης
          let maxStartDateInmateLabor = this.inmateLabors.reduce((max, inmateLabor) => max.startDate > inmateLabor.startDate ? max : inmateLabor);
          if (maxStartDateInmateLabor) {
            // Αυτόματος ορισμός της εργασίας αυτής στη φόρμα
            // Επίσης καλείται η μέθοδος αλλαγής της εργασίας
            this.laborDay.inmateLaborId = maxStartDateInmateLabor.id;
            this.inmateLaborIdChanged();
          }
        }
      });
    }
  }
  
  /**
   * Αλλαγή της εργασίας
   */
  inmateLaborIdChanged() {
    if (this.laborDay.inmateLaborId) {
      // Αν η εργασία έχει τιμή, ορίζουμε από αυτή τιμές σε άλλα πεδία στη σελίδα
      let selectedInmateLabors = this.inmateLabors.filter(item => item['id'] === this.laborDay.inmateLaborId);
      if (selectedInmateLabors && selectedInmateLabors.length > 0) {
        const selectedInmateLabor = selectedInmateLabors[0];
        
        if (selectedInmateLabor.professionId) {
          this.laborDay.professionId = selectedInmateLabor.professionId;
        }
        
        if (selectedInmateLabor.professionFactor) {
          this.laborDay.factor = selectedInmateLabor.professionFactor;
        }
        
        if (selectedInmateLabor.locationPid) {
          this.laborDay.locationPid = selectedInmateLabor.locationPid;
        }
        
        if (selectedInmateLabor.paymentCategoryId) {
          this.laborDay.paid = true;
          this.laborDay.paymentCategoryId = selectedInmateLabor.paymentCategoryId;
          // Επίσης καλείται η μέθοδος αλλαγής της κατηγορίας αποζημίωσης
          this.paymentCategoryIdChanged();
        }
      }
    }
  }

  /**
   * Αλλαγή της θέσης εργασίας
   */
  professionIdChanged() {
    if (this.laborDay.professionId) {
      // Αν η θέση εργασίας έχει τιμή, ορίζουμε από αυτή τιμή στο συντελεστή και την ένδειξη αμειβόμενου
      let selectedProfessions = this.professions.filter(item => item['id'] === this.laborDay.professionId);
      if (selectedProfessions && selectedProfessions.length > 0) {
        const selectedProfession = selectedProfessions[0];
        
        if (selectedProfession.factor) {
          this.laborDay.factor = selectedProfession.factor;
        }
        
        this.laborDay.paid = !!selectedProfession.paid;
      }
    }
  }

  /**
   * Αλλαγή της κατηγορίας αποζημίωσης
   */
  paymentCategoryIdChanged() {
    if (this.laborDay.paymentCategoryId) {
      // Αν η κατηγορία αποζημίωσης έχει τιμή, ορίζουμε από αυτή την τιμή της ημερήσιας αποζημίωσης
      let selectedPaymentCategories = this.paymentCategories.filter(item => item['id'] === this.laborDay.paymentCategoryId);
      if (selectedPaymentCategories && selectedPaymentCategories.length > 0) {
        const selectedPaymentCategory = selectedPaymentCategories[0];
        
        if (selectedPaymentCategory.dayPayment) {
          this.laborDay.dayPayment = selectedPaymentCategory.dayPayment;
        }
      }
    }
  }
  
  /**
   * Αλλαγή των ημερών εργασίας
   */
  workDaysChanged() {
    // Αν ο αριθμός ημερών είναι κάτω από 2, μηδενίζουμε την ημερομηνία έως
    if (this.laborDay.workDays && this.laborDay.workDays < 2) {
      this.laborDay.laborDateTo = null;
    }
  }

  /**
   * Αλλαγή του checkbox από μεταφορά
   */
  censusChanged() {
    this.laborDay.retractive = false;
  }
  
  /**
   * Αλλαγή του checkbox ανακλητικού
   */
  retractiveChanged() {
    this.laborDay.census = false;
  }
}
