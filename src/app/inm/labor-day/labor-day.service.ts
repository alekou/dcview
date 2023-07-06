import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {laborDayConsts} from './labor-day.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class LaborDayService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getLaborDay(id) {
    return this.http
      .get(
        environment.apiBaseUrl + laborDayConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveLaborDay(laborDay) {
    return this.http
      .post(
        environment.apiBaseUrl + laborDayConsts.saveUrl,
        laborDay
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteLaborDay(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + laborDayConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getAvailableDailyNormalInmateLabors(args) {
    return this.http
      .post<{}[]>(
        environment.apiBaseUrl + laborDayConsts.getAvailableDailyNormalUrl,
        args
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getAvailablePeriodSpecialInmateLabors(args) {
    return this.http
      .post<{}[]>(
        environment.apiBaseUrl + laborDayConsts.getAvailablePeriodSpecialUrl,
        args
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveDailyNormalLaborDays(list) {
    return this.http
      .post<{}[]>(
        environment.apiBaseUrl + laborDayConsts.saveDailyNormalUrl,
        list
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  savePeriodSpecialLaborDays(list) {
    return this.http
      .post<{}[]>(
        environment.apiBaseUrl + laborDayConsts.savePeriodSpecialUrl,
        list
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getLaborDaysForProtocol(args) {
    return this.http
      .post(
        environment.apiBaseUrl + laborDayConsts.getForProtocolUrl,
        args
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
