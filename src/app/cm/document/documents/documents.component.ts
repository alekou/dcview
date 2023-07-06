import {Component, Input, OnInit} from '@angular/core';
import {DocumentUploadDialogComponent} from '../document-upload-dialog/document-upload-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DocumentService} from '../document.service';

@Component({
  selector: 'app-documents',
  templateUrl: 'documents.component.html'
})
export class DocumentsComponent implements OnInit {
  
  @Input() entityId: number;
  @Input() entity: string;
  @Input() inmateId: number;
  count: number = 0;
  
constructor(
  private documentService: DocumentService,
  private translate: TranslateService,
  private dialogService: DialogService,
  private toitsuBlockUiService: ToitsuBlockUiService,
) {}


  ngOnInit() {
    if (this.entityId) {
      this.getDocumentsCount();
    }
  }
  
  uploadFiles() {
    this.toitsuBlockUiService.blockUi();
    // Δημιουργία
    const ref = this.dialogService.open(DocumentUploadDialogComponent, {
      data: {
        entity: this.entity,
        entityId : this.entityId,
        inmateId: this.inmateId
      },
      header: this.translate.instant('global.upload'),
      style: {width: '75%'}
    });
    ref.onClose.subscribe(result => {
      if (result) {
        this.getDocumentsCount();
      }
    });
    this.toitsuBlockUiService.unblockUi();
  }

  getDocumentsCount() {
    this.documentService.getDocumentsByEntityAndEntityId(this.entity, this.entityId).subscribe(responseData => {
      if (responseData) {
        this.count = responseData.length;
      }
    });
  }
}
