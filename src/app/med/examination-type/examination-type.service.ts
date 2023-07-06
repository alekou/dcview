import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {examinationTypeConsts} from './examination-type.consts';

@Injectable({providedIn: 'root'})
export class ExaminationTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getExaminationType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + examinationTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveExaminationType(examination) {
    return this.http
      .post(
        environment.apiBaseUrl + examinationTypeConsts.saveUrl,
        examination
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteExaminationType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + examinationTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllExaminationTypes() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + examinationTypeConsts.getAllUrl
      );
  }
}
