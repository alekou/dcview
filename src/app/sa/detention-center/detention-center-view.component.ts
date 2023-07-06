import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DetentionCenter} from './detention-center.model';
import {DetentionCenterService} from './detention-center.service';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-sa-detention-center-view',
  templateUrl: 'detention-center-view.component.html'
})
export class DetentionCenterViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  detentionCenter: DetentionCenter;
  @ViewChild(NgForm) detentionCenterForm: NgForm;
  
  detentionCenters = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private detentionCenterService: DetentionCenterService,
    private enumService: EnumService,
    public authService: AuthService
  ) {
  }
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.detentionCenter = this.id ? this.route.snapshot.data['record'] : new DetentionCenter();
  
    this.enumService.getEnumValues('inm.core.enums.DcType').subscribe(responseData => {
      this.detentionCenters = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.detentionCenterForm.dirty;
  }
  
  lockedRecord() {
  
    // Tο Υπουργείο μπορεί να δημιουργεί νέες εγγραφές και να επεξεργάζεται τις υπάρχουσες
    if (this.authService.isMinistry()) {
      return false;
    }
    
    // Ένα Κατάστημα μπορεί να βλέπει και να τροποποιεί μόνο τα δικά του στοιχεία
    if (this.detentionCenter.id !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }
  
  newRecord() {
    this.router.navigate(['/sa/detentioncenter/view']);
  }
  
  goToList() {
    this.router.navigate(['/sa/detentioncenter/list']);
  }
  
  saveDetentionCenter() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.detentionCenterService.saveDetentionCenter(this.detentionCenter).subscribe({
      next: (responseData: DetentionCenter) => {
        this.toitsuToasterService.showSuccessStay();
        this.detentionCenterForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/detentioncenter/view', responseData.id]);
        } else {
          this.detentionCenter = responseData;
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
