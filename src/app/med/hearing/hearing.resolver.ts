import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {HearingService} from './hearing.service';

@Injectable({providedIn: 'root'})
export class HearingResolver implements Resolve<any> {

  constructor(private hearingService: HearingService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.hearingService.getHearing(route.paramMap.get('id'));
  }
}
