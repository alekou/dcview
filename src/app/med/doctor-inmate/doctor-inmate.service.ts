import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {doctorInmateConsts} from './doctor-inmate.consts';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class DoctorInmateService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDoctorInmate(id) {
    return this.http
      .get(
        environment.apiBaseUrl + doctorInmateConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDoctorInmate(doctorInmate) {
    return this.http
      .post(
        environment.apiBaseUrl + doctorInmateConsts.saveUrl,
        doctorInmate
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDoctorInmate(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + doctorInmateConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActiveDoctorInmateByInmateId(inmateId) {
    return this.http
      .get(
        environment.apiBaseUrl + doctorInmateConsts.getActiveDoctorInmateUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }
}

