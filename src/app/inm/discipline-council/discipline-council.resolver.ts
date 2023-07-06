import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DisciplineCouncilService} from './discipline-council.service';

@Injectable({providedIn: 'root'})
export class DisciplineCouncilResolver implements Resolve<any> {
  
  constructor(private disciplineCouncilService: DisciplineCouncilService) {}
  
  resolve(route: ActivatedRouteSnapshot)
  {
    return this.disciplineCouncilService.getDisciplineCouncil(route.paramMap.get('id'));
  }
}
