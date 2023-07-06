import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {visitApplicationVisitorConsts} from './visit-application-visitor.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class VisitApplicationVisitorService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVisitApplicationVisitor(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitApplicationVisitorConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
