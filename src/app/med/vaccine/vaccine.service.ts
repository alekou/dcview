import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {vaccineConsts} from './vaccine.consts';

@Injectable({providedIn: 'root'})
export class VaccineService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getVaccine(id) {
    return this.http
      .get(
        environment.apiBaseUrl + vaccineConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveVaccine(vaccine) {
    return this.http
      .post(
        environment.apiBaseUrl + vaccineConsts.saveUrl,
        vaccine
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVaccine(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vaccineConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllVaccines() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + vaccineConsts.getAllUrl
      );
  }
}
