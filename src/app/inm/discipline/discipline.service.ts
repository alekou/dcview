import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {disciplineConsts} from './discipline.consts';
import {environment} from '../../../environments/environment';
import {InmateLaborApplication} from '../inmate-labor-application/inmate-labor-application.model';
import {inmateLaborApplicationConsts} from '../inmate-labor-application/inmate-labor-application.consts';
import {Discipline} from './discipline.model';

@Injectable({providedIn: 'root'})
export class DisciplineService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDiscipline(id) {
    return this.http
      .get(
        environment.apiBaseUrl + disciplineConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDiscipline(discipline) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineConsts.saveUrl,
        discipline
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDiscipline(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + disciplineConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  unmergeDiscipline(discipline) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineConsts.unmergeDisciplineUrl,
        discipline
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplinesToMerge(inmateId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + disciplineConsts.getDisciplinesToMergeUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplinesToUnmerge(relatedDisciplineId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + disciplineConsts.getDisciplinesToUnmergeUrl,
        {
          params: this.toitsuSharedService.initHttpParams({relatedDisciplineId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  createDisciplinesFromDisciplineDecisions(disciplineDecisionIds) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineConsts.createDisciplinesFromDisciplineDecisionsUrl,
        disciplineDecisionIds
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplinesOfDisciplineCouncil(disciplineCouncilId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + disciplineConsts.getDisciplinesOfDisciplineCouncilUrl,
        {
          params: this.toitsuSharedService.initHttpParams({disciplineCouncilId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplinesCreatedByGivenDisciplineDecision(disciplineDecisionId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + disciplineConsts.getDisciplinesCreatedByGivenDisciplineDecisionUrl,
        {
          params: this.toitsuSharedService.initHttpParams({disciplineDecisionId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDisciplineList(disciplineList: Discipline[]) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineConsts.saveDisciplineListUrl,
        disciplineList
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  massCreateDisciplines(disciplineList: Discipline[]) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineConsts.massDisciplineCreateUrl,
        disciplineList
      );
  }

}
