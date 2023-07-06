import {PrescriptionLine} from '../prescription-line/prescription-line.model';
export class Prescription {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public doctorId: number = null;
  public serialNo: number = null;
  public prescriptionDate: Date = null;
  public description: string = null;
  public isExecuted: boolean = false;
  public isPsychiatric: boolean = false;

  prescriptionLines: PrescriptionLine[] = [];
}
