import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {BloodSamplingService} from './blood-sampling.service';

@Injectable({providedIn: 'root'})
export class BloodSamplingResolver implements Resolve<any> {
  constructor(private bloodSamplingService: BloodSamplingService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.bloodSamplingService.getBloodSampling(route.paramMap.get('id'));
  }
}
