import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {vaccinationConsts} from './vaccination.consts';

@Injectable({providedIn: 'root'})
export class VaccinationService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getVaccination(id) {
    return this.http
      .get(
        environment.apiBaseUrl + vaccinationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveVaccination(vaccination) {
    return this.http
      .post(
        environment.apiBaseUrl + vaccinationConsts.saveUrl,
        vaccination
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVaccination(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vaccinationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
