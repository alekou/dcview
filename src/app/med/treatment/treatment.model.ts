import {TreatmentLine} from '../treatment-line/treatment-line.model';
export class Treatment {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public doctorId: number = null;
  public hearingId: number = null;
  public prescriptionId: number = null;
  public serialNo: number = null;
  public treatmentDate: Date = null;
  public description: string = null;
  public stop: boolean = false;
  public isMedPsychiatric: boolean = false;
  
  public treatmentLines: TreatmentLine[] = []; 
}
