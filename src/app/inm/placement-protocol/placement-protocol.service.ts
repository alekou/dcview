import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {placementProtocolConsts} from './placement-protocol.consts';


@Injectable({providedIn: 'root'})
export class PlacementProtocolService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getPlacementProtocol(id) {
    return this.http
      .get(
        environment.apiBaseUrl + placementProtocolConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  savePlacementProtocol(placementProtocol) {
    return this.http
      .post(
        environment.apiBaseUrl + placementProtocolConsts.saveUrl,
        placementProtocol
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deletePlacementProtocol(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + placementProtocolConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  createInmateLaborsForInmateLaborApplications(id) {
    return this.http
      .post(
        environment.apiBaseUrl + placementProtocolConsts.createInmateLaborsForInmateLaborApplicationsUrl,
        id
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
