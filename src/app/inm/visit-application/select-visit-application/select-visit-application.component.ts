import {Component, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, Renderer2, SimpleChanges, SkipSelf, OnInit} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {
  ApprovedAndPendingVisitApplicationsDialogComponent
} from '../visit-application-list-dialog/approved-and-pending-visit-applications-dialog.component';
import {VisitApplicationService} from '../visit-application.service';
import {VisitApplication} from '../visit-application.model';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-select-visit-application',
  templateUrl: 'select-visit-application.component.html',
  styleUrls: ['./select-visit-application.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class SelectVisitApplicationComponent extends DefaultValueAccessor implements OnChanges, OnInit {

  @Input() model: number;
  modelVisitApplication: VisitApplication;
  @Output() modelChange = new EventEmitter<number>();
  @Output() modelChangeVisitApplication = new EventEmitter<VisitApplication>();

  @Input() name: string;



  @Input() inmateId: number;
  @Input() visitTypeId: number;
  @Input() disabled = false;


  visitApplicationLabel: string;
  labelVisible = false; // Μπήκε γιατί δε γινόταν σωστά το autoResize του textarea

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private controlContainer: ControlContainer,
    private translate: TranslateService,
    private dialogService: DialogService,
    private visitApplicationService: VisitApplicationService,
    private toitsuToasterService: ToitsuToasterService,
  ) {
    super(renderer, elementRef, true);
  }

  ngOnInit() {
    if (this.modelVisitApplication == null && this.model) {
      this.writeValue(this.model);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model) {
      this.setVisitApplicationLabel(this.modelVisitApplication);
    }
  }

  emitModelChange() {
    this.modelChange.emit(this.model);
    this.modelChangeVisitApplication.emit(this.modelVisitApplication);
  }

  writeValue(value: any) {

    super.writeValue(value);

    this.model = value;

    if (value) {
      this.visitApplicationService.getVisitApplicationAndInmateId(value, this.inmateId).subscribe(responseData => {
        if (responseData) {

          this.modelVisitApplication = <VisitApplication> responseData;
          this.emitModelChange();
          this.setVisitApplicationLabel(this.modelVisitApplication);
        }
      });
    } else {
      this.modelVisitApplication = null;
      this.emitModelChange();
      this.setVisitApplicationLabel(this.modelVisitApplication);
    }
  }

  setVisitApplicationLabel(visitApplication: VisitApplication) {
    
    
    if (visitApplication) {
      
      let visitApplicationLabel = '';

      // Λεκτικό κατάστασης
      if (visitApplication.approvedLabel) {
        visitApplicationLabel += visitApplication.approvedLabel + ' | ';
      }

      // Λεκτικό τύπου επισκεπτηρίου
      if (visitApplication.visitTypeDescription) {
        visitApplicationLabel += visitApplication.visitTypeDescription + ' | ';
      }

      // Περιγραφικό επισκεπτών
      if (visitApplication.visitorName) {
        visitApplicationLabel += visitApplication.visitorName + ' | ';
      }

      // Στοιχεία πραγματοποίησης επισκεπτηρίου
      if (visitApplication.frequent) {
        
        if (visitApplication.visitDateFrom || visitApplication.visitDateTo) {
          
          if (visitApplication.visitDateFrom) {
            visitApplicationLabel += '' + visitApplication.visitDateFrom.toString().split('/').join('-').split(' ')[0];
          }
          
          if (visitApplication.visitDateTo) {
            visitApplicationLabel += '/' + visitApplication.visitDateTo.toString().split('/').join('-').split(' ')[0] + ' ';
          }
          
        }
      } else {
        
        if (visitApplication.visitDate) {
          visitApplicationLabel += '' + visitApplication.visitDate.toString().split('/').join('-').split(' ')[0] + ' ';
        }
        
      }

      // Συχνότητα
      if (visitApplication.frequency) {
        visitApplicationLabel += visitApplication.frequency + ' ';
      }

      visitApplicationLabel += ' | ';
      
      // Αριθμός αιτήματος και Ημερομηνία αιτήματος
      if (visitApplication.applicationNo) {
        visitApplicationLabel += '' + visitApplication.applicationNo + '/';
      } else {
        visitApplicationLabel += ' ';
      }
      
      if (visitApplication.applicationDate) {
        visitApplicationLabel += '' + visitApplication.applicationDate.toString().split('/').join('-').split(' ')[0] + ' | ';
      } else {
        visitApplicationLabel += ' | ';
      }

      // Κείμενο Έγκρισης
      if (visitApplication.approvalText) {
        visitApplicationLabel += '' + visitApplication.approvalText + ' ';
      }

      this.visitApplicationLabel = visitApplicationLabel;

      this.resizeLabel();

    } else {
      this.visitApplicationLabel = null;
      this.resizeLabel();
    }
  }

  hasId() {
    return !!(this.model);
  }

  removeRecord() {
    this.writeValue(null);
    this.resizeLabel();
  }

  resizeLabel() {
    this.labelVisible = false;
    setTimeout(() => {
      this.labelVisible = true;
    });
  }

  openApprovedAndPendingVisitApplicationsDialog() {

    this.visitApplicationService.getVisitApplicationByInmateAndVisitTypeId(this.inmateId, this.visitTypeId).subscribe(response => {

        let visitApplications = <[]> response;


        if (visitApplications.length !== 0) {
          
          this.toitsuToasterService.clearMessages();
          const ref = this.dialogService.open(ApprovedAndPendingVisitApplicationsDialogComponent, {
            header: this.translate.instant('visitApplication.select.dialogTitle'),
            data: {
              visitApplications: visitApplications
            },
            closable: false,
          });

          ref.onClose.subscribe(result => {
            if (result) {
              this.writeValue(result.id);
            }
          });
        }
      }
    );
  }
}
