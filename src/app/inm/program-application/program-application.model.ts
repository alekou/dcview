import {Program} from '../program/program.model';

export class ProgramApplication {
  public id: number = null;
  public protocolId: number = null;
  public programProtocolDescription: string = null;
  public inmateId: number = null;
  public dcId: number = null;
  public protocolNo: string = null;
  public applicationDate: Date = null;
  public programId: number = null;
  public program: Program = null;
  public professionId: number = null;
  public comments: string = null;
  public startDate: Date = null;
  public endDate: Date = null;
  public lateEntry: boolean = false;
  public graduate: boolean = false;
  public certification: boolean = false;
  public rejected: boolean = false;
  public rejectedDate: Date = null;
  public rejectedComments: string = null;
  public withdrawal: boolean = false;
  public withdrawalReasonPid: number = null;
  public withdrawalComments: string = null;
}
