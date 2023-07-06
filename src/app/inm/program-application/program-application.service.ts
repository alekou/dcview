import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {programApplicationConsts} from './program-application.consts';

@Injectable({providedIn: 'root'})
export class ProgramApplicationService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getProgramApplication(id) {
    return this.http
      .get(
        environment.apiBaseUrl + programApplicationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveProgramApplication(programApplication) {
    return this.http
      .post(
        environment.apiBaseUrl + programApplicationConsts.saveUrl,
        programApplication
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteProgramApplication(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + programApplicationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  detachProgramApplication(id) {
    return this.http
      .post(
        environment.apiBaseUrl + programApplicationConsts.detachProgramApplicationUrl,
        id
      );
  }
}
