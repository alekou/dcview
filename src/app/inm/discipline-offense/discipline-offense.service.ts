import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {disciplineOffenseConsts} from './discipline-offense.consts';
import {judgmentConsts} from '../judgment/judgment.consts';


@Injectable({providedIn: 'root'})
export class DisciplineOffenseService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineOffense(id) {
    return this.http
      .get(
        environment.apiBaseUrl + disciplineOffenseConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDisciplineOffense(disciplineOffense) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineOffenseConsts.saveUrl,
        disciplineOffense
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDisciplineOffense(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + disciplineOffenseConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineOffensesToRelate(data) {
    return this.http
      .post<[]>(
        environment.apiBaseUrl + disciplineOffenseConsts.getDisciplineOffensesToRelateUrl,
        data
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineOffensesOfDisciplineReportsForDisciplineCouncil(ids) {
    return this.http
      .get<{}>(
        environment.apiBaseUrl + disciplineOffenseConsts.getDisciplineOffensesOfDisciplineReportsForDisciplineCouncilUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDisciplineOffenseList(disciplineOffenseList) {
    return this.http
      .post<{}[]>(
        environment.apiBaseUrl + disciplineOffenseConsts.saveDisciplineOffenseListUrl,
        disciplineOffenseList
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineOffensesByDisciplineDecisionId(disciplineDecisionId) {
    return this.http
      .get<{}>(
        environment.apiBaseUrl + disciplineOffenseConsts.getDisciplineOffensesByDisciplineDecisionIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({disciplineDecisionId})
        }
      );
  }


  // ---------------------------------------------------------------------------------------------------------------------------------------

  mergeDisciplineOffenses(data) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineOffenseConsts.mergeUrl,
        data
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  unmergeDisciplineOffense(inmateId, disciplineOffenseIdToUnmerge) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineOffenseConsts.unmergeUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, disciplineOffenseIdToUnmerge})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineOffensesByDisciplineId(disciplineId) {
    return this.http
      .get<{}>(
        environment.apiBaseUrl + disciplineOffenseConsts.getDisciplineOffensesByDisciplineIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({disciplineId})
        }
      );
  }



  // ---------------------------------------------------------------------------------------------------------------------------------------


}
