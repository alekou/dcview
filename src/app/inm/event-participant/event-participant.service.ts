import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {eventParticipantConsts} from './event-participant.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class EventParticipantService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteEventParticipant(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + eventParticipantConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
}
