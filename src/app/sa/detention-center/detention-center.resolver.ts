import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DetentionCenterService} from './detention-center.service';

@Injectable({providedIn: 'root'})
export class DetentionCenterResolver implements Resolve<any> {

  constructor(private detentionCenterService: DetentionCenterService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.detentionCenterService.getDetentionCenter(route.paramMap.get('id'));
  }
}
