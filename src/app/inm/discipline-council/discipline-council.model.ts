import {DiscCouncilOffense} from '../disc-council-offense/disc-council-offense.model';
import {DisciplineDecision} from '../discipline-decision/discipline-decision.model';

export class DisciplineCouncil {

  public id: number = null;
  public dcId: number = null;
  public councilNo: string = null;
  public councilDate: Date = null;
  public completed: boolean = false;
  public comments: string = null;

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  public discCouncilOffenses: DiscCouncilOffense[] = [];
  public disciplineDecisions: DisciplineDecision[] = [];

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
