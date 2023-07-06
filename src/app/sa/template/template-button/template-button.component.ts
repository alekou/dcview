import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {TemplateListDialogComponent} from '../template-list-dialog/template-list-dialog.component';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';

@Component({
  selector: 'app-template-button',
  templateUrl: 'template-button.component.html'
})
export class TemplateButtonComponent {
  constructor(
    private translate: TranslateService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService
  ) {
  }

  @Input() entity: string;
  @Input() entityId: number;
  @Input() entityIdColName: string;
  @Input() application: string;
  @Input() iconMode: boolean = false;
  @Input() doctorType: string;
  @Input() fromDoctorSession: boolean = false;

  openTemplateListDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(TemplateListDialogComponent, {
      header: this.translate.instant('template.select.dialogTitle'),
      width: '95%',
      data: {
        hideTab: this.fromDoctorSession,
        entity: this.entity,
        entityId: this.entityId,
        application: this.application,
        doctorType: this.doctorType
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        if (!result.report) {
          let application = this.application;
          let templateId = result.id;
          let entity = this.entity;
          let entityId = this.entityId;
          let entityIdColName = this.entityIdColName;
          if (this.fromDoctorSession){
           
         }else {
            window.open('/sa/report/create/' + application + '/' + templateId + '/' + entity + '/' + entityId + '/' + entityIdColName, '_blank');
          }
         
        }
      }
    });
  }
}
