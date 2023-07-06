import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ExaminationTypeService} from './examination-type.service';

@Injectable({providedIn: 'root'})
export class ExaminationTypeResolver implements Resolve<any> {

  constructor(private examinationTypeService: ExaminationTypeService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.examinationTypeService.getExaminationType(route.paramMap.get('id'));
  }
}
