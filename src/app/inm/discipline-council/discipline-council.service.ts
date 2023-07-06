import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {disciplineConsts} from '../discipline/discipline.consts';
import {disciplineCouncilConsts} from './discipline-council.consts';


@Injectable({providedIn: 'root'})
export class DisciplineCouncilService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineCouncil(id) {
    return this.http
      .get(
        environment.apiBaseUrl + disciplineCouncilConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDisciplineCouncil(disciplineCouncil) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineCouncilConsts.saveUrl,
        disciplineCouncil
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDisciplineCouncil(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + disciplineCouncilConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  completeDisciplineCouncil(disciplineCouncilId) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineCouncilConsts.completeUrl,
        disciplineCouncilId
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  disciplineReportHasDisciplineOffensesInsideDisciplineCouncils(disciplineReportId) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineCouncilConsts.disciplineReportHasDisciplineOffensesInsideDisciplineCouncilsUrl,
        disciplineReportId
      );
  }

}
