import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {classificationConsts} from './classification.consts';

// CRUD Υλοποιήσεις για τη ΒΔ
@Injectable({providedIn: 'root'})
export class ClassificationService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // READ
  getClassification(id) {
    return this.http
      .get(
        environment.apiBaseUrl + classificationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // CREATE και UPDATE μαζί, με βάση το id
  saveClassification(classification) {
    return this.http
      .post(
        environment.apiBaseUrl + classificationConsts.saveUrl, classification);
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActiveClassificationsByTypeOption(typeOption, ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + classificationConsts.getActiveByTypeOptionUrl,
        {
          params: this.toitsuSharedService.initHttpParams({typeOption, ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
