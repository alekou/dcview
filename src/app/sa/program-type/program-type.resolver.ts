import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ProgramTypeService} from './program-type.service';

@Injectable({providedIn: 'root'})
export class ProgramTypeResolver implements Resolve<any> {

  constructor(private programTypeService: ProgramTypeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.programTypeService.getProgramType(route.paramMap.get('id'));
  }
}
