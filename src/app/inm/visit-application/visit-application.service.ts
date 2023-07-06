import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {visitApplicationConsts} from './visit-application.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class VisitApplicationService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getVisitApplication(id) {
    return this.http
      .get(
        environment.apiBaseUrl + visitApplicationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  getVisitApplicationByInmateAndVisitTypeId(inmateId: number, visitTypeId: number) {
    return this.http
      .get(
        environment.apiBaseUrl + visitApplicationConsts.getByInmateIdAndVisitTypeIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, visitTypeId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveVisitApplication(visitApplication) {
    return this.http
      .post(
        environment.apiBaseUrl + visitApplicationConsts.saveUrl,
        visitApplication
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  deleteVisitApplication(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitApplicationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getVisitApplicationAndInmateId(id, inmateId) {
    return this.http
      .get(
        environment.apiBaseUrl + visitApplicationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id, inmateId})
        }
      );
  }
  
}
