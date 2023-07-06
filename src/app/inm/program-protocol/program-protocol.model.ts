import {ProgramApplication} from '../program-application/program-application.model';

export class ProgramProtocol {
  public id: number = null;
  public dcId: number = null;
  public programId: number = null;
  public protocolDate: Date = null;
  public comments: string = null;
  public approved: boolean = false;
  public protocolNo: string = null;
  public approvalDate: Date = null;
  public approvalComments: string = null;
  public programApplications: ProgramApplication[] = [];
}
