import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {transportConsts} from './transport.consts';
import {environment} from '../../../environments/environment';

// CRUD Υλοποιήσεις για τη ΒΔ
@Injectable({providedIn: 'root'})
export class TransportService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // READ
  getTransport(id) {
    return this.http
      .get(
        environment.apiBaseUrl + transportConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // CREATE και UPDATE μαζί, με βάση το id
  saveTransport(transport) {
    return this.http
      .post(
        environment.apiBaseUrl + transportConsts.saveUrl, transport);
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // DELETE με βάση το id
  deleteTransport(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + transportConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
