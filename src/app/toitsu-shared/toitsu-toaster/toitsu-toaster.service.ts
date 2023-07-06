import {Injectable} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class ToitsuToasterService {
  
  constructor(
    private jsonPipe: JsonPipe,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}
  
  clearMessages() {
    this.messageService.clear();
  }
  
  showSuccessStay(message?) {
    if (!message) {
      message = this.translate.instant('global.save.success');
    }
    this.clearMessages();
    this.messageService.add({severity: 'success', summary: '', detail: message, life: 99999});
  }
  
  showErrorStay(message) {
    this.clearMessages();
    this.messageService.add({severity: 'error', summary: '', detail: message, life: 99999});
  }
  
  showInfoStay(message) {
    this.clearMessages();
    this.messageService.add({severity: 'info', summary: '', detail: message, life: 99999});
  }
  
  apiValidationErrors(response) {
    if (response && response.status === 422 && response.error && response.error.errors && response.error.errors.length > 0) {
      let fullError = '';
      for (const error of response.error.errors) {
        fullError += error + '<br/>';
      }
      this.messageService.add({severity: 'error', summary: '', detail: fullError, life: 99999});
    }
    else {
      let detail;
      if (response['error'] && response['error']['errorId']) {
        detail = '<b>' + this.translate.instant('global.error.500.title') + '</b>' + '<br />' +
          this.translate.instant('global.error.500.errorId') + ': ' +  response['error']['errorId'] + '<br />' +
          this.translate.instant('global.error.500.errorMessage') + ': ' +  response['error']['errorMessage'];
      }
      else {
        detail = this.jsonPipe.transform(response);
      }
      
      this.messageService.add({severity: 'error', summary: '', detail: detail, life: 99999});
    }
  }
}
