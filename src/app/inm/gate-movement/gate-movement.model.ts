import {VehicleOccupant} from '../vehicle-occupant/vehicle-occupant.model';

export class GateMovement {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public inmateRecordId: number = null;
  public movementTypeId: number = null;
  public movementDate: Date = null;
  public inOutKind: string = null;
  public vacationId: number = null;
  public transferId: number = null;
  public visitorId: number = null;
  public vehicleId: number = null;
  public oppositeMovementId: number = null;
  public comments: string = null;
  public escortName: string = null;
  public escortStatus: string = null;
  public escortService: string = null;
  public visitDestinationPid: number = null;
  public vehicleDriverVisitorId: number = null;
  public visitId: number = null;
  public employeeId: number = null;
  public firstSearchEmployeeId: number = null;
  public secondSearchEmployeeId: number = null;
  public serialNo: number = null;
  public massNo: number = null;

  public vehicleOccupants: VehicleOccupant[] = [];
}
