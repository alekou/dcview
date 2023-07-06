import {gateMovementConsts} from './gate-movement.consts';
import {environment} from '../../../environments/environment';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {GateMovement} from './gate-movement.model';

@Injectable({providedIn: 'root'})
export class GateMovementService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  getGateMovement(id) {
    return this.http
      .get(
        environment.apiBaseUrl + gateMovementConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveGateMovement(gateMovement: GateMovement) {
    return this.http
      .post(
        environment.apiBaseUrl + gateMovementConsts.saveUrl,
        gateMovement
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteGateMovement(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + gateMovementConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  createOppositeMovement(id: number, gateMovement: GateMovement) {
    return this.http
      .post(
        environment.apiBaseUrl + gateMovementConsts.createOppositeMovementUrl,
        gateMovement,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  gateMovementMassClose(gateMovements) {
    return this.http
      .post(
        environment.apiBaseUrl + gateMovementConsts.gateMovementMassCloseUrl,
        gateMovements
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  gateMovementMassCreate(gateMovements: GateMovement[]) {
    return this.http
      .post(
        environment.apiBaseUrl + gateMovementConsts.gateMovementMassCreateUrl,
        gateMovements
      );
  }
}
