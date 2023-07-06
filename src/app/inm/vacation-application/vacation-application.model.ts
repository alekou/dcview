import {Vacation} from '../vacation/vacation.model';

class VacationCouncilInMotionDetails {
  
  public councilDate: Date = null;
  public councilCode: number = null;
  public isPostponed: boolean = false;
}

export class VacationApplication {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public inmateFullName: string = null;
  public inmateRecordId: number = null;
  public vacationTypeId: number = null;
  public vacationTypeDescription: string = null;
  public protocolNo: string = null;
  public applicationDate: Date = null;
  public destination: string = null;
  public reason: string = null;
  public applicationFromDate: Date = null;
  public applicationToDate: Date = null;
  public applicationDays: number = null;
  public applicationHours: number = null;
  public applicationStatus: string = null;
  public approvalStatus: string = null;
  public motionProgressDate: Date = null;
  public motionComments: string = null;
  public pendingFelonies: boolean = false;
  public pendingFeloniesComments: string = null;
  public secMotionCheck: boolean = false;
  public doctorMotionCheck: boolean = false;
  
  public vacation: Vacation = new Vacation();
  public vacationCouncilInMotionDetails: VacationCouncilInMotionDetails[] = [];

}
