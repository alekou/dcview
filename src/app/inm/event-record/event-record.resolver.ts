import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {EventRecordService} from './event-record.service';

@Injectable({providedIn: 'root'})
export class EventRecordResolver implements Resolve<any> {

  constructor(private eventRecordService: EventRecordService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.eventRecordService.getEventRecord(route.paramMap.get('id'));
  }
}
