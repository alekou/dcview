import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {HospitalService} from './hospital.service';

@Injectable({providedIn: 'root'})
export class HospitalResolver implements Resolve<any> {

  constructor(private hospitalService: HospitalService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.hospitalService.getHospital(route.paramMap.get('id'));
  }
}
