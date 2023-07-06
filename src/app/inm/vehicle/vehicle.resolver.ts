import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VehicleService} from './vehicle.service';

@Injectable({providedIn: 'root'})
export class VehicleResolver implements Resolve<any> {

  constructor(private vehicleService: VehicleService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.vehicleService.getVehicle(route.paramMap.get('id'));
  }
}
