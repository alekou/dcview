import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {vacationApplicationConsts} from './vacation-application.consts';

@Injectable({providedIn: 'root'})
export class VacationApplicationService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getVacationApplication(id) {
    return this.http
      .get(
        environment.apiBaseUrl + vacationApplicationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getCouncilsOfVacationApplication(vacationApplicationId) {
    return this.http
      .get<[]>(
        environment.apiBaseUrl + vacationApplicationConsts.getCouncilsOfVacationApplicationUrl,
        {
          params: this.toitsuSharedService.initHttpParams({vacationApplicationId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveVacationApplication(vacationApplication) {
    return this.http
      .post(
        environment.apiBaseUrl + vacationApplicationConsts.saveUrl,
        vacationApplication
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveVacationMotion(motionData) {
    return this.http
      .post(
        environment.apiBaseUrl + vacationApplicationConsts.saveMotionUrl,
        motionData
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  submitVacationMotion(submitMotionData) {
    return this.http
      .post(
        environment.apiBaseUrl + vacationApplicationConsts.submitMotionUrl,
        submitMotionData
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteVacationApplication(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vacationApplicationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
