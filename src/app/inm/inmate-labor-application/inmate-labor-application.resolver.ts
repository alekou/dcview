import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {InmateLaborApplicationService} from './inmate-labor-application.service';

@Injectable({providedIn: 'root'})
export class InmateLaborApplicationResolver implements Resolve<any> {

  constructor(private inmateLaborApplicationService: InmateLaborApplicationService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.inmateLaborApplicationService.getInmateLaborApplication(route.paramMap.get('id'));
  }
  
}
