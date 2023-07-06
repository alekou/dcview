import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {visitVisitorConsts} from './visit-visitor.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class VisitVisitorService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVisitVisitor(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitVisitorConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
