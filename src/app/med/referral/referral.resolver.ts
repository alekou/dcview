import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ReferralService} from './referral.service';

@Injectable({providedIn: 'root'})
export class ReferralResolver implements Resolve<any> {

  constructor(private referralService: ReferralService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
    return this.referralService.getReferral(route.paramMap.get('id'));
  }
}
