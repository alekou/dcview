import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {prescriptionConsts} from './prescription.consts';

@Injectable({providedIn: 'root'})
export class PrescriptionService {


  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getPrescription(id) {
    return this.http
      .get(
        environment.apiBaseUrl + prescriptionConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  savePrescription(prescription) {
    return this.http
      .post(
        environment.apiBaseUrl + prescriptionConsts.saveUrl,
        prescription
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deletePrescription(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + prescriptionConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getSerialNumber() {
    return this.http
      .get(
        environment.apiBaseUrl + prescriptionConsts.getSerialNumberUrl
      );
  }
}
