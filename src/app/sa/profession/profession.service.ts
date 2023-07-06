import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {professionConsts} from './profession.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ProfessionService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getFactors() {
    return [
      {value: 0.00, label: '0,00'},
      {value: 0.25, label: '0,25'},
      {value: 0.50, label: '0,50'},
      {value: 0.75, label: '0,75'},
      {value: 1.00, label: '1,00'},
      {value: 1.25, label: '1,25'},
      {value: 1.50, label: '1,50'},
      {value: 1.75, label: '1,75'},
      {value: 2.00, label: '2,00'}
    ];
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActiveProfessionsByUserDc(ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + professionConsts.getActiveByUserDcUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getLastInmateProfession(inmateId) {
    return this.http
      .get(
        environment.apiBaseUrl + professionConsts.getLastInmateProfessionUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }
}
