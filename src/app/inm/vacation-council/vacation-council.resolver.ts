import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VacationCouncilService} from './vacation-council.service';

@Injectable({providedIn: 'root'})
export class VacationCouncilResolver implements Resolve<any> {
  constructor(private vacationCouncilService: VacationCouncilService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.vacationCouncilService.getVacationCouncil(route.paramMap.get('id'));
  }
}
