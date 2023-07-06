import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Vaccine} from './vaccine.model';
import {VaccineService} from './vaccine.service';
import {MedicineService} from '../medicine/medicine.service';

@Component({
  selector: 'app-med-vaccine-view',
  templateUrl: 'vaccine-view.component.html'
})
export class VaccineViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) vaccineForm: NgForm;
  id: number;
  vaccine: Vaccine = new Vaccine();
  medicineVaccines = [];

  constructor(
    private vaccineService: VaccineService,
    private medicineService: MedicineService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.vaccine = this.id ? this.route.snapshot.data['record'] : new Vaccine();
    
    this.medicineService.getAllMedicineVaccines().subscribe(responseData => {
      this.medicineVaccines = responseData;
    });
    
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.vaccineForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/vaccine/view']);
  }

  goToList() {
    this.router.navigate(['/med/vaccine/list']);
  }

  saveVaccine() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.vaccineService.saveVaccine(this.vaccine).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.vaccineForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/vaccine/view/', responseData.id]);
        } else {
          this.vaccine = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVaccine() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vaccineService.deleteVaccine(this.vaccine.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.vaccineForm.form.markAsPristine();
            this.router.navigate(['/med/vaccine/list']);
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
