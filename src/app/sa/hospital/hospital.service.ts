import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {hospitalConsts} from './hospital.consts';

@Injectable({providedIn: 'root'})
export class HospitalService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getHospital(id) {
    return this.http
      .get(
        environment.apiBaseUrl + hospitalConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveHospital(hospital) {
    return this.http
      .post(
        environment.apiBaseUrl + hospitalConsts.saveUrl, hospital);
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActiveHospitals(ids?) {
    return this.http
      .get<{}[]> (
        environment.apiBaseUrl + hospitalConsts.getActiveUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
