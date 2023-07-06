import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VaccineService} from './vaccine.service';

@Injectable({providedIn: 'root'})
export class VaccineResolver implements Resolve<any> {
  constructor(private vaccineService: VaccineService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.vaccineService.getVaccine(route.paramMap.get('id'));
  }
}
