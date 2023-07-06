import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {bloodSamplingConsts} from './blood-sampling.consts';

@Injectable({providedIn: 'root'})
export class BloodSamplingService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getBloodSampling(id) {
    return this.http
      .get(
        environment.apiBaseUrl + bloodSamplingConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveBloodSampling(bloodSampling) {
    return this.http
      .post(
        environment.apiBaseUrl + bloodSamplingConsts.saveUrl,
        bloodSampling
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteBloodSampling(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + bloodSamplingConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllBloodSamplings() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + bloodSamplingConsts.getAllUrl
      );
  }
}
