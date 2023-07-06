import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {visitProgramTimeFramesConsts} from './visit-program-time-frame.consts';

@Injectable({providedIn: 'root'})
export class VisitProgramTimeFrameService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVisitProgramTimeFrame(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitProgramTimeFramesConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
