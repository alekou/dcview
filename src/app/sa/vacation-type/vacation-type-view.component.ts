import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {VacationType} from './vacation-type.model';
import {VacationTypeService} from './vacation-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-sa-vacation-type-view',
  templateUrl: 'vacation-type-view.component.html'
})
export class VacationTypeViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  vacationType: VacationType;
  @ViewChild(NgForm) vacationTypeForm: NgForm;
  
  vacationTypeKinds = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private vacationTypeService: VacationTypeService,
    private enumService: EnumService,
    public authService: AuthService
  ) {
  }
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.vacationType = this.id ? this.route.snapshot.data['record'] : new VacationType();
  
    this.enumService.getEnumValues('inm.core.enums.VacationTypeKind').subscribe(responseData => {
      this.vacationTypeKinds = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.vacationTypeForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.vacationType.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }
  
  newRecord() {
    this.router.navigate(['/sa/vacationtype/view']);
  }
  
  goToList() {
    this.router.navigate(['/sa/vacationtype/list']);
  }
  
  saveVacationType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.vacationTypeService.saveVacationType(this.vacationType).subscribe({
      next: (responseData: VacationType) => {
        this.toitsuToasterService.showSuccessStay();
        this.vacationTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/vacationtype/view', responseData.id]);
        } else {
          this.vacationType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}
