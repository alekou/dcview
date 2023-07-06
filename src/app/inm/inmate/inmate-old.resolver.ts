import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {InmateService} from './inmate.service';

@Injectable({providedIn: 'root'})
export class InmateOldResolver implements Resolve<any> {
  
  constructor(private inmateService: InmateService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.inmateService.getOldInmate(route.paramMap.get('id'));
  }
}
