import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Observable} from 'rxjs';
import {SessionType} from './session-type.model';
import {SessionTypeService} from './session-type.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-inm-session-type-view',
  templateUrl: 'session-type-view.component.html'
})
export class SessionTypeViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) sessionTypeForm: NgForm;
  id: number;
  sessionType: SessionType = new SessionType();
  doctorTypes = [];
  
  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    private enumService: EnumService,
    private sessionTypeService: SessionTypeService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.sessionType = this.id ? this.activatedRoute.snapshot.data['record'] : new SessionType();

    // DoctorType
    this.enumService.getEnumValues('med.core.enums.DoctorType').subscribe(responseData => {
      this.doctorTypes = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.sessionTypeForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/sessiontype/view']);
  }

  goToList() {
    this.router.navigate(['/sa/sessiontype/list']);
  }

  saveSessionType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.sessionTypeService.saveSessionType(this.sessionType).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.sessionTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/sessiontype/view/', responseData.id]);
        } else {
          this.sessionType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteSessionType() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.sessionTypeService.deleteSessionType(this.sessionType.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.sessionTypeForm.form.markAsPristine();
            this.router.navigate(['/sa/sessiontype/list']);
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
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.sessionType.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }
}
