import {VehicleDriver} from '../vehicle-driver/vehicle-driver.model';

export class Vehicle {
  public id: number = null;
  public plateNumber: string = null;
  public manufacturerPid: number = null;
  public carModel: string = null;
  public colorPid: number = null;
  public comments: string = null;

  public vehicleDrivers: VehicleDriver[] = [];

}
