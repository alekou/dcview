import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {DiseaseService} from './disease.service';
@Injectable({providedIn: 'root'})
export class DiseaseResolver implements Resolve<any> {

  constructor(private diseaseService: DiseaseService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.diseaseService.getDisease(route.paramMap.get('id'));
  }
}
