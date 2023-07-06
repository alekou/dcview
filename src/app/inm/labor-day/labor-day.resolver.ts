import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {LaborDayService} from './labor-day.service';

@Injectable({providedIn: 'root'})
export class LaborDayResolver implements Resolve<any> {
  
  constructor(private laborDayService: LaborDayService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.laborDayService.getLaborDay(route.paramMap.get('id'));
  }
}
