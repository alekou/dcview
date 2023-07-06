import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {policeDepartmentConsts} from './police-department.consts';

@Injectable({providedIn: 'root'})
export class PoliceDepartmentService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getPoliceDepartment(id) {
    return this.http
      .get(
        environment.apiBaseUrl + policeDepartmentConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  savePoliceDepartment(policeDepartment) {
    return this.http
      .post(
        environment.apiBaseUrl + policeDepartmentConsts.saveUrl, policeDepartment
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActivePoliceDepartments(ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + policeDepartmentConsts.getActiveUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
