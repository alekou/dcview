import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {vacationCouncilApplicationsConsts} from './vacation-council-application.consts';

@Injectable({providedIn: 'root'})
export class VacationCouncilApplicationService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVacationCouncilApplication(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vacationCouncilApplicationsConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
