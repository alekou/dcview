import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ProgramService} from './program.service';

@Injectable({providedIn: 'root'})
export class ProgramResolver implements Resolve<any> {

  constructor(private programService: ProgramService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.programService.getProgram(route.paramMap.get('id'));
  }
}
