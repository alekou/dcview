import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {InmateService} from './inmate.service';

@Injectable({providedIn: 'root'})
export class InmateFolderResolver implements Resolve<any> {
  
  constructor(private inmateService: InmateService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.inmateService.getInmateFolder(route.paramMap.get('id'));
  }
}
