import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DcConfigService} from './dc-config.service';

@Injectable({providedIn: 'root'})
export class DcConfigResolver implements Resolve<any> {

  constructor(private dcConfigService: DcConfigService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.dcConfigService.getDcConfigByDc();
  }
}
