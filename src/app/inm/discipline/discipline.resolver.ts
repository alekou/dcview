import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DisciplineService} from './discipline.service';

@Injectable({providedIn: 'root'})
export class DisciplineResolver implements Resolve<any> {
  
  constructor(private disciplineService: DisciplineService) {}
  
  resolve(route: ActivatedRouteSnapshot)
  {
    return this.disciplineService.getDiscipline(route.paramMap.get('id'));
  }
}
