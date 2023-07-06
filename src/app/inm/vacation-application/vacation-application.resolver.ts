import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {VacationApplicationService} from './vacation-application.service';

@Injectable({providedIn: 'root'})
export class VacationApplicationResolver implements Resolve<any> {
  constructor(private vacationApplicationService: VacationApplicationService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.vacationApplicationService.getVacationApplication(route.paramMap.get('id'));
  }
}
