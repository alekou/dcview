import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {visitorConsts} from './visitor.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class VisitorService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getVisitor(id) {
    return this.http
      .get(
        environment.apiBaseUrl + visitorConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  getVisitorMini(id) {
    return this.http
      .get(
        environment.apiBaseUrl + visitorConsts.getMiniUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  getVisitorsByInmateIdAndVisitTypeId(inmateId, visitTypeId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + visitorConsts.getVisitorsByInmateIdAndVisitTypeIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, visitTypeId})
        }
      );
  }

  getVisitorsByInmateId(inmateId, relationKind?, ) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + visitorConsts.getVisitorsByInmateIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, relationKind})
        }
      );
  }

  getInmateIdsByVisitorId(visitorId) {
    return this.http
      .get(
        environment.apiBaseUrl + visitorConsts.getInmateIdsByVisitorIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({visitorId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveVisitor(visitor) {
    return this.http
      .post(
        environment.apiBaseUrl + visitorConsts.saveUrl,
        visitor
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteVisitor(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitorConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
