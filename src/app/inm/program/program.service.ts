import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {programConsts} from './program.consts';

@Injectable({providedIn: 'root'})
export class ProgramService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getProgram(id) {
    return this.http
      .get(
        environment.apiBaseUrl + programConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveProgram(program) {
    return this.http
      .post(
        environment.apiBaseUrl + programConsts.saveUrl,
        program
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteProgram(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + programConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getPrograms(ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + programConsts.getAllUrl, {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
