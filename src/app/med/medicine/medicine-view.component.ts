import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Medicine} from './medicine.model';
import {MedicineService} from './medicine.service';
import {MedicineCategoryService} from '../medicine-category/medicine-category.service';
import {SupplierService} from '../supplier/supplier.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-med-medicine-view',
  templateUrl: 'medicine-view.component.html'
})
export class MedicineViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) medicineForm: NgForm;
  id: number;
  medicine: Medicine = new Medicine();
  categories = [];
  subCategories = [];
  suppliers = [];
  retrievedSubCategories = [];
  pMeasurementUnit = {};
  pMedicineType = {};
  pSubstance = {};
  pCharacterization = {};
  
  constructor(
    private medicineService: MedicineService,
    private medicineCategoryService: MedicineCategoryService,
    private genParameterTypeService: GenParameterTypeService,
    private supplierService: SupplierService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.medicine = this.id ? this.route.snapshot.data['record'] : new Medicine();
    
    this.medicineCategoryService.getAllMedicineCategories('CATEGORY').subscribe(categories => {
      this.categories = categories;
    });
    
    this.medicineCategoryService.getAllMedicineCategories('SUBCATEGORY').subscribe(subCategories => {
      this.subCategories = subCategories;
      this.retrievedSubCategories = this.subCategories;
    });
    
    this.supplierService.getAllSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Medicine_MeasurementUnit, [this.medicine.measurementUnitPid]).subscribe((responseData: GenParameterType) => {
      this.pMeasurementUnit = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Medicine_Type, [this.medicine.typePid]).subscribe((responseData: GenParameterType) => {
      this.pMedicineType = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Medicine_Substances, [this.medicine.substancesPid]).subscribe((responseData: GenParameterType) => {
      this.pSubstance = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Medicine_Characterization, [this.medicine.characterizationPid]).subscribe((responseData: GenParameterType) => {
      this.pCharacterization = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.medicineForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/medicine/view']);
  }

  goToList() {
    this.router.navigate(['/med/medicine/list']);
  }

  saveMedicine() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.medicineService.saveMedicine(this.medicine).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.medicineForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/medicine/view/', responseData.id]);
        } else {
          this.medicine = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteMedicine() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.medicineService.deleteMedicine(this.medicine.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.medicineForm.form.markAsPristine();
            this.router.navigate(['/med/medicine/list']);
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
  
  categoryChanged() {
    if (!this.medicine.categoryId) {
      this.retrievedSubCategories = this.subCategories;
    }
    else {
      let filteredSubCategories = [];
      this.subCategories.filter(subCategory => {
        if (subCategory.parentId === this.medicine.categoryId) {
          filteredSubCategories.push(subCategory);
        }
      });
      this.retrievedSubCategories = filteredSubCategories;
    }
    return this.retrievedSubCategories;
  }
}
