import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {transferTypeConsts} from './transfer-type.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class TransferTypeService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActiveTransferTypesByUserDc(ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + transferTypeConsts.getActiveByUserDcUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
