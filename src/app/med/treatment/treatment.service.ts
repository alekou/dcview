import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {treatmentConsts} from './treatment.consts';

@Injectable({providedIn: 'root'})
export class TreatmentService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getTreatment(id) {
    return this.http
      .get(
        environment.apiBaseUrl + treatmentConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveTreatment(treatment) {
    return this.http
      .post(
        environment.apiBaseUrl + treatmentConsts.saveUrl,
        treatment
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteTreatment(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + treatmentConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  stopTreatment(treatment) {
    return this.http
      .post(
        environment.apiBaseUrl + treatmentConsts.stopUrl, 
        treatment
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getSerialNumber() {
    return this.http
      .get(
        environment.apiBaseUrl + treatmentConsts.getSerialNumberUrl
      );
  }
}
