import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {HearingTypeService} from './hearing-type.service';

@Injectable({providedIn: 'root'})
export class HearingTypeResolver implements Resolve<any> {

  constructor(private hearingTypeService: HearingTypeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.hearingTypeService.getHearingType(route.paramMap.get('id'), route.pathFromRoot[1].routeConfig.path.toUpperCase());
  }
}
