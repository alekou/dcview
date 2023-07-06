import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {TemplateService} from './template.service';

@Injectable({providedIn: 'root'})
export class TemplateResolver implements Resolve<any> {
  
  constructor(private templateService: TemplateService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.templateService.getTemplate(route.paramMap.get('id'));
  }
}
