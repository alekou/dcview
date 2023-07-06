import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {GateMovementTypeService} from './gate-movement-type.service';

@Injectable({providedIn: 'root'})
export class GateMovementTypeResolver implements Resolve<any> {

  constructor(private gateMovementTypeService: GateMovementTypeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.gateMovementTypeService.getGateMovementType(route.paramMap.get('id'));
  }
}
