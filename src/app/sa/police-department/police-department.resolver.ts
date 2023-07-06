import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {PoliceDepartmentService} from './police-department.service';

@Injectable({providedIn: 'root'})
export class PoliceDepartmentResolver implements Resolve<any> {

  constructor(private policeDepartmentService: PoliceDepartmentService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.policeDepartmentService.getPoliceDepartment(route.paramMap.get('id'));
  }
}
