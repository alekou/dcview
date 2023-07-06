import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AreaTypeService} from './area-type.service';

@Injectable({providedIn: 'root'})
export class AreaTypeResolver implements Resolve<any> {

  constructor(private areaTypeService: AreaTypeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.areaTypeService.getAreaType(route.paramMap.get('id'));
  }

}
