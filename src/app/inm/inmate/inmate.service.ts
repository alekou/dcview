import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {inmateConsts} from './inmate.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class InmateService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getInmate(id) {
    return this.http
      .get(
        environment.apiBaseUrl + inmateConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveInmate(inmate) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateConsts.saveUrl,
        inmate
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteInmate(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + inmateConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getInmateFolder(id) {
    return this.http
      .get(
        environment.apiBaseUrl + inmateConsts.getFolderUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveInmateFolder(inmate) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateConsts.saveFolderUrl,
        inmate
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  closeInmateFolder(data) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateConsts.closeFolderUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  reopenInmateFolder(inmateId) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateConsts.reopenFolderUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getOldInmate(id) {
    return this.http
      .get(
        environment.apiBaseUrl + inmateConsts.getOldUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  acceptOldInmate(inmate) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateConsts.acceptOldUrl,
        inmate
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActiveInmates() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + inmateConsts.getActiveUrl
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getLastRecordInmates() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + inmateConsts.getLastRecordUrl
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getInmateMini(id) {
    return this.http
      .get(
        environment.apiBaseUrl + inmateConsts.getMiniUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getInmateEducationDetails(id) {
    return this.http
      .get(
        environment.apiBaseUrl + inmateConsts.getEducationDetailsUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveInmateMedDetails(inmate) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateConsts.saveMedDetailsUrl,
        inmate
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
