import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {SessionTypeService} from './session-type.service';

@Injectable({providedIn: 'root'})
export class SessionTypeResolver implements Resolve<any> {

  constructor(private sessionTypeService: SessionTypeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.sessionTypeService.getSessionType(route.paramMap.get('id'));
  }
}
