import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DoctorSessionService} from './doctor-session.service';

@Injectable({providedIn: 'root'})
export class DoctorSessionResolver implements Resolve<any> {

  constructor(private doctorSessionService: DoctorSessionService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.doctorSessionService.getDoctorSession(route.paramMap.get('id'));
  }
}
