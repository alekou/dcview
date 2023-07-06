import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {LaborProtocolService} from './labor-protocol.service';

@Injectable({providedIn: 'root'})
export class LaborProtocolResolver implements Resolve<any> {
  
  constructor(private laborProtocolService: LaborProtocolService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.laborProtocolService.getLaborProtocol(route.paramMap.get('id'));
  }
}
