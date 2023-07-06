import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {laborProtocolConsts} from './labor-protocol.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class LaborProtocolService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getLaborProtocol(id) {
    return this.http
      .get(
        environment.apiBaseUrl + laborProtocolConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveLaborProtocol(laborProtocol) {
    return this.http
      .post(
        environment.apiBaseUrl + laborProtocolConsts.saveUrl,
        laborProtocol
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteLaborProtocol(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + laborProtocolConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  approveLaborProtocol(id) {
    return this.http
      .post(
        environment.apiBaseUrl + laborProtocolConsts.approveUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
