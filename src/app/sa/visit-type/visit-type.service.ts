import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {visitTypeConsts} from './visit-type.consts';

@Injectable({providedIn: 'root'})
export class VisitTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // GET
  getVisitType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + visitTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // CREATE και UPDATE μαζί, με βάση το id
  saveVisitType(visitType) {
    return this.http
      .post(
        environment.apiBaseUrl + visitTypeConsts.saveUrl, visitType);
  }
  
  // GET ALL
  getAllVisitTypes() {
    return this.http
      .get<{}[]>(environment.apiBaseUrl + visitTypeConsts.getAllUrl
      );
  }
  
  // GET ALL ACTIVE
  getAllActiveVisitTypes() {
    return this.http
      .get<{}[]> (
        environment.apiBaseUrl + visitTypeConsts.getAllActiveUrl
      );
  }
}
