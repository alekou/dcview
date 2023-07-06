import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {EnumService} from '../../cm/enum/enum.service';
import {Doctor} from './doctor.model';
import {DoctorService} from './doctor.service';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../gen-parameter-type/gen-parameter-type.model';

@Component({
  selector: 'app-sa-doctor-view',
  templateUrl: 'doctor-view.component.html'
})
export class DoctorViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) doctorForm: NgForm;
  id: number;
  doctor: Doctor = new Doctor();
  doctorTypes = [];
  pSpecialty = {};
  constructor(
    private doctorService: DoctorService,
    private genParameterTypeService: GenParameterTypeService,
    private enumService: EnumService,
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
    this.doctor = this.id ? this.route.snapshot.data['record'] : new Doctor();
    
    // specialties
    this.genParameterTypeService.getByCategory(GenParameterCategory.HearingApplication_MedReceiver, [this.doctor.specialtyPid]).subscribe((responseData: GenParameterType) => {
      this.pSpecialty = responseData;
    });
    
    // doctorTypes
    this.enumService.getEnumValues('med.core.enums.DoctorType').subscribe(responseData => {
      this.doctorTypes = responseData;
    });
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.doctorForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/doctor/view']);
  }

  goToList() {
    this.router.navigate(['/sa/doctor/list']);
  }

  saveDoctor() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.doctorService.saveDoctor(this.doctor).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.doctorForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/doctor/view/', responseData.id]);
        } else {
          this.doctor = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteDoctor() {

    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.doctorService.deleteDoctor(this.doctor.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.doctorForm.form.markAsPristine();
            this.router.navigate(['/sa/doctor/list']);
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
