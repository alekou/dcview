import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {hearingConsts} from './hearing.consts';
import {examinationTypeConsts} from '../examination-type/examination-type.consts';

@Injectable({providedIn: 'root'})
export class HearingService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getHearing(id) {
    return this.http
      .get(
        environment.apiBaseUrl + hearingConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveHearing(hearing) {
    return this.http
      .post(
        environment.apiBaseUrl + hearingConsts.saveUrl,
        hearing
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteHearing(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + hearingConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getAllHearingsByInmateId(inmateId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + hearingConsts.getAllUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }
}
