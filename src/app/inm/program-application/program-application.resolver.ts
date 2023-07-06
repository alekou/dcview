import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ProgramApplicationService} from './program-application.service';

@Injectable({providedIn: 'root'})
export class ProgramApplicationResolver implements Resolve<any> {

  constructor(private programApplicationService: ProgramApplicationService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.programApplicationService.getProgramApplication(route.paramMap.get('id'));
  }
}
