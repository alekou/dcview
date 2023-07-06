import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {TreatmentService} from './treatment.service';

@Injectable({providedIn: 'root'})
export class TreatmentResolver implements Resolve<any> {

  constructor(private treatmentService: TreatmentService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.treatmentService.getTreatment(route.paramMap.get('id'));
  }
}
