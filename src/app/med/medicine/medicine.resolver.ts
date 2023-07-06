import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {MedicineService} from './medicine.service';

@Injectable({providedIn: 'root'})
export class MedicineResolver implements Resolve<any> {
  constructor(private medicineService: MedicineService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
    return this.medicineService.getMedicine(route.paramMap.get('id'));
  }
}
