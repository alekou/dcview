import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DisciplineOffenseService} from './discipline-offense.service';

@Injectable({providedIn: 'root'})
export class DisciplineOffenseResolver implements Resolve<any> {
  
  constructor(private disciplineOffenseService: DisciplineOffenseService) {}

  resolve(route: ActivatedRouteSnapshot)
  {
    return this.disciplineOffenseService.getDisciplineOffense(route.paramMap.get('id'));
  }

}
