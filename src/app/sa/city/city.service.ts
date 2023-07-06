import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {cityConsts} from './city.consts';

@Injectable({providedIn: 'root'})
export class CityService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteCity(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + cityConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getGreekCities(isActive, ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + cityConsts.getGreekCitiesUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ isActive, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getCitiesByCountryId(countryId, isActive, ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + cityConsts.getCitiesByCountryId,
        {
          params: this.toitsuSharedService.initHttpParams({ countryId, isActive, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
