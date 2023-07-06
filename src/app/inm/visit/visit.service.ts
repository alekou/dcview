import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {visitConsts} from './visit.consts';
import {environment} from '../../../environments/environment';
import {VisitLawyerAdd} from './visit-lawyer-add.model';

@Injectable({providedIn: 'root'})
export class VisitService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getVisit(id) {
    return this.http
      .get(
        environment.apiBaseUrl + visitConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveVisit(visit) {
    return this.http
      .post(
        environment.apiBaseUrl + visitConsts.saveUrl,
        visit
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  lawyerAdd(lawyerAdd: VisitLawyerAdd) {
      return this.http
        .post(
          environment.apiBaseUrl + visitConsts.lawyerAddUrl,
          lawyerAdd
        );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  deleteVisit(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
