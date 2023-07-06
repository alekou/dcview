import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {detentionCenterConsts} from './detention-center.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class DetentionCenterService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  getDetentionCenter(id) {
    return this.http
      .get(
        environment.apiBaseUrl + detentionCenterConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveDetentionCenter(detentionCenter) {
    return this.http
      .post(
        environment.apiBaseUrl + detentionCenterConsts.saveUrl, detentionCenter);
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getDetentionCenters() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + detentionCenterConsts.getDetentionCentersUrl,
        {
          params: this.toitsuSharedService.initHttpParams({})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getOtherDetentionCenters(includedIds) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + detentionCenterConsts.getOtherDetentionCentersUrl,
        {
          params: this.toitsuSharedService.initHttpParams({includedIds})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getName(id) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + detentionCenterConsts.getNameUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
