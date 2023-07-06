import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {LexicographyService} from './lexicography.service';

@Injectable({providedIn: 'root'})
export class LexicographyResolver implements Resolve<any> {

  constructor(private lexicographyService: LexicographyService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.lexicographyService.getAllLexicographies();
  }
}
