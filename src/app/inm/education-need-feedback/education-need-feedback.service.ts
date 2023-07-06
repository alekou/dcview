import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {educationNeedFeedbackConsts} from './education-need-feedback.consts';

@Injectable({providedIn: 'root'})
export class EducationNeedFeedbackService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteEducationNeedFeedback(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + educationNeedFeedbackConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  initializeEducationNeedFeedback() {
    return this.http
      .get(
        environment.apiBaseUrl + educationNeedFeedbackConsts.initializeUrl
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}

