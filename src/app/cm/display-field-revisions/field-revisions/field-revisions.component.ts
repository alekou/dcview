import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DisplayFieldRevisionsComponent} from '../display-field-revisions.component';


@Component({
  selector: 'app-field-revisions',
  templateUrl: 'field-revisions.component.html'
})
export class FieldRevisionsComponent{

  @Input() entityId: number;
  @Input() entityClass: string;
  @Input() fieldName: string;
  @Input() iconMode: boolean = false;
  @Input() tableMode: boolean = false;

  constructor(
    private translate: TranslateService,
    private dialogService: DialogService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {}


  displayFieldRevisions(event) {
    if (event){
      event.stopPropagation();
    }
 
    this.toitsuBlockUiService.blockUi();

    const ref = this.dialogService.open(DisplayFieldRevisionsComponent, {
      data: {
        entityClass: this.entityClass,
        entityId : this.entityId,
        fieldName: this.fieldName
      },
      header: this.translate.instant('global.displayFieldRevisions'),
      width: '70%'
    });
    ref.onClose.subscribe(result => {
    });
    this.toitsuBlockUiService.unblockUi();
  }
}
