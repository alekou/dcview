import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {genParameterConsts} from './gen-parameter.consts';
import {environment} from '../../../environments/environment';
import {GenParameterCategory} from './gen-parameter.category';

@Injectable({providedIn: 'root'})
export class GenParameterService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getGenParameter(id) {
    return this.http
      .get(
        environment.apiBaseUrl + genParameterConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveGenParameter(genParameter) {
    return this.http
      .post(
        environment.apiBaseUrl + genParameterConsts.saveUrl,
        genParameter
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getByCategoryAndSelectable(category, isActive, doNotIncludeNotSelectable, ids?) {
    category = GenParameterCategory[category];
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + genParameterConsts.getByCategoryUrl,
        {
          params: this.toitsuSharedService.initHttpParams({category, isActive, doNotIncludeNotSelectable, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getByCategory(category, isActive, ids?) {
    category = GenParameterCategory[category];
    let doNotIncludeNotSelectable = true;
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + genParameterConsts.getByCategoryUrl,
        {
          params: this.toitsuSharedService.initHttpParams({category, isActive, doNotIncludeNotSelectable, ids})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getByCategoryAndCode(category, code, isActive, ids?) {
    category = GenParameterCategory[category];
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + genParameterConsts.getByCategoryAndCodeUrl,
        {
          params: this.toitsuSharedService.initHttpParams({category, code, isActive, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
