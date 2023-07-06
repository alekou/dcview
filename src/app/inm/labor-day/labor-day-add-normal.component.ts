import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {LaborDayService} from './labor-day.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {AreaService} from '../area/area.service';
import {ProfessionService} from '../../sa/profession/profession.service';
import {PaymentCategoryService} from '../../sa/payment-category/payment-category.service';
import {InmatePhotoService} from '../inmate-photo/inmate-photo.service';

@Component({
  selector: 'app-inm-labor-day-add-normal',
  templateUrl: 'labor-day-add-normal.component.html'
})
export class LaborDayAddNormalComponent implements OnInit {
  
  args = {
    laborDate: null,
    professionCategoryPid: null,
    locationPid: null,
    areaId: null
  };
  
  pProfessionCategory = {};
  pLocation = {};
  areas = [];
  factors = [];
  paymentCategories = [];
  
  inmateLaborDays = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    private laborDayService: LaborDayService,
    private genParameterTypeService: GenParameterTypeService,
    private areaService: AreaService,
    private professionService: ProfessionService,
    private paymentCategoryService: PaymentCategoryService,
    public inmatePhotoService: InmatePhotoService
  ) {}
  
  ngOnInit() {
    // Get the lists
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Profession_Category).subscribe(responseData => {
      this.pProfessionCategory = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Labor_Location).subscribe(responseData => {
      this.pLocation = responseData;
    });
    this.areaService.getAreasWithoutPositions().subscribe(responseData => {
      this.areas = responseData;
    });
    this.factors = this.professionService.getFactors();
    this.paymentCategoryService.getActivePaymentCategoriesByUserDc().subscribe(responseData => {
      this.paymentCategories = responseData;
    });
  }
  
  loadInmateLaborDays() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.laborDayService.getAvailableDailyNormalInmateLabors(this.args).subscribe({
      next: (responseData) => {
        // Ορισμός των αποτελεσμάτων πάνω στη σελίδα
        this.inmateLaborDays = responseData;
        
        // Αν δε βρέθηκαν αποτελέσματα, εμφάνιση ενημερωτικού μηνύματος
        if (!this.inmateLaborDays || this.inmateLaborDays.length === 0) {
          this.toitsuToasterService.showInfoStay(this.translate.instant('laborDay.add.noInmateLaborDaysFound'));
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  saveInmateLaborDays() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.laborDayService.saveDailyNormalLaborDays(this.inmateLaborDays).subscribe({
      next: (responseData) => {
        
        if (responseData['saveCount'] > 0) {
          // Αν αποθηκεύτηκε τουλάχιστον 1 ημερομίσθιο
          // Προβολή μηνύματος επιτυχίας με το πλήθος των ημερομισθίων που αποθηκεύτηκαν
          this.toitsuToasterService.showSuccessStay(this.translate.instant('laborDay.add.success', {saveCount: responseData['saveCount']}));
        }
        else {
          // Αν δεν αποθηκεύτηκε κανένα ημερομίσθιο
          // Προβολή ενημερωτικού μηνύματος
          this.toitsuToasterService.showInfoStay(this.translate.instant('laborDay.add.saveCountZero'));
        }
        
        // Γίνεται ξανά φόρτωση της σελίδας
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/laborday/addnormal']); });
        this.toitsuNavService.onMenuStateChange('0');
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}
