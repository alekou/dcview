import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DoctorService} from './doctor.service';

@Injectable({providedIn: 'root'})
export class DoctorResolver implements Resolve<any> {

  constructor(private doctorService: DoctorService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.doctorService.getDoctor(route.paramMap.get('id'));
  }
}
