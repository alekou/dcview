import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {enumConsts} from './enum.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class EnumService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getEnumValues(enumClass) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + enumConsts.getValuesUrl + `${enumClass}`,
        {
          params: this.toitsuSharedService.initHttpParams({})
        }
      );
  }
}
