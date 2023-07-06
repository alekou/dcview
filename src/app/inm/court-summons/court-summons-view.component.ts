import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {CourtSummons} from './court-summons.model';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {CourtSummonsService} from './court-summons.service';
import {DateService} from '../../toitsu-shared/date.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {CityService} from '../../sa/city/city.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-court-summons-view',
  templateUrl: 'court-summons-view.component.html'
})
export class CourtSummonsViewComponent implements OnInit, ExitConfirmation {
  id: number;
  courtSummons: CourtSummons;
  @ViewChild(NgForm) courtSummonsForm: NgForm;
  pDaOffices = {};
  cities = [];
  deliveryStatuses = [];

  inmateDialogUrl = inmateConsts.activeIndexUrl;

  constructor(private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuBlockUiService: ToitsuBlockUiService,
              private toitsuSharedService: ToitsuSharedService,
              public authService: AuthService,
              private courtSummonsService: CourtSummonsService,
              private enumService: EnumService,
              private dateService: DateService,
              private cityService: CityService,
              private genParameterTypeService: GenParameterTypeService
  ) {
  }

  ngOnInit(): void {
    // Get the id from the route
    this.id = +this.activatedRoute.snapshot.params['id'];

    this.cityService.getGreekCities(true, []).subscribe({
      next: (responseData) => {
        this.cities = responseData;
      }
    });

    // Get the record from the route resolver or initialize a new one
    this.courtSummons = this.id ? this.activatedRoute.snapshot.data['record'] : new CourtSummons();

    // Da Offices
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_DaOffice, [this.courtSummons.daOfficePid]).subscribe((responseData: GenParameterType) => {
      this.pDaOffices = responseData;
    });

    // Delivery Status
    this.enumService.getEnumValues('inm.core.enums.CourtSummonsDeliveryStatus').subscribe(responseData => {
      this.deliveryStatuses = responseData;
    });
    if (!this.id) {
      this.courtSummons.deliveryStatus = 'PENDING';
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.courtSummonsForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/courtsummons/view']);
  }

  goToList() {
    this.router.navigate(['/inm/courtsummons/list']);
  }

  saveCourtSummons() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.courtSummonsService.saveCourtSummons(this.courtSummons).subscribe({
      next: (responseData: CourtSummons) => {
        this.toitsuToasterService.showSuccessStay();
        this.courtSummonsForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/courtsummons/view', responseData.id]);
        } else {
          this.courtSummons = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteCourtSummons() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.courtSummonsService.deleteCourtSummons(this.courtSummons.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.courtSummonsForm.form.markAsPristine();
            this.router.navigate(['/inm/courtsummons/list']);
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
    if (this.courtSummons.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }
}
