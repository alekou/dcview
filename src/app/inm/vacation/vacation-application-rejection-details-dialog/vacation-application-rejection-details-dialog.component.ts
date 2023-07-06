import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {Vacation} from '../vacation.model';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {VacationApplicationService} from '../../vacation-application/vacation-application.service';
import {VacationApplication} from '../../vacation-application/vacation-application.model';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-vacation-application-rejection-details-dialog',
  templateUrl: 'vacation-application-rejection-details-dialog.component.html'
})
export class VacationApplicationRejectionDetailsDialogComponent implements OnInit{

  @ViewChild(NgForm) vacationApplicationForm: NgForm;

  dirtyForm: boolean = false;
  vacation: Vacation = new Vacation();
  vacationTemp: Vacation = new Vacation();
  vacationCouncilAccomplishedStatus: boolean;
  vacationApplication: VacationApplication = new VacationApplication();
  councilSubmitted: boolean;
  dcId: number;

  checked: boolean = false;

  constructor(private dynamicDialogConfig: DynamicDialogConfig,
              private dynamicDialogRef: DynamicDialogRef,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuBlockUiService: ToitsuBlockUiService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.vacation = this.dynamicDialogConfig.data['vacation'];
    this.vacationCouncilAccomplishedStatus = this.dynamicDialogConfig.data['accomplished'];

    this.checked = true;
  }
  
  
  lockedForm(){
    
    if (this.councilSubmitted){
      return true;
    }
    
    if (!this.vacationTemp) {
      return true;
    }
    
    if (this.vacationCouncilAccomplishedStatus) {
      return true;
    }

    return false;
  }

  confirm() {
    this.toitsuToasterService.clearMessages();
    this.dirtyForm = this.vacationApplicationForm.form.dirty;
    this.dynamicDialogRef.close([this.vacation, this.dirtyForm]);
  }

  cancel() {
    if (this.vacationApplicationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {
        }
      });
    }
    else {
      this.dynamicDialogRef.close();
    }
  }
}
