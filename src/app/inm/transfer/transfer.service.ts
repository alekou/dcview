import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {transferConsts} from './transfer.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class TransferService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getTransfer(id) {
    return this.http
      .get(
        environment.apiBaseUrl + transferConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveTransfer(transfer) {
    return this.http
      .post(
        environment.apiBaseUrl + transferConsts.saveUrl,
        transfer
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteTransfer(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + transferConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  completeTransferInProgress(completeData) {
    return this.http
      .post(
        environment.apiBaseUrl + transferConsts.completeInProgressUrl,
        completeData
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  cancelTransferInProgress(transferId) {
    return this.http
      .post(
        environment.apiBaseUrl + transferConsts.cancelInProgressUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({transferId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  receiveBackTransferFromTemporary(transferId) {
    return this.http
      .post(
        environment.apiBaseUrl + transferConsts.receiveBackFromTemporaryUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({transferId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
