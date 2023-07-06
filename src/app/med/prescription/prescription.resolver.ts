import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {PrescriptionService} from './prescription.service';

@Injectable({providedIn: 'root'})
export class PrescriptionResolver implements Resolve<any> {

  constructor(private prescriptionService: PrescriptionService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.prescriptionService.getPrescription(route.paramMap.get('id'));
  }
}
