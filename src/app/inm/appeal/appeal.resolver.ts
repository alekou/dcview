import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AppealService} from './appeal.service';

@Injectable({providedIn: 'root'})
export class AppealResolver implements Resolve<any> {

  constructor(private appealService: AppealService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.appealService.getAppeal(route.paramMap.get('id'));
  }
}
