import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {vacationCouncilConsts} from './vacation-council.consts';
import {vacationApplicationConsts} from '../vacation-application/vacation-application.consts';

@Injectable({providedIn: 'root'})
export class VacationCouncilService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------
  getVacationCouncil(id) {
    return this.http
      .get(
        environment.apiBaseUrl + vacationCouncilConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveVacationCouncil(vacationCouncil) {
    return this.http
      .post(
        environment.apiBaseUrl + vacationCouncilConsts.saveUrl,
        vacationCouncil
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  submitVacationCouncil(submitCouncilData) {
    return this.http
      .post(
        environment.apiBaseUrl + vacationCouncilConsts.submitCouncilUrl,
        submitCouncilData
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVacationCouncil(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vacationCouncilConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  deleteVacationApplication(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vacationApplicationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
