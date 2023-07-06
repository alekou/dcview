import {Report} from '../../sa/report/report.model';

export class DoctorSession {
  public id: number = null;
  public dcId: number = null;
  public doctorId: number = null;
  public inmateId: number = null;
  public sessionTypeId: number = null;
  public doctorType: string = null;
  public sessionDate: Date = null;
  public description: string = null;
  public comments: string = null;
  public report: Report = null;

}
