import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {areaConsts} from './area.consts';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class AreaService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService,
    private translate: TranslateService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getArea(id) {
    return this.http
      .get(environment.apiBaseUrl + areaConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveArea(area) {
    return this.http
      .post(environment.apiBaseUrl + areaConsts.saveUrl,
        area
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteArea(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + areaConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getParentAreas() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaConsts.getAreasWithoutPositionsUrl
      )
      .pipe(
        map(responseData => {
          return responseData.map(responseItem => {
            responseItem['inactive'] = true;
            return responseItem;
          });
        })
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getTopAreas() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaConsts.getTopParentAreasUrl
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getChildAreasByParentArea(id, parentNode) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaConsts.getChildAreasByParentAreaUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      )
      .pipe(
        map(responseData => {
          return responseData.map(responseItem => {
            if (responseItem['positions'] !== null || undefined) {
              return {
                expandedIcon: 'fa fa-map-marker',
                collapsedIcon: 'fa fa-map-pin',
                data: {
                  id: responseItem['id'],
                  code: responseItem['code'],
                  fullDescription: responseItem['fullDescription'],
                  areaTypeDescription: responseItem['areaTypeDescription'],
                  inmates: (responseItem['positions'] - responseItem['availablePositions'] - responseItem['reservedPositions']),
                  positions: responseItem['positions'],
                  availablePositions: responseItem['availablePositions'],
                  reservedPositions: responseItem['reservedPositions'],
                  parentAreaId: responseItem['parentAreaId'],
                  parent: parentNode.data.code
                },
                label: responseItem['code'] +
                  ' (Κ:' + (responseItem['positions'] - responseItem['availablePositions'] - responseItem['reservedPositions']) +
                  '/Α:' + '*' +
                  '/Θ:' + responseItem['positions'] +
                  '/ΔΘ:' + responseItem['availablePositions'] +
                  '/ΚΘ:' + responseItem['reservedPositions'] + ')',
                leaf: true
              };
            } else {
              return {
                expandedIcon: 'fa fa-map-marker',
                collapsedIcon: 'fa fa-map-pin',
                data: {
                  id: responseItem['id'],
                  code: responseItem['code'],
                  fullDescription: responseItem['fullDescription'],
                  areaTypeDescription: responseItem['areaTypeDescription'],
                  inmates: (responseItem['positionsSum'] - responseItem['availablePositionsSum'] - responseItem['reservedPositionsSum']),
                  positions: responseItem['positions'],
                  positionsSum: responseItem['positionsSum'],
                  availablePositionsSum: responseItem['availablePositionsSum'],
                  reservedPositionsSum: responseItem['reservedPositionsSum'],
                  parentAreaId: responseItem['parentAreaId'],
                  parent: parentNode.data.code,
                },
                label: responseItem['code'] +
                  ' (Κ:' + (responseItem['positionsSum'] - responseItem['availablePositionsSum'] - responseItem['reservedPositionsSum']) +
                  '/Α:' + '*' +
                  '/Θ:' + responseItem['positionsSum'] +
                  '/ΔΘ:' + responseItem['availablePositionsSum'] +
                  '/ΚΘ:' + responseItem['reservedPositionsSum'] + ')',
                leaf: false
              };
            }
          });
        })
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllChildAreas() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaConsts.getAllChildAreasUrl
      )
      .pipe(
        map(responseData => {
          return responseData.map(responseItem => {
            responseItem['label'] = responseItem['fullDescription'] +
              ' [' + this.translate.instant('area.availablePositions') + ': ' + responseItem['availablePositions'] + ']';
            return responseItem;
          });
        })
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllAreas(dcId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaConsts.getAllAreasUrl,
        {
          params: this.toitsuSharedService.initHttpParams({dcId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAreasByCode(code) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaConsts.getAreasByCodeUrl,
        {
          params: this.toitsuSharedService.initHttpParams({code})
        }
      )
      .pipe(
        map(responseData => {
          return responseData.map(responseItem => {
            if (responseItem['positions'] !== null || undefined) {
              return {
                expandedIcon: 'fa fa-search',
                collapsedIcon: 'fa fa-search',
                data: {
                  id: responseItem['id'],
                  code: responseItem['code'],
                  fullDescription: responseItem['fullDescription'],
                  areaTypeDescription: responseItem['areaTypeDescription'],
                  inmates: (responseItem['positions'] - responseItem['availablePositions'] - responseItem['reservedPositions']),
                  positions: responseItem['positions'],
                  availablePositions: responseItem['availablePositions'],
                  reservedPositions: responseItem['reservedPositions'],
                  parentAreaId: responseItem['parentAreaId'],
                },
                label: responseItem['code'] +
                  ' (Κ:' + (responseItem['positions'] - responseItem['availablePositions'] - responseItem['reservedPositions']) +
                  '/Α:' + '*' +
                  '/Θ:' + responseItem['positions'] +
                  '/ΔΘ:' + responseItem['availablePositions'] +
                  '/ΚΘ:' + responseItem['reservedPositions'] + ')',
                leaf: true
              };
            } else {
              return {
                expandedIcon: 'fa fa-search',
                collapsedIcon: 'fa fa-search',
                data: {
                  id: responseItem['id'],
                  code: responseItem['code'],
                  fullDescription: responseItem['fullDescription'],
                  areaTypeDescription: responseItem['areaTypeDescription'],
                  inmates: (responseItem['positionsSum'] - responseItem['availablePositionsSum'] - responseItem['reservedPositionsSum']),
                  positions: responseItem['positions'],
                  positionsSum: responseItem['positionsSum'],
                  availablePositionsSum: responseItem['availablePositionsSum'],
                  reservedPositionsSum: responseItem['reservedPositionsSum'],
                  parentAreaId: responseItem['parentAreaId'],
                },
                label: responseItem['code'] +
                  ' (Κ:' + (responseItem['positionsSum'] - responseItem['availablePositionsSum'] - responseItem['reservedPositionsSum']) +
                  '/Α:' + '*' +
                  '/Θ:' + responseItem['positionsSum'] +
                  '/ΔΘ:' + responseItem['availablePositionsSum'] +
                  '/ΚΘ:' + responseItem['reservedPositionsSum'] + ')',
                leaf: false
              };
            }
          });
        })
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getAreasWithoutPositions(ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + areaConsts.getAreasWithoutPositionsUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
