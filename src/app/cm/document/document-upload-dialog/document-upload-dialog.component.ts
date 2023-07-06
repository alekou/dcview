import {Component, OnInit, ViewChild} from '@angular/core';
import {DocumentService} from '../document.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {NgForm} from '@angular/forms';
import {Document} from '../document.model';
import {DateService} from '../../../toitsu-shared/date.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import {DocumentPreviewDialogComponent} from '../document-preview-dialog/document-preview-dialog.component';
import {FileUpload} from 'primeng/fileupload';

@Component({
  selector: 'app-cm-document-upload-dialog',
  templateUrl: 'document-upload-dialog.component.html',
  styleUrls: ['document-upload-dialog.component.css']
})
export class DocumentUploadDialogComponent implements OnInit {
  
  @ViewChild(NgForm) documentForm;
  @ViewChild('fileUpload') fileUpload: FileUpload;
  entity: string;
  style;
  entityId: number;
  inmateId: number;
  documentDtoList = [];
  documentFileList = [];
  constructor(
    private documentService: DocumentService,
    private dateService: DateService,
    private toitsuToasterService: ToitsuToasterService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private toitsuBlockUiService: ToitsuBlockUiService, 
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService
  ) {
    this.entity = this.dynamicDialogConfig.data['entity'];
    this.entityId = this.dynamicDialogConfig.data['entityId'];
    this.inmateId = this.dynamicDialogConfig.data['inmateId'];
  }
  
  ngOnInit(): void {
    if (this.entity && this.entityId) {
      this.documentService.getDocumentsByEntityAndEntityId(this.entity, this.entityId).subscribe(responseData => {
        if (responseData) {
          this.documentDtoList = responseData;
        }
      });
    }
  }
  
  openFileSelection(): void {
    this.fileUpload.choose();
    }
                                                                        
  onDocumentUpload(event) {
    for (let i = 0; i < event.files.length; i++) {
      this.documentFileList.push(event.files[i]);
      let document: Document =  new Document();
      document.inmateId = this.inmateId;
      document.entity = this.entity;
      document.entityId = this.entityId;
      document.fileName = event.files[i].name;
      document.submissionDate = this.dateService.getCurrentDateString() as unknown as Date;
      this.documentDtoList.push(document);
    }
    event.files.length = 0;
  }
  
  cancel() {
    if (this.documentForm.dirty) {
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

  saveDocuments() {
    const formData: FormData =  new FormData();
    formData.append('documentDtoList', JSON.stringify(this.documentDtoList));
    
    for (let i = 0; i < this.documentFileList.length; i++) {
      formData.append('documentFileList', this.documentFileList[i]);
    }
    this.documentService.saveDocuments(formData).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      this.dynamicDialogRef.close(this.documentDtoList);
    });
  }
  
  deleteDocument(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.documentDtoList.splice(index, 1);
          this.documentFileList.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          this.documentService.delete(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.documentDtoList.splice(index, 1);
              this.documentFileList.splice(index, 1);
              this.dynamicDialogRef.close(responseData);
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }
  
  previewDocument(document) {
    let url; let file; let fileNameExtension;
    
    // Παίρνουμε το extension του document για να το περάσουμε στον previewer για φιλτραρισμα
    fileNameExtension = this.getDocumentExtension(document.fileName);
    
    // Σε περίπτωση αρχείου που δεν έχει φύγει για αποθήκευση
    if (!document.id) {
      for (let i = 0; i < this.documentFileList.length; i++) {
        if (this.documentFileList[i].name === document.fileName) {
          // Παιρνουμε το αρχείο με βάση το όνομα
          file = this.documentFileList[i];
          let data: Blob;
          if (file.type) {
            // Αν ο τύπος του αρχείου δεν είναι κενός
            data = new Blob([this.documentFileList[i]], {type: file.type});
          }
          else {
            data = new Blob([this.documentFileList[i]]);
          }
          url = URL.createObjectURL(data);
          break;
        }
      }
      if (file) {
        // Αν πρόκειται για αρχείο sheet
        if (fileNameExtension === 'xls' || fileNameExtension === 'xlsx') {
          const ref = this.dialogService.open(DocumentPreviewDialogComponent, {
            data: {
              fileNameExtension: fileNameExtension,
              url: url
            },
            header: this.translate.instant('global.preview'),
            width: '85%',
            height: '90%'
          });
          ref.onClose.subscribe(result => {
          });
        }
        else {
          window.open(url);
        }
      }
    }
    else{
      this.documentService.previewDocument(document.id, document.fileName)
        .subscribe( {
          next: (responseData) => {
            let data;
            // Παίρνουμε τον τύπο του αρχείου απο το arrayBuffer
            let documentType = this.getTypeFromArrayBuffer(responseData);
            if (documentType) {
              data = new Blob([responseData], {type: documentType});
            }
            else{
              data = new Blob([responseData]);
            }
            url = URL.createObjectURL(data);
            // Αν πρόκειται για αρχείο sheet
            if (fileNameExtension === 'xls' || fileNameExtension === 'xlsx') {
              const ref = this.dialogService.open(DocumentPreviewDialogComponent, {
                data: {
                  fileNameExtension: fileNameExtension,
                  url: url
                },
                header: this.translate.instant('global.preview'),
                width: '85%',
                height: '90%'
              });
              ref.onClose.subscribe(result => {
              });
            }
            else {
              window.open(url);
            }
          },
          error: (responseError) => {
            let decodedString = new TextDecoder().decode(responseError.error);
            try {
              let jsonData = JSON.parse(decodedString);
              this.toitsuToasterService.apiValidationErrors({status: 422, error: jsonData});
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
            catch (e) {
              console.error(decodedString + e);
        }}
      });
    }
  }
  
  downloadDocument(id, document) {
    if (!document.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('error.download.documentMustBeSavedFirst'));
    }
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    this.documentService.downloadDocumentOpen1Fs(id, document.fileName).subscribe( {
      next: (responseData) => {
        const data: Blob = new Blob([responseData]);
        fileSaver.saveAs(data, document.fileName);
      },
      error: (responseError) => {
        let decodedString = new TextDecoder().decode(responseError.error);
        try {
          let jsonData = JSON.parse(decodedString);
          this.toitsuToasterService.apiValidationErrors({status: 422, error: jsonData});
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
        catch (e) {
          console.error(decodedString + e);
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  getDocumentExtension(filename) {
    return filename.split('.').pop();
  }
  
  getTypeFromArrayBuffer(arrayBuffer) {
    const uint8arr = new Uint8Array(arrayBuffer);
    const len = 4;
    if (uint8arr.length >= len) {
      let signatureArr = new Array(len);
      for (let i = 0; i < len; i++) {
        signatureArr[i] = (new Uint8Array(arrayBuffer))[i].toString(16);
      }
      const signature = signatureArr.join('').toUpperCase();
      
      switch (signature) {
        case '89504E47':
          return 'image/png';
        case '47494638':
          return 'image/gif';
        case '0001C':
          return 'image/avif';
        case 'FFD8FFE0':
          return 'image/jpeg';
        case '3C3F786D':
          return 'image/svg+xml';
        case '25504446':
          return 'application/pdf';
        case '504B0304':
          return 'application/zip';
        case '504B34':
          return 'application/vnd.ms-excel';
        default:
          return null;
      }
    }
    return null;
  }
}
