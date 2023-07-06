import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DoctorInmateService} from './doctor-inmate.service';

@Injectable({providedIn: 'root'})
export class DoctorInmateResolver implements Resolve<any> {

  constructor(private doctorInmateService: DoctorInmateService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.doctorInmateService.getDoctorInmate(route.paramMap.get('id'));
  }
}
