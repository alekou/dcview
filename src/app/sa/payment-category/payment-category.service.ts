import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {paymentCategoryConsts} from './payment-category.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class PaymentCategoryService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getActivePaymentCategoriesByUserDc(ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + paymentCategoryConsts.getActiveByUserDcUrl,
        {
          params: this.toitsuSharedService.initHttpParams({ids})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
