import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {eventRecordConsts} from './event-record.consts';
import {environment} from '../../../environments/environment';

// CRUD Υλοποιήσεις για τη ΒΔ
@Injectable({providedIn: 'root'})
export class EventRecordService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // READ
  getEventRecord(id) {
    return this.http
      .get(
        environment.apiBaseUrl + eventRecordConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // CREATE και UPDATE μαζί, με βάση το id
  saveEventRecord(eventRecord) {
    return this.http
      .post(
        environment.apiBaseUrl + eventRecordConsts.saveUrl, eventRecord);
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // DELETE με βάση το id
  deleteEventRecord(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + eventRecordConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
