import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {areaTypeConsts} from './area-type.consts';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';

@Injectable({providedIn: 'root'})
export class AreaTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAreaType(id) {
    return this.http
      .get(environment.apiBaseUrl + areaTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveAreaType(areaType) {
    return this.http
      .post(environment.apiBaseUrl + areaTypeConsts.saveUrl,
        areaType
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteAreaType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + areaTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAreaTypes() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaTypeConsts.getAllUrl
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
