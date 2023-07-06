import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DirectorService} from './director.service';

@Injectable({providedIn: 'root'})
export class DirectorResolver implements Resolve<any> {

  constructor(private directorService: DirectorService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.directorService.getDirector(route.paramMap.get('id'));
  }
}
