import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {VisitApplication} from '../visit-application.model';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-visitor-list-dialog',
  templateUrl: 'approved-and-pending-visit-applications-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class ApprovedAndPendingVisitApplicationsDialogComponent extends DefaultValueAccessor implements OnInit {
  
  
  yesNoEnums = [];
  
  inmateId;
  

  visitApplications = [];
  selectedVisitApplication: VisitApplication;
  approvedVisitApplications = [];
  pendingVisitApplications = [];

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private enumService: EnumService,
    private toitsuToasterService: ToitsuToasterService,
    private renderer: Renderer2,
    private elementRef: ElementRef

  ) {
    super(renderer, elementRef, true);
    
    this.visitApplications = this.dynamicDialogConfig.data['visitApplications'];
    this.approvedVisitApplications = this.visitApplications.filter(visitApplication => visitApplication.approved === 'APPROVED');
    this.pendingVisitApplications = this.visitApplications.filter(visitApplication => visitApplication.approved === 'PENDING');
  }

  ngOnInit() {
    
  }

  confirm() {
    if (!this.selectedVisitApplication) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.selectedVisitApplication);
    }
  }
  cancel() {
    this.dynamicDialogRef.close();
  }
  
  getDateFromDateTimeString(dateTime: string): string {
    if (dateTime) {
      return dateTime.split(' ')[0];
    } else {
      return '';
    }
  }

}
