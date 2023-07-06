import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {HearingApplicationService} from './hearing-application.service';

@Injectable({providedIn: 'root'})
export class HearingApplicationResolver implements Resolve<any> {

  constructor(private hearingApplicationService: HearingApplicationService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.hearingApplicationService.getHearingApplication(route.paramMap.get('id'), route.pathFromRoot[1].routeConfig.path.toUpperCase());
  }
}
