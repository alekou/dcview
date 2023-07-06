import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ProgramProtocolService} from './program-protocol.service';

@Injectable({providedIn: 'root'})
export class ProgramProtocolResolver implements Resolve<any> {

  constructor(private programProtocolService: ProgramProtocolService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.programProtocolService.getProgramProtocol(route.paramMap.get('id'));
  }
}
