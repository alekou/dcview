import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {ProgramApplication} from '../program-application.model';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../../../sa/gen-parameter-type/gen-parameter-type.model';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-program-application-withdrawal-details-dialog',
  templateUrl: 'program-application-withdrawal-details-dialog.component.html'
})
export class ProgramApplicationWithdrawalDetailsDialogComponent implements OnInit{

  programStatus: string;
  dcId: number;
  withdrawal;
  withdrawalReasonPid;
  endDate;
  withdrawalComments;
  pWithdrawalReasons = {};
  dirtyForm: boolean = false;
  

  programApplicationTemp: ProgramApplication = new ProgramApplication();

  @ViewChild(NgForm) programApplicationForm: NgForm;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private toitsuToasterService: ToitsuToasterService,
    private genParameterTypeService: GenParameterTypeService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    
    this.programApplicationTemp.withdrawal = this.dynamicDialogConfig.data['withdrawal'];
    this.programApplicationTemp.withdrawalReasonPid = this.dynamicDialogConfig.data['withdrawalReasonPid'];
    this.programApplicationTemp.endDate = this.dynamicDialogConfig.data['endDate'];
    this.programApplicationTemp.withdrawalComments = this.dynamicDialogConfig.data['withdrawalComments'];
    this.programStatus = this.dynamicDialogConfig.data['programStatus'];
    this.dcId = this.dynamicDialogConfig.data['dcId'];
    
    // Withdrawal Reasons
    this.genParameterTypeService.getByCategory(GenParameterCategory.ProgramApplication_WithdrawalReason, [this.programApplicationTemp.withdrawalReasonPid]).subscribe((responseData: GenParameterType) => {
      this.pWithdrawalReasons = responseData;
    });
  }

  confirm() {
    this.toitsuToasterService.clearMessages();
    this.dirtyForm = this.programApplicationForm.form.dirty;
    this.dynamicDialogRef.close([this.programApplicationTemp, this.dirtyForm]);
  }

  cancel() {
    if (this.programApplicationForm.dirty) {
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
  
  lockedForm(){
    // Ολοκληρομένο πρόγραμμα
    if (this.programStatus === 'COMPLETED'){
      return true;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }
}
