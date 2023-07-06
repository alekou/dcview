import {ProgramApplication} from '../program-application/program-application.model';
import {InmateLaborApplication} from '../inmate-labor-application/inmate-labor-application.model';

export class PlacementProtocol {
  public id: number = null;
  public dcId: number = null;
  public areaId: number = null;
  public locationPid: number = null;
  public compositionDate: Date = null;
  public placementFromDate: Date = null;
  public placementToDate: Date = null;
  public comments: string = null;
  public approved: boolean = false;
  public protocolNo: string = null;
  public protocolDate: Date = null;
  public approvalComments: string = null;
  public inmateLaborApplications: InmateLaborApplication[] = [];
}
