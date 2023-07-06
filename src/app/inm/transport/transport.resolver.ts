import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {TransportService} from './transport.service';

@Injectable({providedIn: 'root'})
export class TransportResolver implements Resolve<any> {

  constructor(private transportService: TransportService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.transportService.getTransport(route.paramMap.get('id'));
  }
}
