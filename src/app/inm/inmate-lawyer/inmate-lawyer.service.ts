import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {inmateLawyerConsts} from './inmate-lawyer.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class InmateLawyerService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteInmateLawyer(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + inmateLawyerConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
