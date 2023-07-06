import {VisitProgramTimeFrame} from '../visit-program-time-frame/visit-program-time-frame.model';
import {VisitProgramDetails} from '../visit-program-details/visit-program-time-frame.model';

export class VisitProgram {
  public id: number = null;
  public dcId: number = null;
  public description: number = null;
  public maxSimultaneous: string = null;
  
  public visitProgramTimeFrames: VisitProgramTimeFrame[] = [];
  public visitProgramDetails: VisitProgramDetails[] = [];
}
