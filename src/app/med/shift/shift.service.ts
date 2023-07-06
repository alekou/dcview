import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {shiftConsts} from './shift.consts';

@Injectable({providedIn: 'root'})
export class ShiftService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getShift(id) {
    return this.http
      .get(
        environment.apiBaseUrl + shiftConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveShift(shift) {
    return this.http
      .post(
        environment.apiBaseUrl + shiftConsts.saveUrl,
        shift
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteShift(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + shiftConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getActiveShift() {
    return this.http
      .get(
        environment.apiBaseUrl + shiftConsts.getActiveUrl
      );
  }
}
