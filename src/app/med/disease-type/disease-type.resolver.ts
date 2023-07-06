import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DiseaseTypeService} from './disease-type.service';

@Injectable({providedIn: 'root'})
export class DiseaseTypeResolver implements Resolve<any> {
  
  constructor(private diseaseTypeService: DiseaseTypeService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.diseaseTypeService.getDiseaseType(route.paramMap.get('id'));
  }
}
