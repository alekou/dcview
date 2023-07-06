import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {vehicleConsts} from './vehicle.consts';

@Injectable({providedIn: 'root'})
export class VehicleService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  getAllVehicles() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + vehicleConsts.getAllUrl
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getVehicle(id) {
    return this.http
      .get(
        environment.apiBaseUrl + vehicleConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveVehicle(vehicle) {
    return this.http
      .post(
        environment.apiBaseUrl + vehicleConsts.saveUrl,
        vehicle
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteVehicle(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + vehicleConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
