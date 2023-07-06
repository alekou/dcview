import {VisitApplicationVisitor} from '../visit-application-visitor/visit-application-visitor.model';

export class VisitApplication {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;

  public visitorName: string = null;
  public visitTypeId: number = null;
  public applicationNo: string = null;
  public applicationDate: Date = null;
  public applicationText: string = null;
  public socialWorkerMotion: boolean = false;
  public comments: string = null;
  
  public approved: string = null;
  public approvalDate: Date = null;
  public approvalNo: string = null;
  public approvalText: string = null;

  public frequent: boolean = false;
  public visitDate: Date = null;
  public visitDateFrom: Date = null;
  public visitDateTo: Date = null;
  public frequency: string = null;

  public visitApplicationVisitors: VisitApplicationVisitor[] = [];

  public approvedLabel: string = null;
  public visitTypeDescription: string = null;
}
