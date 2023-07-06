import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VisitTypeService} from './visit-type.service';

@Injectable({providedIn: 'root'})
export class VisitTypeResolver implements Resolve<any> {

  constructor(private visitTypeService: VisitTypeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.visitTypeService.getVisitType(route.paramMap.get('id'));
  }
}
