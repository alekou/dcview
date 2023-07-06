import {DiscReportOffense} from '../disc-report-offense/disc-report-offense.model';
import {DiscReportWitness} from '../disc-report-witness/disc-report-witness.model';

export class DisciplineReport {
  
  public id: number = null;
  public dcId: number = null;
  public reportNo: string = null;
  public reportDate: Date = null;
  public reporterType: string = null;
  public employeeId: number = null;
  public inmateId: number = null;
  public reporterFirstName: string = null;
  public reporterLastName: string = null;
  public comments: string = null;

  // ---------------------------------------------------------------------------------------------------------------------------------------

  public discReportOffenses: DiscReportOffense[] = [];
  public discReportWitnesses: DiscReportWitness[] = [];

  // ---------------------------------------------------------------------------------------------------------------------------------------

  public reportName: string = null;



}
