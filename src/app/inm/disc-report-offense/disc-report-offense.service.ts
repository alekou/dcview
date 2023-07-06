import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {discReportOffenseConsts} from './disc-report-offense.consts';


@Injectable({providedIn: 'root'})
export class DiscReportOffenseService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDiscReportOffense(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + discReportOffenseConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

}
