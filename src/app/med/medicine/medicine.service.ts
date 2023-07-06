import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {medicineConsts} from './medicine.consts';

@Injectable({providedIn: 'root'})
export class MedicineService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getMedicine(id) {
    return this.http
      .get(
        environment.apiBaseUrl + medicineConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveMedicine(medicine) {
    return this.http
      .post(
        environment.apiBaseUrl + medicineConsts.saveUrl,
        medicine
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteMedicine(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + medicineConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllMedicinesByType(medicineTypeOption) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + medicineConsts.getAllUrl,
        {
          params: this.toitsuSharedService.initHttpParams({medicineTypeOption})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllMedicineVaccines() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + medicineConsts.getAllVaccinesUrl
      );
  }
}
