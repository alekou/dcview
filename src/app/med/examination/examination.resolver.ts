import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ExaminationService} from './examination.service';


@Injectable({providedIn: 'root'})
export class ExaminationResolver implements Resolve<any> {

  constructor(private examinationService: ExaminationService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.examinationService.getExamination(route.paramMap.get('id'));
  }
}
