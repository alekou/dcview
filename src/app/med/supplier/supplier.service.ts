import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {supplierConsts} from './supplier.consts';

@Injectable({providedIn: 'root'})
export class SupplierService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getSupplier(id) {
    return this.http
      .get(
        environment.apiBaseUrl + supplierConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveSupplier(supplier) {
    return this.http
      .post(
        environment.apiBaseUrl + supplierConsts.saveUrl,
        supplier
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteSupplier(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + supplierConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAllSuppliers() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + supplierConsts.getAllUrl
      );
  }
}
