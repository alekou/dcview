import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {hearingTypeConsts} from './hearing-type.consts';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';


@Injectable({
  providedIn: 'root'
})
export class HearingTypeService {

  constructor(private http: HttpClient,
              private toitsuSharedService: ToitsuSharedService) {
  }

  getHearingType(id, hearingTypeKind) {
    return this.http
      .get(
        environment.apiBaseUrl + hearingTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id, hearingTypeKind})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveHearingType(hearingType) {
    return this.http
      .post(
        environment.apiBaseUrl + hearingTypeConsts.saveUrl,
        hearingType
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteHearingType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + hearingTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  

  getAllHearingTypes(hearingTypeKind, isActive, ids?) {
    return this.http
      .get<{}[]>(environment.apiBaseUrl + hearingTypeConsts.getAllUrl, {
      params: this.toitsuSharedService.initHttpParams({hearingTypeKind, isActive, ids})
    }
  );
  }
}
