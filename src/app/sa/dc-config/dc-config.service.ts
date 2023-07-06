import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {dcConfigConsts} from './dc-config.consts';

@Injectable({providedIn: 'root'})
export class DcConfigService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDcConfigByDc() {
    return this.http
      .get(
        environment.apiBaseUrl + dcConfigConsts.getUrl
        /*{
          params: this.toitsuSharedService.initHttpParams({dcId})
        }*/
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDcConfig(dcConfig) {
    return this.http
      .post(
        environment.apiBaseUrl + dcConfigConsts.saveUrl,
        dcConfig
      );
  }
}
