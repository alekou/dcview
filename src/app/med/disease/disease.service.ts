import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {diseaseConsts} from './disease.consts';

@Injectable({providedIn: 'root'})
export class DiseaseService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDisease(id) {
    return this.http
      .get(
        environment.apiBaseUrl + diseaseConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDisease(disease) {
    return this.http
      .post(
        environment.apiBaseUrl + diseaseConsts.saveUrl,
        disease
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDisease(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + diseaseConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
