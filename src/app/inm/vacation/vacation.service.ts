import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {vacationConsts} from './vacation.consts';

@Injectable({providedIn: 'root'})
export class VacationService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getVacation(id) {
    return this.http
      .get(
        environment.apiBaseUrl + vacationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveVacation(vacation) {
    return this.http
      .post(
        environment.apiBaseUrl + vacationConsts.saveUrl,
        vacation
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVacation(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vacationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
