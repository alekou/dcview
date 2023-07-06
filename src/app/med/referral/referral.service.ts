import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {referralConsts} from './referral.consts';

@Injectable({providedIn: 'root'})
export class ReferralService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getReferral(id) {
    return this.http
      .get(
        environment.apiBaseUrl + referralConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveReferral(referral) {
    return this.http
      .post(
        environment.apiBaseUrl + referralConsts.saveUrl,
        referral
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteReferral(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + referralConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getReferralsForInmateTransfer(inmateId, exceptTransferId?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + referralConsts.getForInmateTransferUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, exceptTransferId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
