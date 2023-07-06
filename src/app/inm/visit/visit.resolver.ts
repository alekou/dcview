import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VisitService} from './visit.service';


@Injectable({providedIn: 'root'})
export class VisitResolver implements Resolve<any> {
  
  constructor(private visitService: VisitService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.visitService.getVisit(route.paramMap.get('id'));
  }
}
