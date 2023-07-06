import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {CourthouseService} from './courthouse.service';

@Injectable({providedIn: 'root'})
export class CourthouseResolver implements Resolve<any> {

  constructor(private courthouseService: CourthouseService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.courthouseService.getCourthouse(route.paramMap.get('id'));
  }
}
