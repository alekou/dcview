import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {Injectable} from '@angular/core';
import {vacationTypeConsts} from './vacation-type.consts';

// CRUD Υλοποιήσεις για τη ΒΔ
@Injectable({providedIn: 'root'})
export class VacationTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
    
  // READ
  getVacationType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + vacationTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // GET ALL ACTIVE VACATIONTYPES BY USERDC
  getActiveVacationTypesByUserDc(ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + vacationTypeConsts.getActiveByUserDcUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }
  
  // CREATE και UPDATE μαζί, με βάση το id
  saveVacationType(vacationType) {
    return this.http
      .post(
        environment.apiBaseUrl + vacationTypeConsts.saveUrl, vacationType);
  }
  
  // READ ALL
  getAllVacationTypes() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + vacationTypeConsts.getAllUrl
      );
  }
  
  // GET ALL ACTIVE
  getAllActiveVacationTypes() {
    return this.http
      .get<{}[]> (
        environment.apiBaseUrl + vacationTypeConsts.getAllActiveUrl
      );
  }
}
