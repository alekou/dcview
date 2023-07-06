import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {genParameterTypeConsts} from './gen-parameter-type.consts';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';

@Injectable({providedIn: 'root'})
export class GenParameterTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getGenParameterType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + genParameterTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getGenParameterTypeByCategory(category) {
    return this.http
      .get(
        environment.apiBaseUrl + genParameterTypeConsts.getByCategoryUrl,
        {
          params: this.toitsuSharedService.initHttpParams({category})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveGenParameterType(genParameterType) {
    return this.http
      .post(
        environment.apiBaseUrl + genParameterTypeConsts.saveUrl,
        genParameterType
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteGenParameterType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + genParameterTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllGenParameterTypes() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + genParameterTypeConsts.getAllUrl
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getGenParameterTypeByGenParameterCategory(category, isActive, doNotIncludeNotSelectable, ids?) { // TODO φεύγει
    category = GenParameterCategory[category];
    return this.http
      .get<{}>(
        environment.apiBaseUrl + genParameterTypeConsts.getByCategoryWithGenParametersUrl,
        {
          params: this.toitsuSharedService.initHttpParams({category, isActive, doNotIncludeNotSelectable, ids})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getByCategory(category, ids?) {
    category = GenParameterCategory[category];
    let doNotIncludeNotSelectable = true;
    let isActive = true;
    return this.http
      .get<{}>(
        environment.apiBaseUrl + genParameterTypeConsts.getByCategoryWithGenParametersUrl,
        {
          params: this.toitsuSharedService.initHttpParams({category, isActive, doNotIncludeNotSelectable, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
