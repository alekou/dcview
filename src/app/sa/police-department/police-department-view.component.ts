import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {PoliceDepartmentService} from './police-department.service';
import {PoliceDepartment} from './police-department.model';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {AuthService} from '../../toitsu-auth/auth.service';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-sa-police-department-view',
  templateUrl: 'police-department-view.component.html'
})
export class PoliceDepartmentViewComponent implements OnInit, ExitConfirmation {
  id: number;
  policeDepartment: PoliceDepartment;
  pPoliceDepartmentType = {};
  
  @ViewChild(NgForm) policeDepartmentForm: NgForm;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private policeDepartmentService: PoliceDepartmentService,
    private genParameterTypeService: GenParameterTypeService
  ) {
  }
  
  ngOnInit(): void {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.policeDepartment = this.id ? this.route.snapshot.data['record'] : new PoliceDepartment();
  
    // Police Department Types
    this.genParameterTypeService.getByCategory(GenParameterCategory.PoliceDepartment_Type, []).subscribe(responseData => {
      this.pPoliceDepartmentType = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.policeDepartmentForm.dirty;
  }
  
  newRecord() {
    this.router.navigate(['/sa/policedepartment/view']);
  }
  
  goToList() {
    this.router.navigate(['/sa/policedepartment/list']);
  }
  
  savePoliceDepartment() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.policeDepartmentService.savePoliceDepartment(this.policeDepartment).subscribe({
      next: (responseData: PoliceDepartment) => {
        this.toitsuToasterService.showSuccessStay();
        this.policeDepartmentForm.form.markAsPristine();
        
        if (!this.id) {
          this.router.navigate(['/sa/policedepartment/view', responseData.id]);
        } else {
          this.policeDepartment = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    })
      .add(() => {
        this.toitsuBlockUiService.unblockUi();
      });
  }
}
