import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {InmateLaborService} from './inmate-labor.service';

@Injectable({providedIn: 'root'})
export class InmateLaborResolver implements Resolve<any> {
  
  constructor(private inmateLaborService: InmateLaborService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.inmateLaborService.getInmateLabor(route.paramMap.get('id'));
  }
}
