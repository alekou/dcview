import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {courthouseConsts} from './courthouse.consts';

@Injectable({providedIn: 'root'})
export class CourthouseService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getCourthouse(id) {
    return this.http
      .get(
        environment.apiBaseUrl + courthouseConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveCourthouse(courthouse) {
    return this.http
      .post(
        environment.apiBaseUrl + courthouseConsts.saveUrl,
        courthouse
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteCourthouse(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + courthouseConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
