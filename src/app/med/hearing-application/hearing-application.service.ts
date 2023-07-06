import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {hearingApplicationConsts} from './hearing-application.consts';
import {diseaseConsts} from '../disease/disease.consts';

@Injectable({providedIn: 'root'})
export class HearingApplicationService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getHearingApplication(id, hearingTypeKind) {
    return this.http
      .get(
        environment.apiBaseUrl + hearingApplicationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id, hearingTypeKind})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveHearingApplication(hearingApplication) {
    return this.http
      .post(
        environment.apiBaseUrl + hearingApplicationConsts.saveUrl,
        hearingApplication
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteHearingApplication(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + hearingApplicationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getAllHearingApplicationsByInmateId(inmateId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + hearingApplicationConsts.getAllUrl, {

          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
