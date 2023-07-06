import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {doctorSessionConsts} from './doctor-session.consts';

@Injectable({providedIn: 'root'})
export class DoctorSessionService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDoctorSession(id) {
    return this.http
      .get(
        environment.apiBaseUrl + doctorSessionConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDoctorSession(doctorSession) {
    return this.http
      .post(
        environment.apiBaseUrl + doctorSessionConsts.saveUrl,
        doctorSession
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDoctorSession(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + doctorSessionConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  addTemplateReportToDoctorSession(doctorSession, templateId, entityId) {
    return this.http
      .post(
        environment.apiBaseUrl + doctorSessionConsts.addTemplateReportUrl,
        doctorSession,
        {
          params: this.toitsuSharedService.initHttpParams({templateId, entityId})
        });
  }


  
  authorizeDoctor(doctorType) {
    return this.http
      .get(
        environment.apiBaseUrl + doctorSessionConsts.authorizeDoctorUrl,
        {
          params: this.toitsuSharedService.initHttpParams({doctorType})
        }
      );
  }
}
