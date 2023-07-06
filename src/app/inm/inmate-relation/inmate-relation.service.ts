import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {inmateRelationConsts} from './inmate-relation.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class InmateRelationService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteInmateRelation(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + inmateRelationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
