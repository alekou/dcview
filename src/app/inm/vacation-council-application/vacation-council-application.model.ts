import {VacationApplication} from '../vacation-application/vacation-application.model';

export class VacationCouncilApplication {
  public id: number = null;
  public vacationCouncilId: number = null;
  public vacationApplicationId: number = null;
  public isPostponed: boolean = false;

  public vacationApplication: VacationApplication = null;
}
