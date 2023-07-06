import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {examinationConsts} from './examination.consts';

@Injectable({providedIn: 'root'})
export class ExaminationService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getExamination(id) {
    return this.http
      .get(
        environment.apiBaseUrl + examinationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveExamination(examination) {
    return this.http
      .post(
        environment.apiBaseUrl + examinationConsts.saveUrl,
        examination
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteExamination(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + examinationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveExaminationList(examinations) {
    return this.http
      .post(
        environment.apiBaseUrl + examinationConsts.saveListUrl,
        examinations
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
