import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {discCouncilOffenseConsts} from './disc-council-offense.consts';
import {disciplineOffenseConsts} from '../discipline-offense/discipline-offense.consts';
import {disciplineCouncilConsts} from '../discipline-council/discipline-council.consts';


@Injectable({providedIn: 'root'})
export class DiscCouncilOffenseService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDiscCouncilOffense(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + discCouncilOffenseConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  postponeDisciplineOffenses(discCouncilOffenseList) {
    return this.http
      .post(
        environment.apiBaseUrl + discCouncilOffenseConsts.postponeDisciplineOffensesUrl,
          discCouncilOffenseList
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDiscCouncilOffenses(discCouncilOffenseList) {
    return this.http
      .post<{}[]>(
        environment.apiBaseUrl + discCouncilOffenseConsts.saveDiscCouncilOffensesUrl,
        discCouncilOffenseList
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  disciplineOffenseIsAddedInDisciplineCouncil(disciplineOffenseId) {
    return this.http
      .post(
        environment.apiBaseUrl + discCouncilOffenseConsts.disciplineOffenseIsAddedInDisciplineCouncilUrl,
        disciplineOffenseId
      );
  }


}
