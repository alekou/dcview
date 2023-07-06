import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {doctorConsts} from './doctor.consts';

@Injectable({providedIn: 'root'})
export class DoctorService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDoctor(id) {
    return this.http
      .get(
        environment.apiBaseUrl + doctorConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDoctor(doctor) {
    return this.http
      .post(
        environment.apiBaseUrl + doctorConsts.saveUrl,
        doctor
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDoctor(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + doctorConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllDoctors() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + doctorConsts.getAllUrl
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllActiveDoctors() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + doctorConsts.getActiveDoctorsUrl
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllTreatmentDoctors() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + doctorConsts.getTreatmentDoctorsUrl
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getActiveDoctorsByUserAndDoctorType(doctorType) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + doctorConsts.getActiveByUserAndDoctorType, {
          params: this.toitsuSharedService.initHttpParams({doctorType})}
      );
  }
}

