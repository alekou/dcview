import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {discReportOffenseConsts} from '../disc-report-offense/disc-report-offense.consts';
import {disciplineDecisionConsts} from './discipline-decision.consts';
import {disciplineOffenseConsts} from '../discipline-offense/discipline-offense.consts';


@Injectable({providedIn: 'root'})
export class DisciplineDecisionService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineDecision(id) {
    return this.http
      .get(
        environment.apiBaseUrl + disciplineDecisionConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDisciplineDecision(disciplineDecision, disciplineCouncilId) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineDecisionConsts.saveUrl,
        disciplineDecision,
        {
          params: this.toitsuSharedService.initHttpParams({disciplineCouncilId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDisciplineDecision(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + disciplineDecisionConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
}
