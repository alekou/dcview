import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {LaborCatalogService} from './labor-catalog.service';


@Injectable({providedIn: 'root'})
export class LaborCatalogResolver implements Resolve<any> {

  constructor(private laborCatalogService: LaborCatalogService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.laborCatalogService.getInmateDetails(route.paramMap.get('id'));
  }

}

