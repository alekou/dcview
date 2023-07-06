import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {CourtSummonsService} from './court-summons.service';

@Injectable({providedIn: 'root'})
export class CourtSummonsResolver implements Resolve<any> {

  constructor(private courtSummonsService: CourtSummonsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.courtSummonsService.getCourtSummons(route.paramMap.get('id'));
  }
}
