import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {programProtocolConsts} from './program-protocol.consts';

@Injectable({providedIn: 'root'})
export class ProgramProtocolService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getProgramProtocol(id) {
    return this.http
      .get(
        environment.apiBaseUrl + programProtocolConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveProgramProtocol(programProtocol) {
    return this.http
      .post(
        environment.apiBaseUrl + programProtocolConsts.saveUrl,
        programProtocol
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteProgramProtocol(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + programProtocolConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  createInmateLabors(id: number) {
    return this.http
      .post(
        environment.apiBaseUrl + programProtocolConsts.createInmateLaborsUrl,
        id
      );
  }
}
