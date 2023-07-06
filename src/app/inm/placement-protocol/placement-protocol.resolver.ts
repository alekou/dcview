import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {PlacementProtocolService} from './placement-protocol.service';

@Injectable({providedIn: 'root'})
export class PlacementProtocolResolver implements Resolve<any> {

  constructor(private placementProtocolService: PlacementProtocolService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.placementProtocolService.getPlacementProtocol(route.paramMap.get('id'));
  }
  
}
