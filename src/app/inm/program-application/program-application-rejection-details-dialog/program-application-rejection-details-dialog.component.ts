import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {ProgramApplication} from '../program-application.model';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../../toitsu-auth/auth.service';
@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-program-application-rejection-details-dialog',
  templateUrl: 'program-application-rejection-details-dialog.component.html'
})
export class ProgramApplicationRejectionDetailsDialogComponent implements OnInit{
  @ViewChild(NgForm) programApplicationForm: NgForm;
  
  dirtyForm: boolean = false;
  programApplicationTemp: ProgramApplication = new ProgramApplication();
  
  protocolApproved: boolean;
  dcId: number;
  

  constructor(private renderer: Renderer2,
              private elementRef: ElementRef,
              private dynamicDialogConfig: DynamicDialogConfig,
              private dynamicDialogRef: DynamicDialogRef,
              private toitsuToasterService: ToitsuToasterService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.programApplicationTemp.rejected = this.dynamicDialogConfig.data['rejected'];
    this.programApplicationTemp.rejectedDate = this.dynamicDialogConfig.data['rejectedDate'];
    this.programApplicationTemp.rejectedComments = this.dynamicDialogConfig.data['rejectedComments'];
    this.protocolApproved = this.dynamicDialogConfig.data['protocolApproved'];
    this.dcId = this.dynamicDialogConfig.data['dcId'];
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
    if (this.protocolApproved){
      return true;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }
  
}
