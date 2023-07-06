import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VisitApplicationService} from './visit-application.service';


@Injectable({providedIn: 'root'})
export class VisitApplicationResolver implements Resolve<any> {
  
  constructor(private visitService: VisitApplicationService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.visitService.getVisitApplication(route.paramMap.get('id'));
  }
}
