import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {CountryService} from './country.service';

@Injectable({providedIn: 'root'})
export class CountryResolver implements Resolve<any> {

  constructor(private countryService: CountryService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.countryService.getCountry(route.paramMap.get('id'));
  }
}
