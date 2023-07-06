import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {inmateAreaConsts} from './inmate-area.consts';

@Injectable({providedIn: 'root'})
export class InmateAreaService {

  constructor(
    private http: HttpClient
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveInmateArea(inmateArea) {
    return this.http
      .post(environment.apiBaseUrl + inmateAreaConsts.saveUrl,
        inmateArea
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  moveInmate(lastInmateArea, newInmateArea) {
    return this.http
      .post(environment.apiBaseUrl + inmateAreaConsts.saveMoveInmateAreaUrl,
        {lastInmateArea: lastInmateArea, newInmateArea: newInmateArea}
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getActiveReservedInmateAreasInDc() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + inmateAreaConsts.getActiveReservedInmateAreasInDcUrl
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getInmateAreaSumUpOfDc() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + inmateAreaConsts.getInmateAreaSumUpOfDcUrl
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
