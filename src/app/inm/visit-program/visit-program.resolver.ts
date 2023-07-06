import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VisitProgramService} from './visit-program.service';


@Injectable({providedIn: 'root'})
export class VisitProgramResolver implements Resolve<any> {
  
  constructor(private visitService: VisitProgramService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.visitService.getVisitProgram(route.paramMap.get('id'));
  }
}
