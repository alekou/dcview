import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {countryConsts} from './country.consts';

@Injectable({providedIn: 'root'})
export class CountryService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getCountry(id) {
    return this.http
      .get(
        environment.apiBaseUrl + countryConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveCountry(country) {
    return this.http
      .post(
        environment.apiBaseUrl + countryConsts.saveUrl,
        country
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteCountry(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + countryConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getCountries(isActive, ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + countryConsts.getListUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ isActive, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
