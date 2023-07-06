import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ClassificationService} from './classification.service';

@Injectable({providedIn: 'root'})
export class ClassificationResolver implements Resolve<any> {

  constructor(private classificationService: ClassificationService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.classificationService.getClassification(route.paramMap.get('id'));
  }
}
