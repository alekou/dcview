import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {visitProgramDetailsConsts} from './visit-program-time-frame.consts';

@Injectable({providedIn: 'root'})
export class VisitProgramDetailsService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVisitProgramDetails(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitProgramDetailsConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
