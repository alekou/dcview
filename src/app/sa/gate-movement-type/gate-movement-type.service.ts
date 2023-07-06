import { environment } from 'src/environments/environment';
import {gateMovementTypeConsts} from './gate-movement-type.consts';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class GateMovementTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  getAllGateMovementTypes() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + gateMovementTypeConsts.getAllMiniUrl
      );
  }

  saveGateMovementType(gateMovementType: any) {
    return this.http
      .post(
        environment.apiBaseUrl + gateMovementTypeConsts.saveUrl,
        gateMovementType
      );
  }

  deleteGateMovementType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + gateMovementTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  getGateMovementType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + gateMovementTypeConsts.getByIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
