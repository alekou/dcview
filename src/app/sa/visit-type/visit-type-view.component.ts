import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {VisitType} from './visit-type.model';
import {VisitTypeService} from './visit-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-sa-visit-type-view',
  templateUrl: 'visit-type-view.component.html'
})
export class VisitTypeViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  visitType: VisitType;
  @ViewChild(NgForm) visitTypeForm: NgForm;
  
  visitTypeKinds = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private visitTypeService: VisitTypeService,
    private enumService: EnumService,
    public authService: AuthService
  ) {
  }
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.visitType = this.id ? this.route.snapshot.data['record'] : new VisitType();
  
    this.enumService.getEnumValues('inm.core.enums.VisitTypeKind').subscribe(responseData => {
      this.visitTypeKinds = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.visitTypeForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.visitType.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }
  
  newRecord() {
    this.router.navigate(['/sa/visittype/view']);
  }
  
  goToList() {
    this.router.navigate(['/sa/visittype/list']);
  }
  
  saveVisitType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.visitTypeService.saveVisitType(this.visitType).subscribe({
      next: (responseData: VisitType) => {
        this.toitsuToasterService.showSuccessStay();
        this.visitTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/visittype/view', responseData.id]);
        } else {
          this.visitType = responseData;
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
