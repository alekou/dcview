import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {judgmentConsts} from './judgment.consts';
import {environment} from '../../../environments/environment';
import {inmateLaborApplicationConsts} from '../inmate-labor-application/inmate-labor-application.consts';

@Injectable({providedIn: 'root'})
export class JudgmentService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteJudgment(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + judgmentConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  changeCurrentJudgment(inmateId, newCurrentJudgmentId) {
    return this.http
      .post(
        environment.apiBaseUrl + judgmentConsts.changeCurrentUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, newCurrentJudgmentId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  mergeJudgments(data) {
    return this.http
      .post(
        environment.apiBaseUrl + judgmentConsts.mergeUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  unmergeJudgment(data) {
    return this.http
      .post(
        environment.apiBaseUrl + judgmentConsts.unmergeUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  cancelJudgment(data) {
    return this.http
      .post(
        environment.apiBaseUrl + judgmentConsts.cancelUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  revertCancelledJudgment(inmateId, judgmentIdToRevert) {
    return this.http
      .post(
        environment.apiBaseUrl + judgmentConsts.revertCancelledUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId, judgmentIdToRevert})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  moveBeneficialCalculation(data) {
    return this.http
      .post(
        environment.apiBaseUrl + judgmentConsts.moveBeneficialCalculationUrl,
        data
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getReleaseTimeSentenceTotals(inmateId) {
    return this.http
      .get(
        environment.apiBaseUrl + judgmentConsts.getReleaseTimeSentenceTotalsUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getJudgmentMiniListByInmate(inmateId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + judgmentConsts.getJudgmentMiniListByInmateUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
