import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {VisitorService} from './visitor.service';

@Injectable({providedIn: 'root'})
export class VisitorResolver implements Resolve<any> {
  
  constructor(private visitorService: VisitorService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.visitorService.getVisitor(route.paramMap.get('id'));
  }
}
