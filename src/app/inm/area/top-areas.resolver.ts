import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AreaService} from './area.service';

@Injectable({providedIn: 'root'})
export class TopAreasResolver implements Resolve<any> {

  constructor(
    private areaService: AreaService) {
  }

  resolve() {
    return this.areaService.getTopAreas();
  }
}
