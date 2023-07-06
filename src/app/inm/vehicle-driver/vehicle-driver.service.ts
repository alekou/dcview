import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {vehicleDriverConsts} from './vehicle-driver.consts';

@Injectable({providedIn: 'root'})
export class VehicleDriverService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVehicleDriver(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vehicleDriverConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
