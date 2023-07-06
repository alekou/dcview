import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {GateMovementService} from './gate-movement.service';

@Injectable({providedIn: 'root'})
export class GateMovementResolver implements Resolve<any> {

  constructor(private gateMovementService: GateMovementService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.gateMovementService.getGateMovement(route.paramMap.get('id'));
  }
}
