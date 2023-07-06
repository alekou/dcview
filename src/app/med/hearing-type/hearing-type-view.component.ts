import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {DateService} from '../../toitsu-shared/date.service';
import {HearingTypeService} from './hearing-type.service';
import {Observable} from 'rxjs';
import {HearingType} from './hearing-type.model';

@Component({
  selector: 'app-med-hearing-type-view',
  templateUrl: 'hearing-type-view.component.html'
})
export class HearingTypeViewComponent implements OnInit, ExitConfirmation {
  id: number;
  hearingType: HearingType;
  @ViewChild(NgForm) hearingTypeForm: NgForm;

  kinds = [];
  
  constructor(  
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private enumService: EnumService,
    private dateService: DateService,
    private hearingTypeService: HearingTypeService) {}

  ngOnInit(): void {
    // Get the id from the activatedRoute
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the activatedRoute resolver or initialize a new one
    this.hearingType = this.id ? this.activatedRoute.snapshot.data['record'] : new HearingType();
    
    // Kinds
    this.enumService.getEnumValues('med.core.enums.HearingTypeKind').subscribe(responseData => {
      this.kinds = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.hearingTypeForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/hearingtype/view']);
  }

  goToList() {
    this.router.navigate(['/med/hearingtype/list']);
  }

  saveHearingType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.hearingTypeService.saveHearingType(this.hearingType).subscribe({
      next: (responseData: HearingType) => {
        this.toitsuToasterService.showSuccessStay();
        this.hearingTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/hearingtype/view', responseData.id]);
        }
        else {
          this.hearingType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  deleteHearingType() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.hearingTypeService.deleteHearingType(this.hearingType.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.hearingTypeForm.form.markAsPristine();
            this.router.navigate(['/med/hearingtype/list']);
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
    if (this.hearingType.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }
}
