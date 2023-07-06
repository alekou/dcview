import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {inmateLaborConsts} from './inmate-labor.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class InmateLaborService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getInmateLabor(id) {
    return this.http
      .get(
        environment.apiBaseUrl + inmateLaborConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveInmateLabor(inmateLabor) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateLaborConsts.saveUrl,
        inmateLabor
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteInmateLabor(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + inmateLaborConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getInmateLaborsByInmateAndUserDc(inmateId, ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + inmateLaborConsts.getByInmateAndUserDcUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
