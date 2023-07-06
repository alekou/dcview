import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {EducationNeedService} from './education-need.service';

@Injectable({providedIn: 'root'})
export class EducationNeedResolver implements Resolve<any> {

  constructor(private educationNeedService: EducationNeedService) {}

  resolve(route: ActivatedRouteSnapshot)
  {
    return this.educationNeedService.getEducationNeed(route.paramMap.get('id'));
  }
}
