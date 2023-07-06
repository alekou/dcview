import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {courtSummonsConsts} from './court-summons.consts';

@Injectable({providedIn: 'root'})
export class CourtSummonsService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getCourtSummons(id) {
    return this.http
      .get(
        environment.apiBaseUrl + courtSummonsConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveCourtSummons(courtSummons) {
    return this.http
      .post(
        environment.apiBaseUrl + courtSummonsConsts.saveUrl,
        courtSummons
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteCourtSummons(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + courtSummonsConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getCourtSummonsForInmateTransfer(inmateId, exceptTransferId?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + courtSummonsConsts.getForInmateTransferUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, exceptTransferId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
