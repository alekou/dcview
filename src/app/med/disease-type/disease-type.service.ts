import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {diseaseTypeConsts} from './disease-type.consts';

@Injectable({providedIn: 'root'})
export class DiseaseTypeService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDiseaseType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + diseaseTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDiseaseType(diseaseType) {
    return this.http
      .post(
        environment.apiBaseUrl + diseaseTypeConsts.saveUrl,
        diseaseType
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDiseaseType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + diseaseTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllDiseaseTypes() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + diseaseTypeConsts.getAllUrl
      );
  }
}
