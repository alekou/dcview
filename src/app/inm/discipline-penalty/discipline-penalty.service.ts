import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {disciplinePenaltyConsts} from './discipline-penalty.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class DisciplinePenaltyService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteDisciplinePenalty(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + disciplinePenaltyConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
