import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VacationTypeService} from './vacation-type.service';

@Injectable({providedIn: 'root'})
export class VacationTypeResolver implements Resolve<any> {

  constructor(private vacationTypeService: VacationTypeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.vacationTypeService.getVacationType(route.paramMap.get('id'));
  }
}
