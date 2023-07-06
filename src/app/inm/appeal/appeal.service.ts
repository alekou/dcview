import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {appealConsts} from './appeal.consts';
import {environment} from '../../../environments/environment';

// CRUD Υλοποιήσεις για τη ΒΔ
@Injectable({providedIn: 'root'})
export class AppealService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // READ
  getAppeal(id) {
    return this.http
      .get(
        environment.apiBaseUrl + appealConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // CREATE και UPDATE μαζί, με βάση το id
  saveAppeal(appeal) {
    return this.http
      .post(
        environment.apiBaseUrl + appealConsts.saveUrl, appeal);
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // DELETE με βάση το id
  deleteAppeal(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + appealConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
