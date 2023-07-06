import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AreaService} from './area.service';

@Injectable({providedIn: 'root'})
export class AreaResolver implements Resolve<any> {

  constructor(private areaService: AreaService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.areaService.getArea(route.paramMap.get('id'));
  }
}

