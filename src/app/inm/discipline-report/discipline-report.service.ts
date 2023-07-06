import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {disciplineReportConsts} from './discipline-report.consts';

@Injectable({providedIn: 'root'})
export class DisciplineReportService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisciplineReport(id) {
    return this.http
      .get(
        environment.apiBaseUrl + disciplineReportConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDisciplineReport(disciplineReport) {
    return this.http
      .post(
        environment.apiBaseUrl + disciplineReportConsts.saveUrl,
        disciplineReport
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDisciplineReport(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + disciplineReportConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getRelatedDisciplineReportsOfDisciplineOffense(disciplineOffenseId, excludedDisciplineReportId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + disciplineReportConsts.getRelatedDisciplineReportsOfDisciplineOffenseUrl,
        {
          params: this.toitsuSharedService.initHttpParams({disciplineOffenseId, excludedDisciplineReportId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
}
