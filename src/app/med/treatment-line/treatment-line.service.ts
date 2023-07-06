import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {treatmentLineConsts} from './treatment-line.consts';

@Injectable({providedIn: 'root'})
export class TreatmentLineService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteTreatmentLine(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + treatmentLineConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
