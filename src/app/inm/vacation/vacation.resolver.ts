import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {VacationService} from './vacation.service';

@Injectable({providedIn: 'root'})
export class VacationResolver implements Resolve<any> {
  constructor(private vacationService: VacationService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.vacationService.getVacation(route.paramMap.get('id'));
  }
}
