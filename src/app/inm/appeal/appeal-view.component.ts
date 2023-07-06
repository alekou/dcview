import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {Appeal} from './appeal.model';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {AppealService} from './appeal.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-appeal-view',
  templateUrl: 'appeal-view.component.html'
})
export class AppealViewComponent implements OnInit, ExitConfirmation {

  id: number;
  appeal: Appeal;
  @ViewChild(NgForm) appealForm: NgForm;
  pAppealType = {};
  inmateDialogUrl: string;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private appealService: AppealService,
    private genParameterTypeService: GenParameterTypeService
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.appeal = this.id ? this.route.snapshot.data['record'] : new Appeal();
  
    // Inmates
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Appeal_Type, [this.appeal.appealTypePid]).subscribe(responseData => {
      this.pAppealType = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.appealForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.appeal.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }

  newRecord() {
    this.router.navigate(['/inm/appeal/view']);
  }

  goToList() {
    this.router.navigate(['/inm/appeal/list']);
  }

  saveAppeal() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.appealService.saveAppeal(this.appeal).subscribe({
      next: (responseData: Appeal) => {
        this.toitsuToasterService.showSuccessStay();
        this.appealForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/appeal/view', responseData.id]);
        } else {
          this.appeal = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
        this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteAppeal() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.appealService.deleteAppeal(this.appeal.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.appealForm.form.markAsPristine();
            this.router.navigate(['/inm/appeal/list']);
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
