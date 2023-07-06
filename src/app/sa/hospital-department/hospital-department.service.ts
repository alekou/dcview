import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {hospitalDepartmentConsts} from './hospital-department.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class HospitalDepartmentService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteHospitalDepartment(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + hospitalDepartmentConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getActiveHospitalDepartmentsByHospital(hospitalId, ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + hospitalDepartmentConsts.getActiveByHospitalUrl,
        {
          params: this.toitsuSharedService.initHttpParams({hospitalId, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
