import {VacationCouncilApplication} from '../vacation-council-application/vacation-council-application.model';

export class VacationCouncil {
  public id: number = null;
  public dcId: number = null;
  public councilDate: Date = null;
  public councilCode: string = null;
  public councilComments: string = null;
  public accomplished: boolean = false;
  public vacationCouncilApplications: VacationCouncilApplication[] = [];
  
}
