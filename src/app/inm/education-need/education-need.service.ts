import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';

import {environment} from '../../../environments/environment';
import {educationNeedConsts} from './education-need.consts';

@Injectable({providedIn: 'root'})
export class EducationNeedService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getEducationNeed(id) {
    return this.http
      .get(
        environment.apiBaseUrl + educationNeedConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveEducationNeed(educationNeed) {
    return this.http
      .post(
        environment.apiBaseUrl + educationNeedConsts.saveUrl,
        educationNeed
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteEducationNeed(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + educationNeedConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  initializeEducationNeed() {
    return this.http
      .get(
        environment.apiBaseUrl + educationNeedConsts.initializeUrl
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
