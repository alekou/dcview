import {Inmate} from '../inmate/inmate.model';

export class DiscReportWitness {
  public id: number = null;
  public disciplineReportId: number = null;
  public witnessType: string = null;
  public employeeId: number = null;
  public inmateId: number = null;
  public witnessFirstName: string = null;
  public witnessLastName: string = null;
  public witnessFullName: string = null;
  public witnessTypeLabel: string = null;
  
  public inmate: Inmate = null;
  
}
