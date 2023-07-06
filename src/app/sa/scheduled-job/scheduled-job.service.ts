import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {scheduledJobConsts} from './scheduled-job.consts';

@Injectable({providedIn: 'root'})
export class ScheduledJobService {

  constructor(
    private http: HttpClient
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  generateNotificationsJobExists() {
    return this.http
      .get(
        environment.apiBaseUrl + scheduledJobConsts.generateNotificationsJobExistsUrl,
        {}
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  createGenerateNotificationsJob() {
    return this.http
      .post(
        environment.apiBaseUrl + scheduledJobConsts.createGenerateNotificationsJobUrl,
        {}
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteGenerateNotificationsJob() {
    return this.http
      .post(
        environment.apiBaseUrl + scheduledJobConsts.deleteGenerateNotificationsJobUrl,
        {}
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

}
