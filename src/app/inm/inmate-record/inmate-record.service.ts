import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {inmateRecordConsts} from './inmate-record.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class InmateRecordService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteInmateRecord(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + inmateRecordConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  closeInmateRecord(data) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateRecordConsts.closeUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  reopenInmateRecord(inmateId) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateRecordConsts.reopenUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  changeCriminalStatus(data) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateRecordConsts.changeCriminalStatusUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
