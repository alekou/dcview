import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {prescriptionLineConsts} from './prescription-line.consts';

@Injectable({providedIn: 'root'})
export class PrescriptionLineService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deletePrescriptionLine(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + prescriptionLineConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  generatePrescriptionLines(data) {
    return this.http
      .post(
        environment.apiBaseUrl + prescriptionLineConsts.generateLinesUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
