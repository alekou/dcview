import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {HospitalService} from './hospital.service';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {Hospital} from './hospital.model';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {HospitalDepartment} from '../hospital-department/hospital-department.model';
import {TranslateService} from '@ngx-translate/core';
import {HospitalDepartmentService} from '../hospital-department/hospital-department.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-sa-hospital-view',
  templateUrl: 'hospital-view.component.html'
})
export class HospitalViewComponent implements OnInit, ExitConfirmation {
  id: number;
  hospital: Hospital;
  pHospitalCity = {};
  
  @ViewChild(NgForm) hospitalForm: NgForm;
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private hospitalService: HospitalService,
    private genParameterTypeService: GenParameterTypeService,
    private hospitalDepartmentService: HospitalDepartmentService
  ) {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.hospital = this.id ? this.route.snapshot.data['record'] : new Hospital();
  
    // Hospital Cities
    this.genParameterTypeService.getByCategory(GenParameterCategory.Hospital_City, []).subscribe(responseData => {
      this.pHospitalCity = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.hospitalForm.dirty;
  }
  
  newRecord() {
    this.router.navigate(['/sa/hospital/view']);
  }
  
  goToList() {
    this.router.navigate(['/sa/hospital/list']);
  }
  
  saveHospital() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.hospitalService.saveHospital(this.hospital).subscribe({
      next: (responseData: Hospital) => {
        this.toitsuToasterService.showSuccessStay();
        this.hospitalForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/hospital/view', responseData.id]);
        } else {
          this.hospital = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
        this.toitsuBlockUiService.unblockUi();
    });
  }  
  
  addHospitalDepartment() {
    let hospitalDepartment = new HospitalDepartment();
    this.hospital.hospitalDepartments.push(hospitalDepartment);
  }
  
  deleteHospitalDepartment(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.hospital.hospitalDepartments.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          
          this.hospitalDepartmentService.deleteHospitalDepartment(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.hospital.hospitalDepartments.splice(index, 1);
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }
}
