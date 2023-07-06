import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {discReportWitnessConsts} from './disc-report-witness.consts';


@Injectable({providedIn: 'root'})
export class DiscReportWitnessService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDiscReportWitness(id) {
    return this.http
      .get(
        environment.apiBaseUrl + discReportWitnessConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveDiscReportWitness(discReportWitness) {
    return this.http
      .post(
        environment.apiBaseUrl + discReportWitnessConsts.saveUrl,
        discReportWitness
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteDiscReportWitness(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + discReportWitnessConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }


  
  
  
}
