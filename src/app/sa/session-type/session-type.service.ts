import { environment } from 'src/environments/environment';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {sessionTypeConsts} from './session-type.consts';

@Injectable({providedIn: 'root'})
export class SessionTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveSessionType(sessionType: any) {
    return this.http
      .post(
        environment.apiBaseUrl + sessionTypeConsts.saveUrl,
        sessionType
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteSessionType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + sessionTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getSessionType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + sessionTypeConsts.getByIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  


  getSessionTypesByDoctorType(doctorType) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + sessionTypeConsts.getByDoctorType, {
          params: this.toitsuSharedService.initHttpParams({doctorType})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
