import {ProgramType} from '../../sa/program-type/program-type.model';
import {ProgramApplication} from '../program-application/program-application.model';

export class Program {
  public id: number = null;
  public dcId: number = null;
  public programTypeId: number = null;
  public programType: ProgramType = null;
  public description: string = null;
  public goal: string = null;
  public subsidizer: string = null;
  public startDate: Date = null;
  public endDate: Date = null;
  public totalHours: number = null;
  public status: string = null;
  public certification: boolean = false;
  public professionId: number = null;
  
  public programApplications: ProgramApplication[] = [];
}
