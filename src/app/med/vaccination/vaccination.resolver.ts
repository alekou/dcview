import {Injectable} from '@angular/core';
import {VaccinationService} from './vaccination.service';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

@Injectable({providedIn: 'root'})
export class VaccinationResolver implements Resolve<any> {
  
  constructor(private vaccinationService: VaccinationService) {
  }
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.vaccinationService.getVaccination(route.paramMap.get('id'));
  }
}
