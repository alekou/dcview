import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AreaType} from './area-type.model';
import {AreaTypeService} from './area-type.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-sa-area-type-view',
  templateUrl: 'area-type-view.component.html'
})
export class AreaTypeViewComponent implements OnInit {

  id: number;
  areaType: AreaType;
  @ViewChild(NgForm) areaTypeForm: NgForm;


  constructor(
    private areaTypeService: AreaTypeService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Αποθήκευση του id της εγγραφής από το URL
    this.id = +this.route.snapshot.params['id'];

    // Φόρτωση εγγραφής βάση του id ή δημιουργία νέας εγγραφής
    this.areaType = this.id ? this.route.snapshot.data['record'] : new AreaType();

  }

  confirmExit(): boolean | Observable<boolean> {
    return this.areaTypeForm.dirty;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.areaType.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    return false;
  }

  newRecord() {
    this.router.navigate(['/sa/areatype/view']);
  }

  goToList() {
    this.router.navigate(['/sa/areatype/list']);
  }

  saveAreaType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.areaTypeService.saveAreaType(this.areaType).subscribe({
      next: (responseData: AreaType) => {
        this.toitsuToasterService.showSuccessStay();
        this.areaTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/areatype/view', responseData.id]);
        } else {
          this.areaType = responseData;
        }
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteAreaType() {
    this.confirmationService.confirm({
      message: this.translateService.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.areaTypeService.deleteAreaType(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translateService.instant('global.delete.success'));
            this.areaTypeForm.form.markAsPristine();
            this.router.navigate(['/sa/areatype/list']);
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

}
